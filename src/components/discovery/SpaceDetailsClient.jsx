"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";
import SeatGrid from "@/components/booking/SeatGrid";
import BookingForm from "@/components/booking/BookingForm";

export default function SpaceDetailsClient({ space, initialSeats = [], user }) {
  const [seats, setSeats] = useState(initialSeats);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [slotChecking, setSlotChecking] = useState(false);

  const isRoomBooking = space.studyType === "Group Study" || space.studyType === "Discussion Room";

  // When student changes date or time slot in BookingForm, update live seat availability
  const handleSlotChange = async (date, startTime, endTime) => {
    setSlotChecking(true);
    try {
      const res = await fetch(
        `/api/spaces/${space.id || space._id}/seats?date=${date}&startTime=${startTime}&endTime=${endTime}`
      );
      if (res.ok) {
        const data = await res.json();
        setSeats(data.seats || []);
        // Reset selected seat if no longer available in this slot
        const stillAvailable = data.seats.some(
          (s) => (s.id || s._id) === selectedSeatId && s.status === "Available"
        );
        if (!stillAvailable) {
          setSelectedSeatId(null);
        }
      }
    } catch (err) {
      console.error("Slot check error:", err);
    } finally {
      setSlotChecking(false);
    }
  };

  const percentAvailable =
    space.totalSeats > 0 ? Math.round((space.availableSeats / space.totalSeats) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#777777]">
        <Link href="/" className="hover:text-[#263653] transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/spaces" className="hover:text-[#263653] transition">
          Explore Spaces
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#263653] truncate">{space.name}</span>
      </nav>

      {/* Hero Overview Card */}
      <section className="relative overflow-hidden rounded-3xl border border-[#263653]/10 bg-white p-6 sm:p-10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#DCE5DC] px-3.5 py-1 text-xs font-bold text-[#263653]">
              {space.studyType}
            </span>
            <StatusBadge status={space.availability} />
          </div>

          <Link
            href="/spaces"
            className="text-xs font-bold text-[#263653] hover:text-[#E69A68] transition"
          >
            ← Back to all spaces
          </Link>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#263653] sm:text-4xl">
          {space.name}
        </h1>

        <p className="mt-3 max-w-3xl text-sm text-[#777777] leading-relaxed">
          {space.description}
        </p>

        {/* Location & Details Badges */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#F5F2EA] p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Campus Building
            </span>
            <div className="mt-1 text-base font-bold text-[#263653]">
              {space.buildingName || space.building}
            </div>
          </div>

          <div className="rounded-2xl bg-[#F5F2EA] p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Floor / Room Number
            </span>
            <div className="mt-1 text-base font-bold text-[#263653]">{space.floor}</div>
          </div>

          <div className="rounded-2xl bg-[#F5F2EA] p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
              Designated Zone / Wing
            </span>
            <div className="mt-1 text-base font-bold text-[#263653]">
              {space.zone || space.location}
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Details & Right Reservation Form */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left column: Capacity, Visual Seats, Facilities, Rules */}
        <div className="space-y-8 lg:col-span-7">
          {/* Capacity Progress Card */}
          <section className="rounded-2xl border border-[#263653]/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#263653]">Desk Capacity & Current Load</h2>
              <span className="text-xs font-bold text-[#263653]">
                {space.availableSeats} of {space.totalSeats} seats open
              </span>
            </div>

            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  percentAvailable > 30 ? "bg-emerald-600" : "bg-amber-500"
                }`}
                style={{ width: `${percentAvailable}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-[#777777]">
              Live calculation verified against valid active reservations and seat records.
            </p>
          </section>

          {/* Visual Seat Arrangement */}
          {!isRoomBooking ? (
            <section>
              <SeatGrid
                seats={seats}
                selectedSeatId={selectedSeatId}
                onSelectSeat={(seatId) => setSelectedSeatId(seatId)}
                disabled={slotChecking}
              />
            </section>
          ) : (
            <section className="rounded-2xl border border-[#263653]/10 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#263653]">Collaborative Room Setup</h3>
              <p className="mt-1 text-xs text-[#777777]">
                This room is booked as an entire unit. Capacity accommodates up to{" "}
                <strong>{space.totalSeats} students</strong>. Individual seat selection is not
                required.
              </p>
              <div className="mt-4 rounded-xl bg-[#F5F2EA] p-4 text-xs text-[#263238] flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <div>
                  <span className="font-bold text-[#263653]">Full Room Reservation Mode</span>
                  <p className="text-[#777777]">
                    Only one group can reserve this room per time window to avoid cross-project noise.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Facilities */}
          <section className="rounded-2xl border border-[#263653]/10 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#263653]">Included Facilities & Equipment</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {space.facilities &&
                space.facilities.map((fac) => (
                  <div
                    key={fac}
                    className="flex items-center gap-2 rounded-xl bg-[#F5F2EA] p-3 text-xs font-semibold text-[#263238]"
                  >
                    <span className="text-emerald-700">✓</span>
                    <span>{fac}</span>
                  </div>
                ))}
            </div>
          </section>

          {/* Usage Rules */}
          <section className="rounded-2xl border border-[#263653]/10 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#263653]">Facility Usage Rules</h2>
            <div className="mt-4 space-y-2">
              {space.usageRules &&
                space.usageRules.map((rule, idx) => (
                  <div
                    key={rule}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white p-3 text-xs text-[#263238]"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#DCE5DC] text-[10px] font-bold text-[#263653]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </div>
                ))}
            </div>
          </section>
        </div>

        {/* Right column: Interactive Booking Form */}
        <div className="lg:col-span-5">
          <div className="sticky top-20">
            <BookingForm
              space={space}
              selectedSeatId={selectedSeatId}
              user={user}
              onSlotChange={handleSlotChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
