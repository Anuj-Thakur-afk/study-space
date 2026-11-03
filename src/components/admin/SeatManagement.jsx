"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Modal from "@/components/common/Modal";

export default function SeatManagement({ spaces = [] }) {
  const [selectedSpaceId, setSelectedSpaceId] = useState(spaces[0]?.id || spaces[0]?._id || "");
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingSeat, setEditingSeat] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSeatNumber, setNewSeatNumber] = useState("");
  const [newSeatRow, setNewSeatRow] = useState(1);
  const [newSeatCol, setNewSeatCol] = useState(1);
  const [newSeatFeatures, setNewSeatFeatures] = useState("Power Socket");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!selectedSpaceId) return;

    async function fetchSeats() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/spaces/${selectedSpaceId}/seats`);
        if (!res.ok) throw new Error("Failed to load seats");
        const data = await res.json();
        setSeats(data.seats || []);
      } catch (err) {
        setError(err.message || "Error loading seats");
      } finally {
        setLoading(false);
      }
    }

    fetchSeats();
  }, [selectedSpaceId]);

  const handleStatusChange = async (seatId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/seats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update seat status");

      setSeats((prev) =>
        prev.map((s) => ((s.id || s._id) === seatId ? { ...s, status: newStatus } : s))
      );
      setEditingSeat(null);
    } catch (err) {
      alert(err.message || "Error updating seat");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddSeat = async (e) => {
    e.preventDefault();
    if (!newSeatNumber.trim()) return;

    setActionLoading(true);
    try {
      const featuresArray = newSeatFeatures.split(",").map((f) => f.trim()).filter(Boolean);
      const res = await fetch("/api/admin/seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studySpaceId: selectedSpaceId,
          seatNumber: newSeatNumber.trim(),
          row: Number(newSeatRow),
          col: Number(newSeatCol),
          features: featuresArray,
          status: "Available",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create seat");

      setSeats((prev) => [...prev, data.seat]);
      setAddModalOpen(false);
      setNewSeatNumber("");
    } catch (err) {
      alert(err.message || "Error creating seat");
    } finally {
      setActionLoading(false);
    }
  };

  const selectedSpace = spaces.find((s) => (s.id || s._id) === selectedSpaceId);

  return (
    <div className="space-y-6">
      {/* Controls & Space Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#263653]">Campus Seat Allocations & Layout</h2>
          <p className="text-xs text-[#777777]">
            Select a study space to view, add, or update physical seat availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSpaceId}
            onChange={(e) => setSelectedSpaceId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-[#F5F2EA]/60 px-3.5 py-2 text-xs font-bold text-[#263653] outline-none focus:border-[#263653]"
          >
            {spaces.map((sp) => (
              <option key={sp.id || sp._id} value={sp.id || sp._id}>
                {sp.name} ({sp.studyType})
              </option>
            ))}
          </select>

          <button
            onClick={() => setAddModalOpen(true)}
            className="rounded-xl bg-[#263653] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#E69A68] transition"
          >
            + Add Seat
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading seats for selected space..." />
      ) : error ? (
        <div className="rounded-xl bg-rose-50 p-4 text-xs text-rose-700">{error}</div>
      ) : (
        <div className="rounded-2xl border border-[#263653]/10 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E69A68]">
                {selectedSpace?.buildingName} · {selectedSpace?.floor}
              </span>
              <h3 className="text-base font-bold text-[#263653]">{selectedSpace?.name}</h3>
              <p className="text-xs text-[#777777]">
                Total Seats: {seats.length} · Available:{" "}
                <span className="font-bold text-emerald-700">
                  {seats.filter((s) => s.status === "Available").length}
                </span>{" "}
                · Occupied:{" "}
                <span className="font-bold text-amber-700">
                  {seats.filter((s) => s.status === "Occupied").length}
                </span>
              </p>
            </div>

            {/* Status Legend */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Booked
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Occupied
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Unavailable
              </span>
            </div>
          </div>

          {/* Seat Grid Display */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {seats.map((seat) => {
              let badgeColor = "bg-emerald-50 border-emerald-300 text-emerald-800 hover:border-emerald-500";
              if (seat.status === "Booked") badgeColor = "bg-rose-50 border-rose-300 text-rose-800";
              if (seat.status === "Occupied") badgeColor = "bg-amber-50 border-amber-300 text-amber-800";
              if (seat.status === "Unavailable") badgeColor = "bg-slate-100 border-slate-300 text-slate-500";

              return (
                <div
                  key={seat.id || seat._id}
                  onClick={() => setEditingSeat(seat)}
                  className={`flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-xl border p-1 shadow-sm transition hover:scale-105 ${badgeColor}`}
                  title="Click to update seat status or configuration"
                >
                  <span className="text-xs font-bold">{seat.seatNumber}</span>
                  <span className="text-[10px] uppercase font-semibold mt-0.5">
                    {seat.status.slice(0, 4)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Seat Modal */}
      <Modal
        isOpen={!!editingSeat}
        onClose={() => setEditingSeat(null)}
        title={`Configure Seat: ${editingSeat?.seatNumber}`}
      >
        <div>
          <p className="text-xs text-[#777777]">
            Update physical availability or mark seat unavailable for maintenance.
          </p>

          <div className="mt-4 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777777]">
              Current Status:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Available", "Booked", "Occupied", "Unavailable"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(editingSeat.id || editingSeat._id, st)}
                  disabled={actionLoading}
                  className={`rounded-xl border py-2 text-xs font-bold transition ${
                    editingSeat?.status === st
                      ? "border-[#263653] bg-[#263653] text-white"
                      : "border-slate-200 bg-[#F5F2EA] text-[#263238] hover:bg-[#DCE5DC]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setEditingSeat(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#263238]"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Seat Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={`Add New Seat to ${selectedSpace?.name}`}
      >
        <form onSubmit={handleAddSeat} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
              Seat Number / Identifier
            </label>
            <input
              type="text"
              value={newSeatNumber}
              onChange={(e) => setNewSeatNumber(e.target.value)}
              placeholder="e.g. S-33, DESK-04"
              className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
                Row Number
              </label>
              <input
                type="number"
                min="1"
                value={newSeatRow}
                onChange={(e) => setNewSeatRow(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
                Column Number
              </label>
              <input
                type="number"
                min="1"
                value={newSeatCol}
                onChange={(e) => setNewSeatCol(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
              Features (comma separated)
            </label>
            <input
              type="text"
              value={newSeatFeatures}
              onChange={(e) => setNewSeatFeatures(e.target.value)}
              placeholder="Power Socket, Window View, Desk Lamp"
              className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
            />
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#263238]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-xl bg-[#263653] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#E69A68]"
            >
              {actionLoading ? "Adding..." : "Add Seat"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
