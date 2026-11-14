"use client";

import { useState } from "react";
import StatusBadge from "@/components/common/StatusBadge";
import Modal from "@/components/common/Modal";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function BookingManagement({ initialBookings = [] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const filtered = bookings.filter((b) => {
    const q = search.trim().toLowerCase();
    const studentName = b.userId?.name?.toLowerCase() || "";
    const studentEmail = b.userId?.email?.toLowerCase() || "";
    const spaceName = b.studySpaceId?.name?.toLowerCase() || "";
    const seatNumber = b.seatId?.seatNumber?.toLowerCase() || "";

    const matchesSearch =
      !q ||
      studentName.includes(q) ||
      studentEmail.includes(q) ||
      spaceName.includes(q) ||
      seatNumber.includes(q) ||
      b.bookingDate.includes(q);

    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCancelConfirm = async () => {
    if (!cancellingBooking) return;
    setActionLoading(true);
    setActionError("");

    try {
      const res = await fetch(`/api/bookings/${cancellingBooking.id || cancellingBooking._id}`, {
        method: "PATCH",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel reservation");

      setBookings((prev) =>
        prev.map((b) =>
          (b.id || b._id) === (cancellingBooking.id || cancellingBooking._id)
            ? { ...b, status: "Cancelled" }
            : b
        )
      );

      setCancellingBooking(null);
    } catch (err) {
      setActionError(err.message || "Error cancelling reservation");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#BDBDBD] pb-6">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
            Bookings
          </span>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#171717] sm:text-4xl">
            Manage Bookings
          </h1>
          <p className="mt-1 text-xs text-[#777777]">
            View and search all campus bookings, manage cancellations, and track attendance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, email, space..."
            className="w-full sm:w-60 border border-[#BDBDBD] bg-white px-3 py-2 text-xs text-[#171717] outline-none focus:border-[#171717]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#BDBDBD] bg-white px-3 py-2 text-xs font-bold text-[#171717] outline-none focus:border-[#171717]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Occupied">Occupied</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#BDBDBD] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#BDBDBD] bg-[#F4F3ED] text-[#777777] font-bold uppercase tracking-wider text-[9px]">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-4 py-3.5">Space & Seat</th>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BDBDBD] text-[#171717]">
              {filtered.map((b) => (
                <tr key={b.id || b._id} className="hover:bg-[#F4F3ED] transition">
                  <td className="px-5 py-4">
                    <div className="font-bold">{b.userId?.name || "Student"}</div>
                    <div className="text-[10px] text-[#777777]">{b.userId?.email}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-semibold">{b.studySpaceId?.name || "Study Space"}</div>
                    <div className="text-[10px] text-[#777777]">
                      {b.seatId?.seatNumber ? `Seat: ${b.seatId.seatNumber}` : "Entire Room Reserved"}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold">{b.bookingDate}</div>
                    <div className="text-[10px] text-[#777777]">{b.startTime} – {b.endTime}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-mono text-[10px] font-bold uppercase">{b.bookingType}</span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    {b.status !== "Cancelled" && b.status !== "Completed" && (
                      <button
                        onClick={() => setCancellingBooking(b)}
                        className="border border-[#C43C32] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#C43C32] hover:bg-[#C43C32] hover:text-white transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={!!cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        title="Cancel Booking"
      >
        <div>
          <p className="text-xs text-[#777777] leading-relaxed">
            Cancel reservation for student <strong className="text-[#171717]">{cancellingBooking?.userId?.name}</strong> at{" "}
            <strong className="text-[#171717]">{cancellingBooking?.studySpaceId?.name}</strong>?
          </p>
          {actionError && <p className="mt-2 text-xs text-[#C43C32] font-semibold">{actionError}</p>}
          <div className="mt-6 flex justify-end gap-2.5">
            <button
              onClick={() => setCancellingBooking(null)}
              className="border border-[#BDBDBD] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#171717]"
            >
              Keep
            </button>
            <button
              onClick={handleCancelConfirm}
              disabled={actionLoading}
              className="border border-[#C43C32] bg-[#C43C32] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black hover:border-black transition"
            >
              {actionLoading ? <LoadingSpinner size="sm" text="" /> : "Confirm Cancel"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
