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

  const upcomingCount = bookings.filter(
    (b) => (b.status === "Confirmed" || b.status === "Occupied") && b.bookingDate >= todayStr
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#BDBDBD] bg-white p-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "upcoming"
                ? "bg-[#171717] text-white"
                : "border border-[#BDBDBD] bg-[#F4F3ED] text-[#171717] hover:border-[#171717]"
            }`}
          >
            Upcoming Bookings ({upcomingCount})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "past"
                ? "bg-[#171717] text-white"
                : "border border-[#BDBDBD] bg-[#F4F3ED] text-[#171717] hover:border-[#171717]"
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
            className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3 py-2 text-xs text-[#171717] outline-none focus:border-[#171717] transition"
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
        <div className="border border-dashed border-[#BDBDBD] bg-white p-12 text-center">
          <div className="text-4xl font-black text-[#BDBDBD] mb-2">?</div>
          <h3 className="text-base font-black uppercase tracking-tight text-[#171717]">
            {activeTab === "upcoming"
              ? "No upcoming bookings"
              : "No past bookings found"}
          </h3>
          <p className="mt-1 text-xs text-[#777777] max-w-sm mx-auto">
            {activeTab === "upcoming"
              ? "Find an open space and book your seat — it only takes a minute."
              : "Your completed and cancelled bookings will appear here."}
          </p>
          {activeTab === "upcoming" && (
            <Link
              href="/spaces"
              className="mt-5 inline-block border border-[#F15A24] bg-[#F15A24] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#171717] hover:border-[#171717] transition"
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
        title="Confirm Cancellation"
      >
        <div>
          <p className="text-xs text-[#777777] leading-relaxed">
            Are you sure you want to cancel your reservation for{" "}
            <strong className="text-[#171717]">
              {cancellingBooking?.studySpaceId?.name}
            </strong>{" "}
            on <strong className="text-[#171717]">{cancellingBooking?.bookingDate}</strong> (
            {cancellingBooking?.startTime} – {cancellingBooking?.endTime})?
          </p>
          <p className="mt-3 text-xs text-[#C43C32] bg-[#FAEAE9] p-3 border border-[#C43C32]/30">
            Cancelling will release your reserved seat/room immediately back into campus availability.
          </p>

          {actionError && (
            <p className="mt-3 text-xs text-[#C43C32] font-semibold">{actionError}</p>
          )}

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              onClick={() => setCancellingBooking(null)}
              disabled={actionLoading}
              className="border border-[#BDBDBD] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#171717] hover:border-[#171717] transition"
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancelConfirm}
              disabled={actionLoading}
              className="border border-[#C43C32] bg-[#C43C32] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black hover:border-black transition"
            >
              {actionLoading ? <LoadingSpinner size="sm" text="" /> : "Cancel Booking"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
