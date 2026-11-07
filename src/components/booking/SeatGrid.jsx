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
    Object.keys(rowMap).forEach((r) => {
      rowMap[r].sort((a, b) => (a.col || 0) - (b.col || 0));
    });
    return rowMap;
  }, [seats]);

  const getSeatStyle = (status, isSelected) => {
    if (isSelected) {
      return "bg-[#F15A24] text-white border-2 border-[#F15A24] shadow-sm scale-105 cursor-pointer";
    }

    switch (status) {
      case "Available":
        return "bg-white text-[#477A55] border border-[#477A55]/40 hover:bg-[#E8F2EC] hover:border-[#477A55] cursor-pointer";
      case "Booked":
        return "bg-[#FAEAE9] text-[#C43C32] border border-[#C43C32]/30 cursor-not-allowed opacity-80";
      case "Occupied":
        return "bg-[#FFE1D5] text-[#F15A24] border border-[#F15A24]/30 cursor-not-allowed opacity-80";
      case "Unavailable":
      default:
        return "bg-[#F4F3ED] text-[#BDBDBD] border border-[#BDBDBD] cursor-not-allowed opacity-60";
    }
  };

  return (
    <div className="border border-[#BDBDBD] bg-white p-5">
      {/* Header + legend */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#BDBDBD] pb-4 mb-5">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-[#171717]">
            Seat Layout
          </h3>
          <p className="text-[10px] text-[#777777] mt-0.5">
            Select an available seat to reserve your study spot.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-wider">
          {[
            { color: "bg-[#477A55]", label: "Available" },
            { color: "bg-[#F15A24]", label: "Selected" },
            { color: "bg-[#C43C32]", label: "Booked" },
            { color: "bg-[#BDBDBD]", label: "Unavailable" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 ${item.color}`} />
              <span className="text-[#777777]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Front indicator */}
      <div className="mb-5">
        <div className="mx-auto max-w-xs border border-dashed border-[#BDBDBD] bg-[#F4F3ED] py-1.5 text-center text-[9px] font-black uppercase tracking-widest text-[#777777]">
          Front of Space / Entrance
        </div>
      </div>

      {/* Seat grid */}
      <div className="space-y-3 overflow-x-auto pb-2">
        {Object.entries(rows).map(([rowNum, rowSeats]) => (
          <div key={rowNum} className="flex items-center justify-center gap-2 min-w-[320px]">
            <span className="w-7 text-[9px] font-black uppercase text-[#BDBDBD] text-right">
              R{rowNum}
            </span>
            <div className="flex items-center gap-2">
              {rowSeats.map((seat) => {
                const isSelected = selectedSeatId === (seat.id || seat._id);
                const isClickable = seat.status === "Available" && !disabled;

                return (
                  <button
                    key={seat.id || seat._id}
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && onSelectSeat(seat.id || seat._id)}
                    title={`${seat.seatNumber} · ${seat.status}${
                      seat.features?.length ? ` · ${seat.features.join(", ")}` : ""
                    }`}
                    className={`relative flex h-11 w-12 flex-col items-center justify-center text-xs font-black transition duration-150 ${getSeatStyle(
                      seat.status,
                      isSelected
                    )}`}
                  >
                    <span>{seat.seatNumber.split("-")[1] || seat.seatNumber}</span>
                    {seat.features?.includes("Power Socket") && (
                      <span className="text-[8px] -mt-0.5 leading-none opacity-80">⚡</span>
                    )}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center bg-[#171717] text-[8px] text-white font-black">
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

      {/* Selected seat info */}
      {selectedSeatId && (
        <div className="mt-5 flex items-center justify-between border border-[#FFE1D5] bg-[#FFE1D5] p-3">
          <div className="text-xs text-[#171717]">
            <span className="font-black">Selected: </span>
            {seats.find((s) => (s.id || s._id) === selectedSeatId)?.seatNumber || "None"}
            {seats.find((s) => (s.id || s._id) === selectedSeatId)?.features?.length > 0 && (
              <span className="ml-2 text-[#777777]">
                ({seats.find((s) => (s.id || s._id) === selectedSeatId)?.features.join(", ")})
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onSelectSeat(null)}
            className="text-[10px] font-black uppercase tracking-wider text-[#C43C32] hover:underline"
          >
            Deselect
          </button>
        </div>
      )}
    </div>
  );
}
