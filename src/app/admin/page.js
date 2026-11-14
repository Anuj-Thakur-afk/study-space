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
    .limit(6)
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

  const occupancyRate =
    stats.totalSeats > 0
      ? Math.round(((stats.bookedSeats + stats.occupiedSeats) / stats.totalSeats) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#BDBDBD] pb-6">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
            Campus Management
          </span>
          <h1 className="mt-1 text-4xl font-black uppercase tracking-tight text-[#171717] sm:text-5xl leading-none">
            Admin Overview
          </h1>
          <p className="mt-2 text-xs text-[#777777]">
            Real-time seat inventory, physical occupancy, and booking flow across campus.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/spaces/add"
            className="border border-[#F15A24] bg-[#F15A24] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#171717] hover:border-[#171717] transition"
          >
            + Add Space
          </Link>
          <Link
            href="/admin/occupancy"
            className="border border-[#171717] bg-[#171717] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#F15A24] hover:border-[#F15A24] transition"
          >
            Check Occupancy
          </Link>
        </div>
      </div>

      {/* Occupancy Indicator Banner */}
      <div className="border border-[#BDBDBD] bg-white p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#777777]">
              Current Occupancy
            </span>
            <div className="text-2xl font-black text-[#171717]">{occupancyRate}% Occupied</div>
          </div>
          <div className="text-xs text-[#777777]">
            <span className="font-bold text-[#171717]">{stats.bookedSeats + stats.occupiedSeats}</span> of{" "}
            <span className="font-bold text-[#171717]">{stats.totalSeats}</span> seats in use
          </div>
        </div>
        <div className="h-2 w-full bg-[#F4F3ED] border border-[#BDBDBD]">
          <div
            className={`h-full transition-all duration-300 ${
              occupancyRate > 75 ? "bg-[#C43C32]" : occupancyRate > 40 ? "bg-[#F15A24]" : "bg-[#477A55]"
            }`}
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <AdminStats stats={stats} />

      {/* Recent Bookings Table */}
      <div className="border border-[#BDBDBD] bg-white">
        <div className="flex items-center justify-between border-b border-[#BDBDBD] bg-[#F4F3ED] px-6 py-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#171717]">
              Recent Bookings
            </h3>
            <p className="text-[10px] text-[#777777] uppercase tracking-wider mt-0.5">
              Latest bookings recorded across campus
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold uppercase tracking-wider text-[#777777] hover:text-[#F15A24] transition"
          >
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#BDBDBD] bg-white text-[#777777] font-bold uppercase tracking-wider text-[9px]">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-4 py-3">Facility</th>
                <th className="px-4 py-3">Seat / Unit</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BDBDBD] text-[#171717]">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#F4F3ED] transition">
                  <td className="px-5 py-3.5">
                    <span className="font-bold">{b.userId?.name || "Student"}</span>
                    <span className="block text-[10px] text-[#777777]">{b.userId?.email}</span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold">{b.studySpaceId?.name}</td>
                  <td className="px-4 py-3.5 font-bold">
                    {b.seatId?.seatNumber || "Full Room"}
                  </td>
                  <td className="px-4 py-3.5 text-[#777777]">
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
