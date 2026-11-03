import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import User from "@/models/User";
import BookingCard from "@/components/student/BookingCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Dashboard | StudySpace",
  description: "Manage upcoming study space reservations and view academic study activity.",
};

async function getStudentDashboardData(userId) {
  await connectDB();
  const todayStr = new Date().toISOString().split("T")[0];

  const bookings = await Booking.find({ userId })
    .populate("studySpaceId", "name buildingName floor zone studyType")
    .populate("seatId", "seatNumber features")
    .sort({ bookingDate: -1, startTime: -1 })
    .lean();

  const formatted = bookings.map((b) => ({
    ...b,
    id: b._id.toString(),
    _id: b._id.toString(),
  }));

  const activeBookings = formatted.filter(
    (b) => (b.status === "Confirmed" || b.status === "Occupied") && b.bookingDate >= todayStr
  );

  const completedBookings = formatted.filter((b) => b.status === "Completed");

  return {
    allBookings: formatted,
    activeBookings,
    completedCount: completedBookings.length,
    nextBooking: activeBookings[0] || null,
  };
}

export default async function StudentDashboardPage() {
  const session = getSessionUser();
  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  // If administrator logs in and lands on dashboard, redirect to admin
  if (session.role === "ADMIN") {
    redirect("/admin");
  }

  const { activeBookings, completedCount, nextBooking } = await getStudentDashboardData(
    session.userId
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 space-y-8">
      {/* Student Welcome Banner */}
      <section className="rounded-3xl border border-[#263653]/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#DCE5DC] px-3 py-1 text-xs font-bold text-[#263653]">
              🎓 Student Workspace Portal
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#263653] sm:text-3xl">
              Welcome back, {session.name}!
            </h1>
            <p className="mt-1 text-xs text-[#777777]">
              Ready for your next study block? Reserve carrels, collaboration rooms, and track attendance.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/spaces"
              className="rounded-full bg-[#263653] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#E69A68] transition"
            >
              + Book a Space
            </Link>
            <Link
              href="/bookings"
              className="rounded-full border border-slate-200 bg-[#F5F2EA] px-4 py-2.5 text-xs font-bold text-[#263238] hover:border-[#263653] transition"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Active Reservations
          </span>
          <div className="mt-2 text-3xl font-extrabold text-[#263653]">
            {activeBookings.length}
          </div>
          <p className="mt-1 text-xs text-[#777777]">Confirmed and ready for check-in</p>
        </div>

        <div className="rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Completed Study Blocks
          </span>
          <div className="mt-2 text-3xl font-extrabold text-[#263653]">
            {completedCount}
          </div>
          <p className="mt-1 text-xs text-[#777777]">Recorded campus attendance</p>
        </div>

        <div className="rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Focus Hours Logged
          </span>
          <div className="mt-2 text-3xl font-extrabold text-[#E69A68]">
            {(completedCount * 2) + (activeBookings.length * 2)} hrs
          </div>
          <p className="mt-1 text-xs text-[#777777]">Estimated academic focus time</p>
        </div>
      </section>

      {/* Next Upcoming Booking Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#263653]">Next Upcoming Reservation</h2>
          <Link
            href="/bookings"
            className="text-xs font-bold text-[#263653] hover:text-[#E69A68] transition"
          >
            View all bookings →
          </Link>
        </div>

        {nextBooking ? (
          <BookingCard booking={nextBooking} />
        ) : (
          <div className="rounded-2xl border border-dashed border-[#263653]/20 bg-white p-8 text-center shadow-sm">
            <span className="text-3xl">📖</span>
            <h3 className="mt-2 text-sm font-bold text-[#263653]">No upcoming study bookings</h3>
            <p className="mt-1 text-xs text-[#777777]">
              Reserve a seat in the Central Library or an Innovation Hub room before seats fill up.
            </p>
            <Link
              href="/spaces"
              className="mt-4 inline-block rounded-full bg-[#E69A68] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#D4834F] transition"
            >
              Discover Study Spaces Now
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
