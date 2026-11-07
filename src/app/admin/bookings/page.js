import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import User from "@/models/User";
import BookingManagement from "@/components/admin/BookingManagement";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Bookings | StudySpace Admin",
};

async function getAllBookings() {
  await connectDB();
  const bookings = await Booking.find()
    .populate("studySpaceId", "name buildingName floor zone studyType")
    .populate("seatId", "seatNumber features")
    .populate("userId", "name email")
    .sort({ bookingDate: -1, startTime: -1 })
    .lean();

  return bookings.map((b) => ({
    ...b,
    id: b._id.toString(),
    _id: b._id.toString(),
  }));
}

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings();

  return <BookingManagement initialBookings={bookings} />;
}
