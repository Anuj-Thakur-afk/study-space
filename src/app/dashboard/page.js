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
  const cancelledBookings = formatted.filter((b) => b.status === "Cancelled");

  return {
    allBookings: formatted,
    activeBookings,
    completedCount: completedBookings.length,
    cancelledCount: cancelledBookings.length,
    nextBooking: activeBookings[0] || null,
  };
}

export default async function StudentDashboardPage() {
  const session = getSessionUser();
  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  if (session.role === "ADMIN") {
    redirect("/admin");
  }

  const { activeBookings, completedCount, cancelledCount, nextBooking, allBookings } =
    await getStudentDashboardData(session.userId);

  const totalHoursEstimated = (completedCount * 2) + (activeBookings.length * 2);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      {/* Page header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#BDBDBD] pb-8">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
            Student Portal
          </span>
          <h1 className="mt-1 text-5xl font-black uppercase tracking-tight text-[#171717] leading-none sm:text-6xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-[#777777]">
            Welcome back,{" "}
            <span className="font-bold text-[#171717]">{session.name}</span> —
            here's your study activity overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/spaces"
            className="border border-[#F15A24] bg-[#F15A24] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#171717] hover:border-[#171717] transition"
          >
            + Book a Space
          </Link>
          <Link
            href="/bookings"
            className="border border-[#BDBDBD] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#777777] hover:border-[#171717] hover:text-[#171717] transition"
          >
            All Bookings
          </Link>
        </div>
      </div>

      {/* Stats grid — 4 cards */}
      <div className="grid gap-px border border-[#BDBDBD] bg-[#BDBDBD] grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          {
            label: "Active Reservations",
            value: activeBookings.length,
            sub: "Confirmed & ready",
            accent: false,
          },
          {
            label: "Completed Sessions",
            value: completedCount,
            sub: "Recorded attendance",
            accent: false,
          },
          {
            label: "Focus Hours",
            value: `${totalHoursEstimated}h`,
            sub: "Estimated study time",
            accent: true,
          },
          {
            label: "Cancelled",
            value: cancelledCount,
            sub: "No-shows or cancelled",
            accent: false,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6"
          >
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#777777]">
              {stat.label}
            </span>
            <div
              className={`mt-2 text-4xl font-black leading-none ${
                stat.accent ? "text-[#F15A24]" : "text-[#171717]"
              }`}
            >
              {stat.value}
            </div>
            <p className="mt-1 text-[10px] text-[#777777]">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Next booking spotlight */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#171717]">
                Next Upcoming Reservation
              </h2>
              <Link
                href="/bookings"
                className="text-xs font-bold uppercase tracking-wider text-[#777777] hover:text-[#F15A24] transition"
              >
                View all →
              </Link>
            </div>

            {nextBooking ? (
              <BookingCard booking={nextBooking} />
            ) : (
              <div className="border border-dashed border-[#BDBDBD] p-10 text-center bg-white">
                <div className="text-5xl font-black text-[#BDBDBD] leading-none mb-3">?</div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[#171717]">
                  No Upcoming Bookings
                </h3>
                <p className="mt-2 text-xs text-[#777777] max-w-xs mx-auto">
                  Reserve a seat in the Central Library or an Innovation Hub room before they fill up.
                </p>
                <Link
                  href="/spaces"
                  className="mt-5 inline-block border border-[#F15A24] bg-[#F15A24] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-transparent hover:text-[#F15A24] transition"
                >
                  Discover Spaces
                </Link>
              </div>
            )}
          </div>

          {/* Recent bookings list */}
          {allBookings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#171717]">
                  Recent Booking Activity
                </h2>
              </div>
              <div className="border border-[#BDBDBD] bg-white overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#BDBDBD] bg-[#F4F3ED]">
                    <tr>
                      <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-[#777777]">Space</th>
                      <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-[#777777]">Date</th>
                      <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-[#777777]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#BDBDBD]">
                    {allBookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-[#F4F3ED] transition">
                        <td className="px-4 py-3">
                          <div className="font-bold text-[#171717]">
                            {b.studySpaceId?.name || "Space"}
                          </div>
                          <div className="text-[10px] text-[#777777]">
                            {b.seatId?.seatNumber ? `Seat ${b.seatId.seatNumber}` : "Full Room"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#777777]">
                          {b.bookingDate}
                          <span className="block text-[10px]">
                            {b.startTime} – {b.endTime}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              b.status === "Confirmed"
                                ? "border-[#477A55]/30 bg-[#E8F2EC] text-[#477A55]"
                                : b.status === "Cancelled"
                                ? "border-[#C43C32]/30 bg-[#FAEAE9] text-[#C43C32]"
                                : b.status === "Completed"
                                ? "border-[#BDBDBD] bg-[#F4F3ED] text-[#777777]"
                                : "border-[#F15A24]/30 bg-[#FFE1D5] text-[#F15A24]"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar panel */}
        <div className="lg:col-span-5 space-y-5">
          {/* Account info */}
          <div className="border border-[#BDBDBD] bg-[#171717] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center bg-[#F15A24] text-white font-black text-sm">
                {session.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-black text-white">{session.name}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">{session.email}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#2a2a2a]">
              <div className="bg-[#1e1e1e] p-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block">
                  Role
                </span>
                <span className="text-xs font-black text-white">{session.role}</span>
              </div>
              <div className="bg-[#1e1e1e] p-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block">
                  Total Bookings
                </span>
                <span className="text-xs font-black text-[#F15A24]">{allBookings.length}</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="border border-[#BDBDBD] bg-white p-5">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-[#777777] mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { href: "/spaces", label: "Find a Study Space", primary: true },
                { href: "/bookings", label: "View All My Bookings", primary: false },
                { href: "/spaces?type=Silent+Study", label: "Silent Study Zones", primary: false },
                { href: "/spaces?type=Group+Study", label: "Group Study Rooms", primary: false },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`block px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    action.primary
                      ? "border border-[#F15A24] bg-[#F15A24] text-white hover:bg-[#171717] hover:border-[#171717]"
                      : "border border-[#BDBDBD] text-[#777777] hover:border-[#171717] hover:text-[#171717]" 
                  }`}
                >
                  {action.primary ? "→ " : ""}{action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
