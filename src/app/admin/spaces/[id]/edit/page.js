"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function EditSpacePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSpace() {
      try {
        const res = await fetch(`/api/spaces/${id}`);
        if (!res.ok) throw new Error("Failed to load space");
        const data = await res.json();
        const sp = data.space;
        setFormData({
          name: sp.name,
          buildingName: sp.buildingName || sp.building,
          floor: sp.floor,
          zone: sp.zone || sp.location,
          description: sp.description || "",
          studyType: sp.studyType,
          totalSeats: sp.totalSeats,
          facilities: (sp.facilities || []).join(", "),
          usageRules: (sp.usageRules || []).join(", "),
          isActive: sp.isActive !== false,
        });
      } catch (err) {
        setError(err.message || "Failed to load space");
      } finally {
        setLoading(false);
      }
    }
    fetchSpace();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        facilities: formData.facilities.split(",").map((f) => f.trim()).filter(Boolean),
        usageRules: formData.usageRules.split(",").map((r) => r.trim()).filter(Boolean),
      };

      const res = await fetch(`/api/spaces/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update space");

      router.push("/admin/spaces");
      router.refresh();
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading space details..." />;
  }

  if (!formData) {
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-xs text-rose-700">
        Space not found. <Link href="/admin/spaces" className="underline font-bold">Return to spaces</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E69A68]">
            Space Administration
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-[#263653]">Edit Study Space</h1>
        </div>
        <Link
          href="/admin/spaces"
          className="text-xs font-bold text-[#263653] hover:text-[#E69A68] transition"
        >
          ← Cancel & Back
        </Link>
      </div>

      <div className="rounded-2xl border border-[#263653]/10 bg-white p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
                Space Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
                Building Name
              </label>
              <input
                type="text"
                name="buildingName"
                value={formData.buildingName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
                Floor
              </label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
                Zone / Wing
              </label>
              <input
                type="text"
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
                Study Type
              </label>
              <select
                name="studyType"
                value={formData.studyType}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2 text-xs font-bold text-[#263653] outline-none focus:border-[#263653]"
              >
                <option value="Silent Study">Silent Study</option>
                <option value="Individual Study">Individual Study</option>
                <option value="Group Study">Group Study</option>
                <option value="Discussion Room">Discussion Room</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
              Total Seat Capacity
            </label>
            <input
              type="number"
              name="totalSeats"
              min="1"
              value={formData.totalSeats}
              onChange={handleChange}
              className="w-full sm:w-48 rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
              Facilities (comma separated)
            </label>
            <input
              type="text"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
              Usage Rules (comma separated)
            </label>
            <input
              type="text"
              name="usageRules"
              value={formData.usageRules}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2 text-xs text-[#263238] outline-none focus:border-[#263653]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-[#263653]"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-[#263238]">
              Active (Visible in student search)
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link
              href="/admin/spaces"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-[#263238]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#263653] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#E69A68] transition"
            >
              {saving ? <LoadingSpinner size="sm" text="" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
