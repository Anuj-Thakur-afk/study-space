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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#BDBDBD] pb-6">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
            Seats
          </span>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#171717] sm:text-4xl">
            Manage Seats
          </h1>
          <p className="mt-1 text-xs text-[#777777]">
            View seat layouts, update seat status, or add new desks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSpaceId}
            onChange={(e) => setSelectedSpaceId(e.target.value)}
            className="border border-[#BDBDBD] bg-white px-3.5 py-2 text-xs font-bold text-[#171717] outline-none focus:border-[#171717]"
          >
            {spaces.map((sp) => (
              <option key={sp.id || sp._id} value={sp.id || sp._id}>
                {sp.name} ({sp.studyType})
              </option>
            ))}
          </select>

          <button
            onClick={() => setAddModalOpen(true)}
            className="border border-[#F15A24] bg-[#F15A24] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#171717] hover:border-[#171717] transition"
          >
            + Add Seat
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading seats for selected space..." />
      ) : error ? (
        <div className="border border-[#C43C32] bg-[#FAEAE9] p-4 text-xs text-[#C43C32]">{error}</div>
      ) : (
        <div className="border border-[#BDBDBD] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BDBDBD] pb-4">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#F15A24]">
                {selectedSpace?.buildingName} · {selectedSpace?.floor}
              </span>
              <h3 className="text-base font-black uppercase tracking-tight text-[#171717]">{selectedSpace?.name}</h3>
              <p className="text-xs text-[#777777] mt-0.5">
                Total Seats: <span className="font-bold text-[#171717]">{seats.length}</span> · Available:{" "}
                <span className="font-bold text-[#477A55]">
                  {seats.filter((s) => s.status === "Available").length}
                </span>{" "}
                · Occupied:{" "}
                <span className="font-bold text-[#F15A24]">
                  {seats.filter((s) => s.status === "Occupied").length}
                </span>
              </p>
            </div>

            {/* Status Legend */}
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-[#477A55]">
                <span className="h-2 w-2 bg-[#477A55]" /> Available
              </span>
              <span className="flex items-center gap-1.5 text-[#C43C32]">
                <span className="h-2 w-2 bg-[#C43C32]" /> Booked
              </span>
              <span className="flex items-center gap-1.5 text-[#F15A24]">
                <span className="h-2 w-2 bg-[#F15A24]" /> Occupied
              </span>
              <span className="flex items-center gap-1.5 text-[#777777]">
                <span className="h-2 w-2 bg-[#BDBDBD]" /> Unavailable
              </span>
            </div>
          </div>

          {/* Seat Grid Display */}
          <div className="mt-8 flex flex-wrap gap-2.5 justify-center">
            {seats.map((seat) => {
              let badgeColor = "bg-white border-[#477A55]/40 text-[#477A55] hover:border-[#477A55]";
              if (seat.status === "Booked") badgeColor = "bg-[#FAEAE9] border-[#C43C32]/40 text-[#C43C32]";
              if (seat.status === "Occupied") badgeColor = "bg-[#FFE1D5] border-[#F15A24]/40 text-[#F15A24]";
              if (seat.status === "Unavailable") badgeColor = "bg-[#F4F3ED] border-[#BDBDBD] text-[#777777]";

              return (
                <div
                  key={seat.id || seat._id}
                  onClick={() => setEditingSeat(seat)}
                  className={`flex h-14 w-14 cursor-pointer flex-col items-center justify-center border p-1 transition duration-150 hover:scale-105 ${badgeColor}`}
                  title="Click to update status"
                >
                  <span className="text-xs font-black">{seat.seatNumber}</span>
                  <span className="text-[8px] uppercase font-bold tracking-wider mt-0.5">
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
            Update physical status or mark seat unavailable for maintenance.
          </p>

          <div className="mt-4 space-y-2">
            <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777]">
              Current Status:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Available", "Booked", "Occupied", "Unavailable"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(editingSeat.id || editingSeat._id, st)}
                  disabled={actionLoading}
                  className={`border py-2 text-xs font-bold uppercase tracking-wider transition ${
                    editingSeat?.status === st
                      ? "border-[#F15A24] bg-[#F15A24] text-white"
                      : "border-[#BDBDBD] bg-white text-[#171717] hover:border-[#171717]"
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
              className="border border-[#BDBDBD] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#171717]"
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
        title={`Add Seat to ${selectedSpace?.name}`}
      >
        <form onSubmit={handleAddSeat} className="space-y-4">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1">
              Seat Number / ID
            </label>
            <input
              type="text"
              value={newSeatNumber}
              onChange={(e) => setNewSeatNumber(e.target.value)}
              placeholder="e.g. S-33, DESK-04"
              className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3 py-2 text-xs text-[#171717] outline-none focus:border-[#171717]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1">
                Row Number
              </label>
              <input
                type="number"
                min="1"
                value={newSeatRow}
                onChange={(e) => setNewSeatRow(e.target.value)}
                className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3 py-2 text-xs text-[#171717] outline-none focus:border-[#171717]"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1">
                Column Number
              </label>
              <input
                type="number"
                min="1"
                value={newSeatCol}
                onChange={(e) => setNewSeatCol(e.target.value)}
                className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3 py-2 text-xs text-[#171717] outline-none focus:border-[#171717]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1">
              Features (comma separated)
            </label>
            <input
              type="text"
              value={newSeatFeatures}
              onChange={(e) => setNewSeatFeatures(e.target.value)}
              placeholder="Power Socket, Window View"
              className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3 py-2 text-xs text-[#171717] outline-none focus:border-[#171717]"
            />
          </div>

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="border border-[#BDBDBD] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#171717]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="border border-[#F15A24] bg-[#F15A24] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#171717] hover:border-[#171717] transition"
            >
              {actionLoading ? "Adding..." : "Add Seat"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
