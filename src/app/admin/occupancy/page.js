import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import User from "@/models/User";
import OccupancyManagement from "@/components/admin/OccupancyManagement";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Occupancy Verification | StudySpace Admin",
};

async function getAdminOccupancyBookings() {
  await connectDB();
  const bookings = await Booking.find()
    .populate("studySpaceId", "name buildingName floor zone")
    .populate("seatId", "seatNumber status")
    .populate("userId", "name email")
    .sort({ bookingDate: -1, startTime: -1 })
    .lean();

  return bookings.map((b) => ({
    ...b,
    id: b._id.toString(),
    _id: b._id.toString(),
  }));
}

export default async function AdminOccupancyPage() {
  const bookings = await getAdminOccupancyBookings();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#BDBDBD] pb-6">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
          Physical Attendance
        </span>
        <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#171717] sm:text-4xl">
          Occupancy Verification
        </h1>
        <p className="mt-1 text-xs text-[#777777]">
          Verify student check-in, toggle real-time physical occupancy, and release desks after sessions finish.
        </p>
      </div>

      <OccupancyManagement initialBookings={bookings} />
    </div>
  );
}
