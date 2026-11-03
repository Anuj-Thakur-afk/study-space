import Link from "next/link";
import connectDB from "@/lib/db";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import Booking from "@/models/Booking";
import User from "@/models/User";
import AdminStats from "@/components/admin/AdminStats";
import StatusBadge from "@/components/common/StatusBadge";

export const dynamic = "force-dynamic";

async function getAdminOverviewData() {
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
    .limit(5)
    .lean();

  return {
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
  };
}

export default async function AdminDashboardPage() {
  const { stats, recentBookings } = await getAdminOverviewData();

  return (
    <div className="space-y-8">
      {/* Overview Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E69A68]">
            Module 3 Administration
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-[#263653] sm:text-3xl">
            Campus Workspace Administration
          </h1>
          <p className="mt-1 text-xs text-[#777777]">
            Overview of real-time seat inventory, student booking traffic, and physical occupancy.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/spaces/add"
            className="rounded-xl bg-[#263653] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#E69A68] transition"
          >
            + Add Space
          </Link>
          <Link
            href="/admin/occupancy"
            className="rounded-xl bg-[#E69A68] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#D4834F] transition"
          >
            Verify Occupancy
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <AdminStats stats={stats} />

      {/* Recent Bookings Table */}
      <div className="overflow-hidden rounded-2xl border border-[#263653]/10 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#F5F2EA] px-6 py-4">
          <div>
            <h3 className="text-sm font-bold text-[#263653]">Recent Reservation Requests</h3>
            <p className="text-xs text-[#777777]">Latest student bookings submitted to MongoDB</p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-[#263653] hover:text-[#E69A68] transition"
          >
            View all bookings →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[#263653] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-4 py-3">Facility</th>
                <th className="px-4 py-3">Seat / Unit</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#263238]">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-[#263653]">{b.userId?.name || "Student"}</span>
                    <span className="block text-[11px] text-[#777777]">{b.userId?.email}</span>
                  </td>
                  <td className="px-4 py-3.5 font-medium">{b.studySpaceId?.name}</td>
                  <td className="px-4 py-3.5 font-bold text-[#263653]">
                    {b.seatId?.seatNumber || "Full Room"}
                  </td>
                  <td className="px-4 py-3.5">
                    {b.bookingDate} ({b.startTime} – {b.endTime})
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
