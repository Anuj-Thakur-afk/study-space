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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#BDBDBD] pb-6">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
            Spaces
          </span>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#171717] sm:text-4xl">
            Manage Spaces
          </h1>
          <p className="mt-1 text-xs text-[#777777]">
            Add, edit, or deactivate study spaces across campus.
          </p>
        </div>
        <Link
          href="/admin/spaces/add"
          className="border border-[#F15A24] bg-[#F15A24] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#171717] hover:border-[#171717] transition"
        >
          + Add New Space
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#BDBDBD] bg-white p-4">
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search spaces by name, building, floor..."
            className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3 py-2 text-xs text-[#171717] outline-none focus:border-[#171717] transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-[#777777]">
            Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-[#BDBDBD] bg-white px-3 py-1.5 text-xs text-[#171717] font-semibold outline-none focus:border-[#171717] transition"
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
      <div className="border border-[#BDBDBD] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#BDBDBD] bg-[#F4F3ED] text-[#777777] font-bold uppercase tracking-wider text-[9px]">
              <tr>
                <th className="px-5 py-3.5">Space Name & Type</th>
                <th className="px-4 py-3.5">Building & Floor</th>
                <th className="px-4 py-3.5">Zone</th>
                <th className="px-4 py-3.5">Seats</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#BDBDBD] text-[#171717]">
              {filteredSpaces.map((space) => (
                <tr key={space.id || space._id} className="hover:bg-[#F4F3ED] transition">
                  <td className="px-5 py-4">
                    <div className="font-bold text-[#171717]">{space.name}</div>
                    <div className="text-[10px] text-[#F15A24] font-bold uppercase tracking-wider">{space.studyType}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-semibold">{space.buildingName || space.building}</div>
                    <div className="text-[#777777] text-[10px]">{space.floor}</div>
                  </td>
                  <td className="px-4 py-4 text-[#777777]">{space.zone || space.location}</td>
                  <td className="px-4 py-4">
                    <span className="font-black text-[#171717]">{space.totalSeats}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        space.isActive !== false
                          ? "border-[#477A55]/30 bg-[#E8F2EC] text-[#477A55]"
                          : "border-[#BDBDBD] bg-[#F4F3ED] text-[#777777]"
                      }`}
                    >
                      {space.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/spaces/${space.id || space._id}/edit`}
                        className="border border-[#BDBDBD] bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#171717] hover:border-[#171717] transition"
                      >
                        Edit
                      </Link>
                      {space.isActive !== false && (
                        <button
                          onClick={() => setDeletingSpace(space)}
                          className="border border-[#C43C32] px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C43C32] hover:bg-[#C43C32] hover:text-white transition"
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
        title="Deactivate Space"
      >
        <div>
          <p className="text-xs text-[#777777] leading-relaxed">
            Are you sure you want to deactivate <strong className="text-[#171717]">{deletingSpace?.name}</strong>?
          </p>
          <p className="mt-3 text-xs text-[#F15A24] bg-[#FFE1D5] p-3 border border-[#F15A24]/30">
            Deactivated study spaces will no longer appear in student discovery or accept new reservations.
          </p>
          {actionError && <p className="mt-2 text-xs text-[#C43C32] font-semibold">{actionError}</p>}
          <div className="mt-6 flex justify-end gap-2.5">
            <button
              onClick={() => setDeletingSpace(null)}
              className="border border-[#BDBDBD] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#171717]"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
              className="border border-[#C43C32] bg-[#C43C32] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black hover:border-black transition"
            >
              {actionLoading ? <LoadingSpinner size="sm" text="" /> : "Deactivate"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
