"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";
import Modal from "@/components/common/Modal";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function SpaceManagement({ initialSpaces = [] }) {
  const [spaces, setSpaces] = useState(initialSpaces);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [deletingSpace, setDeletingSpace] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const filteredSpaces = spaces.filter((sp) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      sp.name.toLowerCase().includes(q) ||
      (sp.buildingName && sp.buildingName.toLowerCase().includes(q)) ||
      sp.floor.toLowerCase().includes(q) ||
      sp.zone.toLowerCase().includes(q);

    const matchesType = selectedType === "All" || sp.studyType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDeleteConfirm = async () => {
    if (!deletingSpace) return;
    setActionLoading(true);
    setActionError("");

    try {
      const res = await fetch(`/api/spaces/${deletingSpace.id || deletingSpace._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to deactivate space");
      }

      setSpaces((prev) =>
        prev.map((s) =>
          (s.id || s._id) === (deletingSpace.id || deletingSpace._id)
            ? { ...s, isActive: false }
            : s
        )
      );

      setDeletingSpace(null);
    } catch (err) {
      setActionError(err.message || "Failed to deactivate space");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#263653]">Campus Study Spaces Management</h2>
          <p className="text-xs text-[#777777]">
            Create, configure, edit, and deactivate study facilities across campus.
          </p>
        </div>
        <Link
          href="/admin/spaces/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#263653] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#E69A68] transition"
        >
          <span>+ Add New Space</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search spaces by name, building, floor..."
            className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
            Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-1.5 text-xs text-[#263238] outline-none focus:border-[#263653]"
          >
            <option value="All">All Types</option>
            <option value="Silent Study">Silent Study</option>
            <option value="Individual Study">Individual Study</option>
            <option value="Group Study">Group Study</option>
            <option value="Discussion Room">Discussion Room</option>
          </select>
        </div>
      </div>

      {/* Spaces Table */}
      <div className="overflow-hidden rounded-2xl border border-[#263653]/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-[#F5F2EA] text-[#263653] font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Space Name & Type</th>
                <th className="px-4 py-3.5">Building & Floor</th>
                <th className="px-4 py-3.5">Zone</th>
                <th className="px-4 py-3.5">Seats</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#263238]">
              {filteredSpaces.map((space) => (
                <tr key={space.id || space._id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-[#263653]">{space.name}</div>
                    <div className="text-[11px] text-[#E69A68] font-semibold">{space.studyType}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium">{space.buildingName || space.building}</div>
                    <div className="text-[#777777] text-[11px]">{space.floor}</div>
                  </td>
                  <td className="px-4 py-4 text-[#777777]">{space.zone || space.location}</td>
                  <td className="px-4 py-4">
                    <span className="font-bold text-[#263653]">{space.totalSeats}</span> total
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        space.isActive !== false
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {space.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/spaces/${space.id || space._id}/edit`}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#263653] hover:border-[#263653] transition"
                      >
                        Edit
                      </Link>
                      {space.isActive !== false && (
                        <button
                          onClick={() => setDeletingSpace(space)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deactivate Modal */}
      <Modal
        isOpen={!!deletingSpace}
        onClose={() => setDeletingSpace(null)}
        title="Deactivate Study Space"
      >
        <div>
          <p className="text-xs text-[#777777] leading-relaxed">
            Are you sure you want to deactivate <strong className="text-[#263653]">{deletingSpace?.name}</strong>?
          </p>
          <p className="mt-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            Deactivated study spaces will no longer appear in student discovery or accept new reservations.
          </p>
          {actionError && <p className="mt-2 text-xs text-rose-700">{actionError}</p>}
          <div className="mt-6 flex justify-end gap-2.5">
            <button
              onClick={() => setDeletingSpace(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-[#263238]"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
            >
              {actionLoading ? <LoadingSpinner size="sm" text="" /> : "Confirm Deactivation"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
