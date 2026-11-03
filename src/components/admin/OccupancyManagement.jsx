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

    // Toggle between Confirmed (Booked) and Occupied (Physically present)
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

      setMessage(`Booking updated to ${newStatus} successfully.`);
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
          status: "Available", // Released
        }),
      });

      if (!res.ok) throw new Error("Failed to release space");

      setBookings((prev) =>
        prev.map((b) =>
          (b.id || b._id) === bookingId ? { ...b, status: "Completed" } : b
        )
      );
      setMessage("Session marked completed and seat returned to Available status.");
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
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-amber-900 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Admin-Controlled Physical Occupancy Verification
            </h3>
            <p className="mt-1 text-xs text-amber-800 leading-relaxed">
              In accordance with university specifications, physical occupancy is managed and verified
              directly by front-desk administrators or lab coordinators. When a student physically checks
              in at the library or discussion pod, mark them as <strong>Occupied</strong>. When they leave, mark
              as <strong>Completed / Released</strong>.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
          ✓ {message}
        </div>
      )}

      {/* Active Today Check-in Table */}
      <div className="overflow-hidden rounded-2xl border border-[#263653]/10 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[#F5F2EA] px-6 py-4">
          <h3 className="text-sm font-bold text-[#263653]">
            Active Student Check-In & Physical Verification ({activeReservations.length})
          </h3>
          <p className="text-xs text-[#777777]">
            Toggle physical check-in status or release seats after student departs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[#263653] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-4 py-3">Space & Location</th>
                <th className="px-4 py-3">Seat</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Occupancy Status</th>
                <th className="px-5 py-3 text-right">Physical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#263238]">
              {activeReservations.length > 0 ? (
                activeReservations.map((b) => (
                  <tr key={b.id || b._id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#263653]">{b.userId?.name}</div>
                      <div className="text-[11px] text-[#777777]">{b.userId?.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold">{b.studySpaceId?.name}</div>
                      <div className="text-[11px] text-[#777777]">
                        {b.studySpaceId?.buildingName} · {b.studySpaceId?.floor}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-[#263653]">
                      {b.seatId?.seatNumber || "Full Room"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold">{b.bookingDate}</div>
                      <div className="text-[11px] text-[#777777]">
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
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                            b.status === "Occupied"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                          }`}
                        >
                          {loadingId === (b.id || b._id)
                            ? "Updating..."
                            : b.status === "Occupied"
                            ? "Mark Left (Occupied)"
                            : "Check-in (Occupied)"}
                        </button>

                        <button
                          onClick={() =>
                            handleMarkCompleted(
                              b.id || b._id,
                              b.seatId?._id || b.seatId
                            )
                          }
                          disabled={loadingId === (b.id || b._id)}
                          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                        >
                          Release Desk
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
