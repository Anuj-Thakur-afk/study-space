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

  const selectClass =
    "w-full border border-[#BDBDBD] bg-white px-3 py-2.5 text-xs text-[#171717] font-medium outline-none focus:border-[#171717] transition appearance-none";

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="border-b border-[#BDBDBD] pb-8">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
          Campus Space Discovery
        </span>
        <h1 className="mt-1 text-4xl font-black uppercase tracking-tight text-[#171717] sm:text-5xl">
          Explore Spaces
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#777777] leading-relaxed">
          Search silent libraries, individual reading desks, collaboration hubs,
          and group discussion rooms across all campus buildings.
        </p>

        {/* Search bar */}
        <div className="mt-6 flex items-center border border-[#BDBDBD] bg-white focus-within:border-[#171717] transition max-w-2xl">
          <div className="pl-4 text-[#777777]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search space name, building, floor, zone, or facility..."
            className="flex-1 bg-transparent py-3 px-3 text-sm text-[#171717] placeholder:text-[#BDBDBD] outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="pr-4 text-xs font-bold uppercase tracking-wider text-[#F15A24] hover:text-[#171717] transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Filter sidebar ───────────────────────────────────────────── */}
        <aside className="w-full lg:w-56 shrink-0">
          <div className="border border-[#BDBDBD] bg-white">
            <div className="border-b border-[#BDBDBD] px-4 py-3 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#171717]">
                Filters
              </span>
              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="text-[9px] font-bold uppercase tracking-wider text-[#F15A24] hover:text-[#171717] transition"
                >
                  Reset ↺
                </button>
              )}
            </div>

            <div className="divide-y divide-[#BDBDBD]">
              {/* Study Type */}
              <div className="p-4">
                <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-2">
                  Study Type
                </label>
                <div className="space-y-1">
                  {STUDY_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold transition ${
                        type === t
                          ? "bg-[#F15A24] text-white"
                          : "text-[#777777] hover:bg-[#F4F3ED] hover:text-[#171717]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="p-4">
                <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-2">
                  Availability
                </label>
                <div className="space-y-1">
                  {AVAILABILITY_OPTIONS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAvailability(a)}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold transition ${
                        availability === a
                          ? "bg-[#F15A24] text-white"
                          : "text-[#777777] hover:bg-[#F4F3ED] hover:text-[#171717]"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Building */}
              <div className="p-4">
                <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-2">
                  Building
                </label>
                <div className="relative">
                  <select
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className={selectClass}
                  >
                    {buildings.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Floor */}
              <div className="p-4">
                <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-2">
                  Floor Level
                </label>
                <div className="relative">
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className={selectClass}
                  >
                    {floors.map((fl) => (
                      <option key={fl} value={fl}>{fl}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Min Capacity */}
              <div className="p-4">
                <label className="block text-[9px] font-black uppercase tracking-widest text-[#777777] mb-2">
                  Min. Capacity
                </label>
                <input
                  type="number"
                  min="0"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full border border-[#BDBDBD] bg-white px-3 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717] transition"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Results grid ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#BDBDBD]">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#777777]">
                Results
              </span>
              <div className="text-xl font-black text-[#171717]">
                {filteredSpaces.length}
                <span className="text-sm font-normal text-[#777777] ml-1">
                  of {initialSpaces.length} spaces
                </span>
              </div>
            </div>
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="border border-[#BDBDBD] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#777777] hover:border-[#F15A24] hover:text-[#F15A24] transition"
              >
                Clear Filters
              </button>
            )}
          </div>

          {filteredSpaces.length > 0 ? (
            <div className="grid gap-px border border-[#BDBDBD] bg-[#BDBDBD] sm:grid-cols-2 xl:grid-cols-3">
              {filteredSpaces.map((space) => (
                <SpaceCard key={space.id || space._id} space={space} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#BDBDBD] p-16 text-center">
              <div className="mb-4 text-5xl font-black text-[#BDBDBD]">?</div>
              <h3 className="text-base font-black uppercase text-[#171717]">
                No spaces found
              </h3>
              <p className="mt-2 text-xs text-[#777777]">
                Try adjusting your filters or search term.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 border border-[#F15A24] bg-[#F15A24] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-transparent hover:text-[#F15A24] transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
