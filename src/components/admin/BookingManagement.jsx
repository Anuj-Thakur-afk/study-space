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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#263653]">Campus Bookings Management</h2>
          <p className="text-xs text-[#777777]">
            Monitor student reservations, search by attendee, and manage room allocations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, email, space..."
            className="w-full sm:w-60 rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2 text-xs font-bold text-[#263653] outline-none focus:border-[#263653]"
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
      <div className="overflow-hidden rounded-2xl border border-[#263653]/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-[#F5F2EA] text-[#263653] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-4 py-3.5">Space & Seat</th>
                <th className="px-4 py-3.5">Date & Window</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#263238]">
              {filtered.map((b) => (
                <tr key={b.id || b._id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-[#263653]">{b.userId?.name || "Student"}</div>
                    <div className="text-[11px] text-[#777777]">{b.userId?.email}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-semibold">{b.studySpaceId?.name || "Study Space"}</div>
                    <div className="text-[11px] text-[#777777]">
                      {b.seatId?.seatNumber ? `Seat: ${b.seatId.seatNumber}` : "Entire Room Reserved"}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-[#263653]">{b.bookingDate}</div>
                    <div className="text-[11px] text-[#777777]">{b.startTime} – {b.endTime}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-[#263653]">{b.bookingType}</span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    {b.status !== "Cancelled" && b.status !== "Completed" && (
                      <button
                        onClick={() => setCancellingBooking(b)}
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
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
        title="Admin Booking Cancellation"
      >
        <div>
          <p className="text-xs text-[#777777] leading-relaxed">
            Cancel reservation for student <strong className="text-[#263653]">{cancellingBooking?.userId?.name}</strong> at{" "}
            <strong className="text-[#263653]">{cancellingBooking?.studySpaceId?.name}</strong>?
          </p>
          {actionError && <p className="mt-2 text-xs text-rose-700">{actionError}</p>}
          <div className="mt-6 flex justify-end gap-2.5">
            <button
              onClick={() => setCancellingBooking(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#263238]"
            >
              Keep
            </button>
            <button
              onClick={handleCancelConfirm}
              disabled={actionLoading}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
            >
              {actionLoading ? <LoadingSpinner size="sm" text="" /> : "Confirm Admin Cancel"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
