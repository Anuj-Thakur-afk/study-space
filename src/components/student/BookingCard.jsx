"use client";

import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";

export default function BookingCard({ booking, onCancel }) {
  const isUpcoming = booking.status === "Confirmed" || booking.status === "Occupied";
  const space = booking.studySpaceId || {};
  const seat = booking.seatId;

  return (
    <div className="border border-[#BDBDBD] bg-white p-5 transition duration-150 hover:border-[#171717]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#BDBDBD] pb-4">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#F15A24]">
            {booking.bookingType === "ROOM" ? "Group Room" : "Individual Seat"}
          </span>
          <h3 className="mt-1 text-base font-black tracking-tight text-[#171717]">{space.name || "Study Space"}</h3>
          <p className="mt-0.5 text-xs text-[#777777]">
            {space.buildingName} · {space.floor} · {space.zone}
          </p>
        </div>
        <StatusBadge status={booking.status} size="sm" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border border-[#BDBDBD] bg-[#F4F3ED] p-3 text-xs sm:grid-cols-4">
        <div>
          <span className="block text-[9px] font-bold uppercase tracking-wider text-[#777777]">Date</span>
          <span className="font-bold text-[#171717]">{booking.bookingDate}</span>
        </div>
        <div>
          <span className="block text-[9px] font-bold uppercase tracking-wider text-[#777777]">Time</span>
          <span className="font-bold text-[#171717]">
            {booking.startTime} – {booking.endTime}
          </span>
        </div>
        <div>
          <span className="block text-[9px] font-bold uppercase tracking-wider text-[#777777]">Seat</span>
          <span className="font-bold text-[#171717]">
            {booking.bookingType === "ROOM" ? "Entire Room" : seat?.seatNumber || "Assigned Seat"}
          </span>
        </div>
        <div>
          <span className="block text-[9px] font-bold uppercase tracking-wider text-[#777777]">Purpose</span>
          <span className="font-semibold text-[#171717] truncate block">
            {booking.purpose || "Study session"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link
          href={`/bookings/${booking.id || booking._id}`}
          className="border border-[#171717] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#171717] hover:bg-[#171717] hover:text-white transition"
        >
          View Digital Pass 🎫
        </Link>

        {isUpcoming && onCancel && (
          <button
            onClick={() => onCancel(booking)}
            className="border border-[#C43C32] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#C43C32] hover:bg-[#C43C32] hover:text-white transition"
          >
            Cancel Booking ✕
          </button>
        )}
      </div>
    </div>
  );
}
