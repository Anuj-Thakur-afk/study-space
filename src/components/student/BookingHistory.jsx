"use client";

import { useState } from "react";
import BookingCard from "@/components/student/BookingCard";
import Modal from "@/components/common/Modal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Link from "next/link";

export default function BookingHistory({ initialBookings = [] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' | 'past'
  const [search, setSearch] = useState("");
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const handleCancelConfirm = async () => {
    if (!cancellingBooking) return;
    setActionLoading(true);
    setActionError("");

    try {
      const res = await fetch(`/api/bookings/${cancellingBooking.id || cancellingBooking._id}`, {
        method: "PATCH",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      // Update state in place
      setBookings((prev) =>
        prev.map((b) =>
          (b.id || b._id) === (cancellingBooking.id || cancellingBooking._id)
            ? { ...b, status: "Cancelled" }
            : b
        )
      );

      setCancellingBooking(null);
    } catch (err) {
      setActionError(err.message || "An error occurred while cancelling");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const isUpcoming =
      (b.status === "Confirmed" || b.status === "Occupied") && b.bookingDate >= todayStr;

    const matchesTab = activeTab === "upcoming" ? isUpcoming : !isUpcoming;

    const q = search.trim().toLowerCase();
    const spaceName = b.studySpaceId?.name?.toLowerCase() || "";
    const seatNum = b.seatId?.seatNumber?.toLowerCase() || "";
    const matchesSearch = !q || spaceName.includes(q) || seatNum.includes(q) || b.bookingDate.includes(q);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#263653]/10 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "upcoming"
                ? "bg-[#263653] text-white shadow-sm"
                : "bg-[#F5F2EA] text-[#263238] hover:bg-[#DCE5DC]"
            }`}
          >
            Upcoming Reservations ({bookings.filter((b) => (b.status === "Confirmed" || b.status === "Occupied") && b.bookingDate >= todayStr).length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "past"
                ? "bg-[#263653] text-white shadow-sm"
                : "bg-[#F5F2EA] text-[#263238] hover:bg-[#DCE5DC]"
            }`}
          >
            Past & Cancelled
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by space, seat, date..."
            className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id || booking._id}
              booking={booking}
              onCancel={(b) => setCancellingBooking(b)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#263653]/20 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F5F2EA] text-2xl">
            📅
          </div>
          <h3 className="mt-3 text-base font-bold text-[#263653]">
            {activeTab === "upcoming"
              ? "No upcoming reservations scheduled"
              : "No past reservation records found"}
          </h3>
          <p className="mt-1 text-xs text-[#777777]">
            {activeTab === "upcoming"
              ? "Explore campus study spaces and reserve your seat or group room in advance."
              : "Your completed and cancelled study reservations will appear here."}
          </p>
          {activeTab === "upcoming" && (
            <Link
              href="/spaces"
              className="mt-4 inline-block rounded-full bg-[#E69A68] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#D4834F] transition"
            >
              Browse & Book Spaces
            </Link>
          )}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        title="Confirm Reservation Cancellation"
      >
        <div>
          <p className="text-xs text-[#777777] leading-relaxed">
            Are you sure you want to cancel your reservation for{" "}
            <strong className="text-[#263653]">
              {cancellingBooking?.studySpaceId?.name}
            </strong>{" "}
            on <strong className="text-[#263653]">{cancellingBooking?.bookingDate}</strong> (
            {cancellingBooking?.startTime} – {cancellingBooking?.endTime})?
          </p>
          <p className="mt-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
            Cancelling will release your reserved seat/room immediately back into campus availability.
          </p>

          {actionError && (
            <p className="mt-3 text-xs text-rose-700 font-semibold">{actionError}</p>
          )}

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              onClick={() => setCancellingBooking(null)}
              disabled={actionLoading}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#263238] hover:bg-slate-50 transition"
            >
              Keep Reservation
            </button>
            <button
              onClick={handleCancelConfirm}
              disabled={actionLoading}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
            >
              {actionLoading ? <LoadingSpinner size="sm" text="" /> : "Yes, Cancel Booking"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
