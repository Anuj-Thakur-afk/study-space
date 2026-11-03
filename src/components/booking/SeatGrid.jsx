"use client";

import { useMemo } from "react";

export default function SeatGrid({
  seats = [],
  selectedSeatId,
  onSelectSeat,
  disabled = false,
}) {
  // Group seats by row
  const rows = useMemo(() => {
    const rowMap = {};
    seats.forEach((seat) => {
      const r = seat.row || 1;
      if (!rowMap[r]) rowMap[r] = [];
      rowMap[r].push(seat);
    });
    // Sort seats in each row by column or seatNumber
    Object.keys(rowMap).forEach((r) => {
      rowMap[r].sort((a, b) => (a.col || 0) - (b.col || 0));
    });
    return rowMap;
  }, [seats]);

  const getSeatColor = (status, isSelected) => {
    if (isSelected) {
      return "bg-[#263653] text-white border-2 border-[#E69A68] shadow-md ring-2 ring-[#E69A68]/40 scale-105";
    }

    switch (status) {
      case "Available":
        // Green
        return "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-500 cursor-pointer";
      case "Booked":
        // Red
        return "bg-rose-50 text-rose-700 border border-rose-200 cursor-not-allowed opacity-80";
      case "Occupied":
        // Orange
        return "bg-amber-50 text-amber-800 border border-amber-300 cursor-not-allowed opacity-80";
      case "Unavailable":
      default:
        // Grey
        return "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60";
    }
  };

  return (
    <div className="rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-[#263653]">Visual Seat Arrangement</h3>
          <p className="text-xs text-[#777777]">
            Select an available desk to reserve your study spot.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-emerald-500" />
            <span className="text-[#263238]">Available (Green)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-rose-500" />
            <span className="text-[#263238]">Booked (Red)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-amber-500" />
            <span className="text-[#263238]">Occupied (Orange)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-md bg-slate-300" />
            <span className="text-[#777777]">Unavailable (Grey)</span>
          </div>
        </div>
      </div>

      {/* Front of Room / Stage Indicator */}
      <div className="mt-6 mb-6">
        <div className="mx-auto max-w-md rounded-lg border border-dashed border-[#263653]/30 bg-[#F5F2EA] py-1.5 text-center text-[11px] font-bold uppercase tracking-widest text-[#263653]">
          Front of Space / Entrance
        </div>
      </div>

      {/* Seat Layout Grid */}
      <div className="space-y-3 overflow-x-auto pb-2">
        {Object.entries(rows).map(([rowNum, rowSeats]) => (
          <div key={rowNum} className="flex items-center justify-center gap-3 min-w-[320px]">
            <span className="w-8 text-[11px] font-bold uppercase text-[#777777] text-right">
              R{rowNum}
            </span>
            <div className="flex items-center gap-2.5">
              {rowSeats.map((seat) => {
                const isSelected = selectedSeatId === (seat.id || seat._id);
                const isClickable = seat.status === "Available" && !disabled;

                return (
                  <button
                    key={seat.id || seat._id}
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && onSelectSeat(seat.id || seat._id)}
                    title={`${seat.seatNumber} · Status: ${seat.status}${
                      seat.features?.length ? ` · Features: ${seat.features.join(", ")}` : ""
                    }`}
                    className={`relative flex h-11 w-12 flex-col items-center justify-center rounded-xl transition duration-150 text-xs font-bold ${getSeatColor(
                      seat.status,
                      isSelected
                    )}`}
                  >
                    <span>{seat.seatNumber.split("-")[1] || seat.seatNumber}</span>
                    {seat.features?.includes("Power Socket") && (
                      <span className="text-[9px] -mt-1 leading-none">⚡</span>
                    )}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E69A68] text-[9px] text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Seat Info Banner */}
      {selectedSeatId && (
        <div className="mt-6 flex items-center justify-between rounded-xl bg-[#DCE5DC] p-3 text-xs text-[#263653]">
          <div>
            <span className="font-bold">Selected Seat: </span>
            {seats.find((s) => (s.id || s._id) === selectedSeatId)?.seatNumber || "None"}
            {seats.find((s) => (s.id || s._id) === selectedSeatId)?.features?.length > 0 && (
              <span className="ml-2 text-[#263653]/80">
                ({seats.find((s) => (s.id || s._id) === selectedSeatId)?.features.join(", ")})
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onSelectSeat(null)}
            className="text-[11px] font-semibold text-rose-700 hover:underline"
          >
            Deselect
          </button>
        </div>
      )}
    </div>
  );
}
