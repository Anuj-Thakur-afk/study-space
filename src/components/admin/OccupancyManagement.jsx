"use client";

import { useState } from "react";
import StatusBadge from "@/components/common/StatusBadge";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function OccupancyManagement({ initialBookings = [] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const handleToggleOccupancy = async (bookingId, currentStatus, seatId) => {
    setLoadingId(bookingId);
    setMessage("");

    const newStatus = currentStatus === "Occupied" ? "Confirmed" : "Occupied";

    try {
      const res = await fetch("/api/admin/occupancy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          seatId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update physical occupancy");

      setBookings((prev) =>
        prev.map((b) =>
          (b.id || b._id) === bookingId ? { ...b, status: newStatus } : b
        )
      );

      setMessage(`Status updated to ${newStatus}.`);
    } catch (err) {
      alert(err.message || "Failed to update occupancy");
    } finally {
      setLoadingId(null);
    }
  };

  const handleMarkCompleted = async (bookingId, seatId) => {
    setLoadingId(bookingId);
    try {
      const res = await fetch("/api/admin/occupancy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          seatId,
          status: "Available",
        }),
      });

      if (!res.ok) throw new Error("Failed to release space");

      setBookings((prev) =>
        prev.map((b) =>
          (b.id || b._id) === bookingId ? { ...b, status: "Completed" } : b
        )
      );
      setMessage("Session completed. Seat released.");
    } catch (err) {
      alert(err.message || "Failed to release space");
    } finally {
      setLoadingId(null);
    }
  };

  const activeReservations = bookings.filter(
    (b) => (b.status === "Confirmed" || b.status === "Occupied") && b.bookingDate >= todayStr
  );

  return (
    <div className="space-y-6">
      {/* Verification Notice */}
      <div className="border border-[#BDBDBD] bg-white p-5">
        <span className="text-[9px] font-black uppercase tracking-widest text-[#F15A24]">
          Physical Occupancy Verification
        </span>
        <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-[#171717]">
          Live Check-In Management
        </h2>
        <p className="mt-2 text-xs text-[#777777] leading-relaxed">
          Physical occupancy is controlled by campus administrators. When students physically arrive at a facility, mark them as <strong className="text-[#171717]">Occupied</strong>. When they leave, release the desk back into availability.
        </p>
      </div>

      {message && (
        <div className="border border-[#477A55] bg-[#E8F2EC] p-3 text-xs font-bold uppercase tracking-wider text-[#477A55]">
          ✓ {message}
        </div>
      )}

      {/* Active Check-in Table */}
      <div className="border border-[#BDBDBD] bg-white">
        <div className="border-b border-[#BDBDBD] bg-[#F4F3ED] px-6 py-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#171717]">
            Active Student Check-In ({activeReservations.length})
          </h3>
          <p className="text-[10px] text-[#777777] uppercase tracking-wider mt-0.5">
            Toggle physical check-in status or release seats after student departs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#BDBDBD] bg-white text-[#777777] font-bold uppercase tracking-wider text-[9px]">
              <tr>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-4 py-3">Space & Location</th>
                <th className="px-4 py-3">Seat</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Physical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BDBDBD] text-[#171717]">
              {activeReservations.length > 0 ? (
                activeReservations.map((b) => (
                  <tr key={b.id || b._id} className="hover:bg-[#F4F3ED] transition">
                    <td className="px-5 py-4">
                      <div className="font-bold">{b.userId?.name}</div>
                      <div className="text-[10px] text-[#777777]">{b.userId?.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold">{b.studySpaceId?.name}</div>
                      <div className="text-[10px] text-[#777777]">
                        {b.studySpaceId?.buildingName} · {b.studySpaceId?.floor}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold">
                      {b.seatId?.seatNumber || "Full Room"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold">{b.bookingDate}</div>
                      <div className="text-[10px] text-[#777777]">
                        {b.startTime} – {b.endTime}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleToggleOccupancy(
                              b.id || b._id,
                              b.status,
                              b.seatId?._id || b.seatId
                            )
                          }
                          disabled={loadingId === (b.id || b._id)}
                          className={`border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                            b.status === "Occupied"
                              ? "border-[#BDBDBD] bg-[#F4F3ED] text-[#171717] hover:border-[#171717]"
                              : "border-[#F15A24] bg-[#F15A24] text-white hover:bg-[#171717] hover:border-[#171717]"
                          }`}
                        >
                          {loadingId === (b.id || b._id)
                            ? "Updating..."
                            : b.status === "Occupied"
                            ? "Mark Left"
                            : "Check-in"}
                        </button>

                        <button
                          onClick={() =>
                            handleMarkCompleted(
                              b.id || b._id,
                              b.seatId?._id || b.seatId
                            )
                          }
                          disabled={loadingId === (b.id || b._id)}
                          className="border border-[#BDBDBD] px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#777777] hover:border-[#171717] hover:text-[#171717] transition"
                        >
                          Release
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-xs text-[#777777]">
                    No active student reservations currently scheduled for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
