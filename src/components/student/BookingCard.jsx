"use client";

import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";

export default function BookingCard({ booking, onCancel }) {
  const isUpcoming = booking.status === "Confirmed" || booking.status === "Occupied";
  const space = booking.studySpaceId || {};
  const seat = booking.seatId;

  return (
    <div className="rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E69A68]">
            {booking.bookingType === "ROOM" ? "Group Room Reservation" : "Individual Seat Booking"}
          </span>
          <h3 className="text-base font-bold text-[#263653]">{space.name || "Study Space"}</h3>
          <p className="text-xs text-[#777777]">
            {space.buildingName} · {space.floor} · {space.zone}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#F5F2EA] p-3 text-xs sm:grid-cols-4">
        <div>
          <span className="block text-[#777777] text-[11px]">Date</span>
          <span className="font-bold text-[#263653]">{booking.bookingDate}</span>
        </div>
        <div>
          <span className="block text-[#777777] text-[11px]">Time Window</span>
          <span className="font-bold text-[#263653]">
            {booking.startTime} – {booking.endTime}
          </span>
        </div>
        <div>
          <span className="block text-[#777777] text-[11px]">Seat / Unit</span>
          <span className="font-bold text-[#263653]">
            {booking.bookingType === "ROOM" ? "Entire Room" : seat?.seatNumber || "Assigned Seat"}
          </span>
        </div>
        <div>
          <span className="block text-[#777777] text-[11px]">Purpose</span>
          <span className="font-medium text-[#263238] truncate block">
            {booking.purpose || "Study session"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link
          href={`/bookings/${booking.id || booking._id}`}
          className="rounded-lg border border-[#263653] bg-white px-3.5 py-1.5 text-xs font-bold text-[#263653] hover:bg-[#263653] hover:text-white transition"
        >
          View Digital Pass 🎫
        </Link>

        {isUpcoming && onCancel && (
          <button
            onClick={() => onCancel(booking)}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            Cancel Booking ✕
          </button>
        )}
      </div>
    </div>
  );
}
