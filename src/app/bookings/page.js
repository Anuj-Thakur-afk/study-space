import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import User from "@/models/User";
import BookingHistory from "@/components/student/BookingHistory";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Study Space Bookings | StudySpace",
  description: "View and manage your upcoming and past study space reservations.",
};

async function getStudentBookings(userId) {
  await connectDB();
  const bookings = await Booking.find({ userId })
    .populate("studySpaceId", "name buildingName floor zone studyType")
    .populate("seatId", "seatNumber features")
    .sort({ bookingDate: -1, startTime: -1 })
    .lean();

  return bookings.map((b) => ({
    ...b,
    id: b._id.toString(),
    _id: b._id.toString(),
  }));
}

export default async function BookingsPage() {
  const session = getSessionUser();
  if (!session) {
    redirect("/login?redirect=/bookings");
  }

  const bookings = await getStudentBookings(session.userId);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 space-y-8">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#E69A68]">
          Module 2 Reservations
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-[#263653] sm:text-3xl">
          My Study Space Bookings
        </h1>
        <p className="mt-1 text-xs text-[#777777]">
          Track upcoming desk and group-room bookings, cancel when plans change, and inspect historical study passes.
        </p>
      </div>

      <BookingHistory initialBookings={bookings} />
    </div>
  );
}
