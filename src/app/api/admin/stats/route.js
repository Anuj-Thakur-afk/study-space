import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import Booking from "@/models/Booking";
import Building from "@/models/Building";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access: Admin required" }, { status: 403 });
    }

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

    const totalRooms = await StudySpace.countDocuments({
      isActive: true,
      studyType: { $in: ["Group Study", "Discussion Room"] },
    });

    const recentBookings = await Booking.find()
      .populate("studySpaceId", "name buildingName")
      .populate("seatId", "seatNumber")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Utilization by Building aggregation
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

    // Most-used & least-used spaces
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

    // Peak time slots summary
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

    return NextResponse.json({
      stats: {
        totalSpaces,
        totalRooms,
        totalSeats,
        availableSeats,
        bookedSeats,
        occupiedSeats,
        unavailableSeats,
        totalBookings,
      },
      recentBookings: recentBookings.map((b) => ({ ...b, id: b._id.toString() })),
      buildingStats,
      mostUsedSpaces,
      leastUsedSpaces,
      peakTimeDistribution: Object.entries(slotCounts).map(([slot, count]) => ({ slot, count })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to load dashboard metrics" }, { status: 500 });
  }
}
