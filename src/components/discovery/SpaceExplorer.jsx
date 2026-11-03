"use client";

import { useState, useMemo } from "react";
import SpaceCard from "@/components/discovery/SpaceCard";

const STUDY_TYPES = [
  "All types",
  "Silent Study",
  "Individual Study",
  "Group Study",
  "Discussion Room",
];

const AVAILABILITY_OPTIONS = [
  "Any availability",
  "Available",
  "Limited",
  "Full",
];

export default function SpaceExplorer({ initialSpaces = [] }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All types");
  const [availability, setAvailability] = useState("Any availability");
  const [building, setBuilding] = useState("All locations");
  const [floor, setFloor] = useState("All floors");
  const [capacity, setCapacity] = useState("");

  // Derive unique buildings & floors from spaces data
  const buildings = useMemo(() => {
    const list = new Set(
      initialSpaces.map((s) => s.buildingName || s.building).filter(Boolean)
    );
    return ["All locations", ...Array.from(list)];
  }, [initialSpaces]);

  const floors = useMemo(() => {
    const list = new Set(initialSpaces.map((s) => s.floor).filter(Boolean));
    return ["All floors", ...Array.from(list)];
  }, [initialSpaces]);

  // Client-side filtering across all fields
  const filteredSpaces = useMemo(() => {
    const q = search.trim().toLowerCase();
    const minCap = capacity ? parseInt(capacity, 10) : null;
    return initialSpaces.filter((space) => {
      const spaceBuilding = space.buildingName || space.building || "";
      const spaceZone = space.zone || space.location || "";

      const matchesSearch =
        !q ||
        [space.name, spaceBuilding, space.floor, spaceZone, space.studyType, ...(space.facilities || [])]
          .some((val) => val && String(val).toLowerCase().includes(q));

      const matchesType = type === "All types" || space.studyType === type;
      const matchesAvailability =
        availability === "Any availability" ||
        (space.availability && space.availability.toLowerCase() === availability.toLowerCase());
      const matchesBuilding =
        building === "All locations" || spaceBuilding === building;
      const matchesFloor = floor === "All floors" || space.floor === floor;
      const matchesCapacity = !minCap || (space.totalSeats && space.totalSeats >= minCap);

      return matchesSearch && matchesType && matchesAvailability && matchesBuilding && matchesFloor && matchesCapacity;
    });
  }, [initialSpaces, search, type, availability, building, floor, capacity]);

  function handleResetFilters() {
    setSearch("");
    setType("All types");
    setAvailability("Any availability");
    setBuilding("All locations");
    setFloor("All floors");
    setCapacity("");
  }

  const isFiltered =
    search ||
    type !== "All types" ||
    availability !== "Any availability" ||
    building !== "All locations" ||
    floor !== "All floors" ||
    capacity !== "";

  return (
    <div className="space-y-8">
      {/* Search Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-[#263653]/10 bg-white p-6 sm:p-10 shadow-sm">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#DCE5DC]/60 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DCE5DC] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#263653]">
            Campus Space Discovery
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#263653] sm:text-4xl">
            Find Your Ideal Academic Space
          </h1>
          <p className="mt-3 text-sm text-[#777777] leading-relaxed">
            Search silent libraries, individual reading desks, collaboration hubs, and group discussion rooms
            across all campus buildings.
          </p>

          {/* Search Bar Input */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F5F2EA] px-4 py-3 shadow-inner transition focus-within:border-[#263653] focus-within:bg-white">
            <span className="text-lg text-[#777777]">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by space name, building, floor, zone, or facility (e.g. 'Silent', 'Library', 'Whiteboard')..."
              className="w-full bg-transparent text-sm text-[#263238] placeholder-[#777777] outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs font-bold text-[#E69A68] hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter Controls Bar */}
      <section aria-label="Filters" className="rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-[#263653]">Refine Study Spaces</h2>
            <p className="text-xs text-[#777777]">
              Showing <strong className="text-[#263653]">{filteredSpaces.length}</strong> of {initialSpaces.length} spaces available
            </p>
          </div>
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="rounded-lg bg-[#F5F2EA] px-3 py-1.5 text-xs font-semibold text-[#263653] hover:bg-[#DCE5DC] transition"
            >
              Reset all filters ↺
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Study Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
              Study Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2.5 text-xs text-[#263238] font-medium outline-none focus:border-[#263653] transition"
            >
              {STUDY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
              Seat Availability
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2.5 text-xs text-[#263238] font-medium outline-none focus:border-[#263653] transition"
            >
              {AVAILABILITY_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Building */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
              Building / Complex
            </label>
            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2.5 text-xs text-[#263238] font-medium outline-none focus:border-[#263653] transition"
            >
              {buildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Floor */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
              Floor Level
            </label>
            <select
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2.5 text-xs text-[#263238] font-medium outline-none focus:border-[#263653] transition"
            >
              {floors.map((fl) => (
                <option key={fl} value={fl}>
                  {fl}
                </option>
              ))}
            </select>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
              Min. Capacity
            </label>
            <input
              type="number"
              min="0"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 10"
              className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3 py-2 text-xs text-[#263238] font-medium outline-none focus:border-[#263653] transition"
            />
          </div>
        </div>
      </section>

      {/* Results Grid or Empty State */}
      {filteredSpaces.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSpaces.map((space) => (
            <SpaceCard key={space.id || space._id} space={space} />
          ))}
        </section>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#263653]/20 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#F5F2EA] text-3xl">
            🔍
          </div>
          <h3 className="mt-4 text-lg font-bold text-[#263653]">No matching study spaces found</h3>
          <p className="mt-1 text-sm text-[#777777]">
            Try adjusting your search criteria, selecting a different building, or resetting filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 rounded-full bg-[#263653] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#E69A68]"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
