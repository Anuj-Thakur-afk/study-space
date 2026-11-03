"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const TIME_SLOTS = [
  { label: "08:00 AM – 10:00 AM", start: "08:00", end: "10:00" },
  { label: "10:00 AM – 12:00 PM", start: "10:00", end: "12:00" },
  { label: "12:00 PM – 02:00 PM", start: "12:00", end: "14:00" },
  { label: "02:00 PM – 04:00 PM", start: "14:00", end: "16:00" },
  { label: "04:00 PM – 06:00 PM", start: "16:00", end: "18:00" },
  { label: "06:00 PM – 08:00 PM", start: "18:00", end: "20:00" },
];

export default function BookingForm({
  space,
  selectedSeatId,
  user,
  onSlotChange,
}) {
  const router = useRouter();
  const isRoomBooking = space.studyType === "Group Study" || space.studyType === "Discussion Room";

  // Default to today
  const todayStr = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayStr);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(1); // 10:00 - 12:00
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [purpose, setPurpose] = useState("Academic course revision");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successBooking, setSuccessBooking] = useState(null);

  const handleSlotSelect = (index) => {
    setSelectedSlotIndex(index);
    const slot = TIME_SLOTS[index];
    setStartTime(slot.start);
    setEndTime(slot.end);
    if (onSlotChange) {
      onSlotChange(date, slot.start, slot.end);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    if (onSlotChange) {
      onSlotChange(newDate, startTime, endTime);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      router.push(`/login?redirect=/spaces/${space.id || space._id}`);
      return;
    }

    if (!isRoomBooking && !selectedSeatId) {
      setError("Please select an available seat from the visual arrangement above.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        studySpaceId: space.id || space._id,
        seatId: isRoomBooking ? null : selectedSeatId,
        bookingDate: date,
        startTime,
        endTime,
        bookingType: isRoomBooking ? "ROOM" : "SEAT",
        purpose,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete reservation");
      }

      setSuccessBooking(data.booking);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (successBooking) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl">
          ✓
        </div>
        <h3 className="mt-3 text-lg font-bold text-emerald-900">Reservation Confirmed!</h3>
        <p className="mt-1 text-xs text-emerald-700">
          Your study reservation has been recorded in the campus occupancy database.
        </p>

        <div className="mt-5 rounded-xl bg-white p-4 text-left text-xs space-y-2 border border-emerald-100">
          <div className="flex justify-between">
            <span className="text-[#777777]">Reservation ID:</span>
            <span className="font-mono font-bold text-[#263653]">{successBooking.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#777777]">Space:</span>
            <span className="font-semibold text-[#263653]">{space.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#777777]">Booking Type:</span>
            <span className="font-semibold text-[#263653]">{successBooking.bookingType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#777777]">Date & Time:</span>
            <span className="font-semibold text-[#263653]">
              {successBooking.bookingDate} ({successBooking.startTime} – {successBooking.endTime})
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => router.push(`/bookings/${successBooking.id}`)}
            className="rounded-full bg-[#263653] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#E69A68]"
          >
            View Digital Pass
          </button>
          <button
            onClick={() => router.push("/bookings")}
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-[#263238] transition hover:bg-slate-50"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#263653]/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-[#263653]">
            {isRoomBooking ? "Reserve Group Room" : "Reserve Individual Seat"}
          </h3>
          <p className="text-xs text-[#777777]">
            {isRoomBooking
              ? "Reserve this entire collaborative space for your group session."
              : "Confirm selected date, time slot, and study purpose."}
          </p>
        </div>
        <span className="rounded-lg bg-[#DCE5DC] px-2.5 py-1 text-[11px] font-bold text-[#263653]">
          {isRoomBooking ? "Room Level" : "Desk Level"}
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          ⚠️ {error}
        </div>
      )}

      {/* Date Selection */}
      <div className="mt-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1.5">
          1. Select Reservation Date
        </label>
        <input
          type="date"
          min={todayStr}
          value={date}
          onChange={handleDateChange}
          className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2.5 text-xs font-medium text-[#263238] outline-none focus:border-[#263653]"
          required
        />
      </div>

      {/* Time Slot Selector */}
      <div className="mt-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-2">
          2. Choose Time Slot
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TIME_SLOTS.map((slot, idx) => (
            <button
              key={slot.label}
              type="button"
              onClick={() => handleSlotSelect(idx)}
              className={`rounded-xl border py-2 px-2.5 text-left text-xs transition ${
                selectedSlotIndex === idx
                  ? "border-[#263653] bg-[#263653] text-white font-bold shadow-sm"
                  : "border-slate-200 bg-[#F5F2EA]/40 text-[#263238] hover:border-[#263653]/40"
              }`}
            >
              <div className="text-[10px] opacity-80">Slot {idx + 1}</div>
              <div className="truncate">{slot.start} – {slot.end}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div className="mt-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1.5">
          3. Study Objective / Subject
        </label>
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g. Operating Systems final revision, Capstone peer review..."
          className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2.5 text-xs text-[#263238] outline-none focus:border-[#263653]"
        />
      </div>

      {/* Summary preview */}
      <div className="mt-6 rounded-xl bg-[#F5F2EA] p-4 text-xs text-[#263238] space-y-1.5">
        <div className="flex justify-between">
          <span className="text-[#777777]">Target Facility:</span>
          <span className="font-semibold text-[#263653]">{space.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#777777]">Allocation Type:</span>
          <span className="font-semibold text-[#263653]">
            {isRoomBooking ? "Full Collaborative Room" : selectedSeatId ? "Specific Seat Selected" : "Seat selection pending"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#777777]">Selected Window:</span>
          <span className="font-semibold text-[#263653]">
            {date} ({startTime} – {endTime})
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E69A68] py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#D4834F] disabled:opacity-60"
        >
          {loading ? (
            <LoadingSpinner size="sm" text="" />
          ) : !user ? (
            "Sign In to Confirm Reservation"
          ) : (
            `Confirm ${isRoomBooking ? "Room" : "Seat"} Booking`
          )}
        </button>
      </div>
    </form>
  );
}
