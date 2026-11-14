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

  const todayStr = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayStr);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(1);
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
      setError("Please select an available seat from the layout above.");
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
      <div className="border border-[#477A55] bg-[#E8F2EC] p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center border border-[#477A55] bg-white text-xl font-black text-[#477A55] mb-4">
          ✓
        </div>
        <h3 className="text-base font-black uppercase tracking-tight text-[#171717]">
          Booking Confirmed
        </h3>
        <p className="mt-1 text-xs text-[#777777]">
          Your space has been booked. Show your digital pass on arrival.
        </p>

        <div className="mt-5 border border-[#BDBDBD] bg-white p-4 text-left text-xs space-y-2">
          {[
            { label: "Booking ID", value: successBooking.id, mono: true },
            { label: "Space", value: space.name },
            { label: "Type", value: successBooking.bookingType },
            { label: "Date & Time", value: `${successBooking.bookingDate} (${successBooking.startTime} – ${successBooking.endTime})` },
          ].map((row) => (
            <div key={row.label} className="flex justify-between gap-2">
              <span className="text-[#777777]">{row.label}:</span>
              <span className={`font-bold text-[#171717] ${row.mono ? "font-mono text-[10px]" : ""}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => router.push(`/bookings/${successBooking.id}`)}
            className="border border-[#171717] bg-[#171717] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#F15A24] hover:border-[#F15A24] transition"
          >
            View Digital Pass
          </button>
          <button
            onClick={() => router.push("/bookings")}
            className="border border-[#BDBDBD] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#777777] hover:border-[#171717] hover:text-[#171717] transition"
          >
            My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#BDBDBD] bg-white">
      {/* Form header */}
      <div className="flex items-center justify-between border-b border-[#BDBDBD] px-5 py-4 bg-[#171717]">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-white">
            {isRoomBooking ? "Reserve Group Room" : "Reserve Individual Seat"}
          </h3>
          <p className="text-[10px] text-white/50 mt-0.5">
            {isRoomBooking
              ? "Reserve the entire space for your group."
              : "Confirm date, time, and study purpose."}
          </p>
        </div>
        <span className="border border-[#333] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-[#777777]">
          {isRoomBooking ? "Room" : "Desk"}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {error && (
          <div className="border border-[#C43C32] bg-[#FAEAE9] p-3 text-xs text-[#C43C32]">
            {error}
          </div>
        )}

        {/* Stage 1: Date */}
        <div>
          <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1.5">
            1 — Select Date
          </label>
          <input
            type="date"
            min={todayStr}
            value={date}
            onChange={handleDateChange}
            className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3.5 py-2.5 text-xs font-medium text-[#171717] outline-none focus:border-[#171717] transition"
            required
          />
        </div>

        {/* Stage 2: Time slots */}
        <div>
          <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-2">
            2 — Choose Time
          </label>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {TIME_SLOTS.map((slot, idx) => (
              <button
                key={slot.label}
                type="button"
                onClick={() => handleSlotSelect(idx)}
                className={`border py-2 px-2.5 text-left text-xs font-semibold transition ${
                  selectedSlotIndex === idx
                    ? "border-[#F15A24] bg-[#F15A24] text-white"
                    : "border-[#BDBDBD] bg-white text-[#777777] hover:border-[#171717] hover:text-[#171717]"
                }`}
              >
                <div className="text-[9px] opacity-70 uppercase tracking-wider">
                  Slot {idx + 1}
                </div>
                <div className="truncate font-bold">{slot.start} – {slot.end}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stage 3: Review and Confirm */}
        <div>
          <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-2">
            3 — Review & Confirm
          </label>

          <div className="space-y-3">
            <div>
              <span className="block text-[9px] font-bold uppercase tracking-wider text-[#777777] mb-1">
                Purpose of Visit
              </span>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Course revision, exam prep, project work..."
                className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3.5 py-2 text-xs text-[#171717] outline-none focus:border-[#171717] transition placeholder:text-[#BDBDBD]"
              />
            </div>

            {/* Summary */}
            <div className="border border-[#BDBDBD] bg-[#F4F3ED] p-4 text-xs space-y-1.5">
              {[
                { label: "Space", value: space.name },
                {
                  label: "Booked Space",
                  value: isRoomBooking
                    ? "Full Room"
                    : selectedSeatId
                    ? "Seat Selected"
                    : "⚠ No seat selected",
                },
                { label: "Date & Time", value: `${date} · ${startTime} – ${endTime}` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-2">
                  <span className="text-[#777777] uppercase tracking-wider text-[9px] font-bold">
                    {row.label}
                  </span>
                  <span className="font-bold text-[#171717] text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 border border-[#F15A24] bg-[#F15A24] py-3.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#171717] hover:border-[#171717] disabled:opacity-60"
        >
          {loading ? (
            <LoadingSpinner size="sm" text="" />
          ) : !user ? (
            "Sign In to Confirm Booking"
          ) : (
            `Confirm ${isRoomBooking ? "Room" : "Seat"} Booking`
          )}
        </button>
      </div>
    </form>
  );
}
