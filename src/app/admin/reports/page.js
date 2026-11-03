import connectDB from "@/lib/db";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import Booking from "@/models/Booking";
import Building from "@/models/Building";
import User from "@/models/User";
import UtilizationReport from "@/components/admin/UtilizationReport";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Utilization Reports | StudySpace Admin",
};

async function getReportData() {
  await connectDB();

  const [totalSpaces, totalSeats, availableSeats, bookedSeats, occupiedSeats, unavailableSeats, totalBookings] =
    await Promise.all([
      StudySpace.countDocuments({ isActive: true }),
      Seat.countDocuments(),
      Seat.countDocuments({ status: "Available" }),
      Seat.countDocuments({ status: "Booked" }),
      Seat.countDocuments({ status: "Occupied" }),
      Seat.countDocuments({ status: "Unavailable" }),
      Booking.countDocuments(),
    ]);

  const buildings = await Building.find().lean();
  const spaces = await StudySpace.find({ isActive: true }).lean();

  const buildingStats = await Promise.all(
    buildings.map(async (b) => {
      const buildingSpaces = spaces.filter((s) => s.buildingName === b.name);
      const spaceIds = buildingSpaces.map((s) => s._id);
      const bookingCount = await Booking.countDocuments({ studySpaceId: { $in: spaceIds } });
      const seatCount = await Seat.countDocuments({ studySpaceId: { $in: spaceIds } });
      return {
        buildingName: b.name,
        spacesCount: buildingSpaces.length,
        seatCount,
        bookingCount,
      };
    })
  );

  const spaceUtilization = await Promise.all(
    spaces.map(async (sp) => {
      const count = await Booking.countDocuments({ studySpaceId: sp._id });
      return {
        id: sp._id.toString(),
        name: sp.name,
        buildingName: sp.buildingName,
        studyType: sp.studyType,
        totalSeats: sp.totalSeats,
        bookingCount: count,
      };
    })
  );

  spaceUtilization.sort((a, b) => b.bookingCount - a.bookingCount);
  const mostUsedSpaces = spaceUtilization.slice(0, 3);
  const leastUsedSpaces = [...spaceUtilization].reverse().slice(0, 3);

  const bookings = await Booking.find({ status: { $ne: "Cancelled" } }).select("startTime endTime").lean();
  const slotCounts = {
    "08:00 - 10:00": 0,
    "10:00 - 12:00": 0,
    "12:00 - 14:00": 0,
    "14:00 - 16:00": 0,
    "16:00 - 18:00": 0,
    "18:00 - 20:00": 0,
  };

  bookings.forEach((b) => {
    const start = b.startTime;
    if (start < "10:00") slotCounts["08:00 - 10:00"]++;
    else if (start < "12:00") slotCounts["10:00 - 12:00"]++;
    else if (start < "14:00") slotCounts["12:00 - 14:00"]++;
    else if (start < "16:00") slotCounts["14:00 - 16:00"]++;
    else if (start < "18:00") slotCounts["16:00 - 18:00"]++;
    else slotCounts["18:00 - 20:00"]++;
  });

  return {
    stats: {
      totalSpaces,
      totalSeats,
      availableSeats,
      bookedSeats,
      occupiedSeats,
      unavailableSeats,
      totalBookings,
    },
    buildingStats,
    mostUsedSpaces,
    leastUsedSpaces,
    peakTimeDistribution: Object.entries(slotCounts).map(([slot, count]) => ({ slot, count })),
  };
}

export default async function AdminReportsPage() {
  const reportData = await getReportData();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#E69A68]">
          Module 3 Analytics
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-[#263653]">
          Campus Space Utilization Reports
        </h1>
        <p className="mt-1 text-xs text-[#777777]">
          Data-driven summaries on high-traffic study rooms, underutilized zones, building distributions, and peak examination times.
        </p>
      </div>

      <UtilizationReport reportData={reportData} />
    </div>
  );
}
