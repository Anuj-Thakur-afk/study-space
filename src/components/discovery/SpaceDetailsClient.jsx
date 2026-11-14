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

  // Facility icons mapping
  const facilityIcons = {
    "Wi-Fi": "📶",
    "Power Socket": "⚡",
    "Whiteboard": "📋",
    "Monitor": "🖥",
    "Air Conditioning": "❄️",
    "Natural Light": "☀️",
    "Quiet Zone": "🔇",
    "Locker": "🔒",
    "Printer": "🖨",
    "Projector": "📽",
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#777777]">
        <Link href="/" className="hover:text-[#F15A24] transition uppercase tracking-wider font-semibold">
          Home
        </Link>
        <span className="text-[#BDBDBD]">/</span>
        <Link href="/spaces" className="hover:text-[#F15A24] transition uppercase tracking-wider font-semibold">
          Explore
        </Link>
        <span className="text-[#BDBDBD]">/</span>
        <span className="font-bold text-[#171717] uppercase tracking-wider truncate">{space.name}</span>
      </nav>

      {/* Space Hero Header */}
      <section className="border border-[#BDBDBD] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="border border-[#BDBDBD] px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#777777]">
              {space.studyType}
            </span>
            <StatusBadge status={space.availability} />
          </div>
          <Link
            href="/spaces"
            className="text-xs font-bold uppercase tracking-wider text-[#777777] hover:text-[#F15A24] transition"
          >
            ← Back to Spaces
          </Link>
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tight text-[#171717] sm:text-4xl leading-none">
          {space.name}
        </h1>

        <p className="mt-3 max-w-3xl text-sm text-[#777777] leading-relaxed">
          {space.description}
        </p>

        {/* Location strip */}
        <div className="mt-6 grid gap-0 border border-[#BDBDBD] sm:grid-cols-3">
          {[
            { label: "Building", value: space.buildingName || space.building },
            { label: "Floor", value: space.floor },
            { label: "Zone", value: space.zone || space.location },
          ].map((item, idx) => (
            <div
              key={item.label}
              className={`p-4 ${idx < 2 ? "border-b sm:border-b-0 sm:border-r border-[#BDBDBD]" : ""}`}
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#777777] block">
                {item.label}
              </span>
              <div className="mt-1 text-sm font-black text-[#171717]">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main 2-column grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Details */}
        <div className="space-y-6 lg:col-span-7">
          {/* Capacity bar */}
          <section className="border border-[#BDBDBD] bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#171717]">
                Available Seats
              </h2>
              <span className="text-xs font-black text-[#171717]">
                {space.availableSeats}
                <span className="font-normal text-[#777777]"> / {space.totalSeats} open</span>
              </span>
            </div>
            <div className="h-2 w-full bg-[#F4F3ED] border border-[#BDBDBD]">
              <div
                className={`h-full transition-all duration-300 ${
                  percentAvailable > 30 ? "bg-[#477A55]" : "bg-[#F15A24]"
                }`}
                style={{ width: `${percentAvailable}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-[#777777]">
              Updates when you change the date or time slot above.
            </p>
          </section>

          {/* Seat layout */}
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
            <section className="border border-[#BDBDBD] bg-white p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#171717] mb-3">
                Collaborative Room Setup
              </h3>
              <p className="text-xs text-[#777777] leading-relaxed">
                This room is booked as an entire unit. Capacity accommodates up to{" "}
                <strong className="text-[#171717]">{space.totalSeats} students</strong>.
                Individual seat selection is not required.
              </p>
              <div className="mt-4 border border-[#FFE1D5] bg-[#FFE1D5] p-4 flex items-start gap-3">
                <div className="text-[#F15A24] font-black text-lg leading-none">≡</div>
                <div>
                  <span className="block text-xs font-black uppercase tracking-wider text-[#171717]">
                    Full Room Reservation Mode
                  </span>
                  <p className="text-[10px] text-[#777777] mt-0.5">
                    Only one group can reserve this room per time window.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Facilities */}
          {space.facilities && space.facilities.length > 0 && (
            <section className="border border-[#BDBDBD] bg-white p-5">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#171717] mb-4">
                Included Facilities
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {space.facilities.map((fac) => (
                  <div
                    key={fac}
                    className="flex items-center gap-2 border border-[#BDBDBD] bg-[#F4F3ED] p-3 text-xs font-semibold text-[#171717]"
                  >
                    <span className="text-[#477A55] font-black">✓</span>
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Usage Rules - Collapsible */}
          {space.usageRules && space.usageRules.length > 0 && (
            <details className="border border-[#BDBDBD] bg-white group p-5">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#171717]">
                  Space Guidelines ({space.usageRules.length})
                </h2>
                <span className="text-xs font-bold text-[#777777] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-4 space-y-2 border-t border-[#BDBDBD] pt-4">
                {space.usageRules.map((rule, idx) => (
                  <div
                    key={rule}
                    className="flex items-start gap-3 border border-[#BDBDBD] p-3 text-xs text-[#171717]"
                  >
                    <span className="grid h-5 w-5 shrink-0 place-items-center border border-[#F15A24] text-[9px] font-black text-[#F15A24]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Right: Booking Form */}
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
