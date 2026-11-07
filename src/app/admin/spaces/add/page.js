"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AddSpacePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    buildingName: "Central Library",
    floor: "1st Floor",
    zone: "East Wing",
    description: "",
    studyType: "Silent Study",
    totalSeats: 16,
    facilities: "High-speed Wi-Fi, Universal Power Sockets, Air Conditioning",
    usageRules: "Maintain quiet focus, No food or uncovered drinks, Clean desk before leaving",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true);

    try {
      const payload = {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        facilities: formData.facilities.split(",").map((f) => f.trim()).filter(Boolean),
        usageRules: formData.usageRules.split(",").map((r) => r.trim()).filter(Boolean),
      };

      const res = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create study space");

      router.push("/admin/spaces");
      router.refresh();
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#BDBDBD] pb-6">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
            Facility Setup
          </span>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#171717] sm:text-4xl">
            Add Study Space
          </h1>
        </div>
        <Link
          href="/admin/spaces"
          className="text-xs font-bold uppercase tracking-wider text-[#777777] hover:text-[#F15A24] transition"
        >
          ← Cancel & Back
        </Link>
      </div>

      <div className="border border-[#BDBDBD] bg-white p-6 sm:p-8">
        {error && (
          <div className="mb-6 border border-[#C43C32] bg-[#FAEAE9] p-3 text-xs text-[#C43C32]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1.5">
                Space Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Science Library – Mezzanine Zone"
                className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3.5 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717]"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1.5">
                Building Name
              </label>
              <input
                type="text"
                name="buildingName"
                value={formData.buildingName}
                onChange={handleChange}
                placeholder="Central Library, Innovation Hub..."
                className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3.5 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717]"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1.5">
                Floor
              </label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="e.g. 2nd Floor"
                className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3.5 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717]"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1.5">
                Zone / Wing
              </label>
              <input
                type="text"
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                placeholder="e.g. North Wing Room 204"
                className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3.5 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717]"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1.5">
                Study Type
              </label>
              <select
                name="studyType"
                value={formData.studyType}
                onChange={handleChange}
                className="w-full border border-[#BDBDBD] bg-white px-3.5 py-2.5 text-xs font-bold text-[#171717] outline-none focus:border-[#171717]"
              >
                <option value="Silent Study">Silent Study</option>
                <option value="Individual Study">Individual Study</option>
                <option value="Group Study">Group Study</option>
                <option value="Discussion Room">Discussion Room</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1.5">
              Total Seat Capacity
            </label>
            <input
              type="number"
              name="totalSeats"
              min="1"
              max="100"
              value={formData.totalSeats}
              onChange={handleChange}
              className="w-full sm:w-48 border border-[#BDBDBD] bg-[#F4F3ED] px-3.5 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717]"
              required
            />
            <p className="mt-1 text-[10px] text-[#777777]">
              Individual seat records will be auto-generated in MongoDB upon creation.
            </p>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe atmosphere, equipment, and optimal use cases..."
              className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3.5 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717]"
              required
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1.5">
              Facilities (comma separated)
            </label>
            <input
              type="text"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3.5 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717]"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-1.5">
              Usage Rules (comma separated)
            </label>
            <input
              type="text"
              name="usageRules"
              value={formData.usageRules}
              onChange={handleChange}
              className="w-full border border-[#BDBDBD] bg-[#F4F3ED] px-3.5 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 border-[#BDBDBD]"
            />
            <label htmlFor="isActive" className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Active (Visible in student search & bookings)
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link
              href="/admin/spaces"
              className="border border-[#BDBDBD] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171717]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="border border-[#F15A24] bg-[#F15A24] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#171717] hover:border-[#171717] transition"
            >
              {loading ? <LoadingSpinner size="sm" text="" /> : "Create Space & Generate Seats"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
