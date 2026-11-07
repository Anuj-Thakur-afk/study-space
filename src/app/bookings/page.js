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
  title: "My Bookings | StudySpace",
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
      <div className="border-b border-[#BDBDBD] pb-6">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
          Reservations
        </span>
        <h1 className="mt-1 text-4xl font-black uppercase tracking-tight text-[#171717] sm:text-5xl">
          My Bookings
        </h1>
        <p className="mt-2 text-xs text-[#777777]">
          Track upcoming desk and group-room bookings, cancel when plans change, and inspect historical study passes.
        </p>
      </div>

      <BookingHistory initialBookings={bookings} />
    </div>
  );
}
