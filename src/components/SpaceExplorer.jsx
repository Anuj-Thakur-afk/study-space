 "use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const types = ["All types", "Silent Study", "Individual Study", "Group Study", "Discussion Room"];
const availabilityOptions = ["Any availability", "Available", "Limited", "Full"];

function AvailabilityBadge({ status }) {
  const styles = {
    Available: "bg-emerald-50 text-emerald-700",
    Limited: "bg-amber-50 text-amber-700",
    Full: "bg-rose-50 text-rose-700"
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

function SpaceCard({ space }) {
  const icon = space.type === "Group Study" ? "👥" : space.type === "Silent Study" ? "📚" : space.type === "Discussion Room" ? "💬" : "🪑";
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-[#C7DDCE]">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-mint text-2xl">{icon}</div>
        <AvailabilityBadge status={space.availability} />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-forest">{space.type}</p>
      <h2 className="mt-2 text-lg font-bold leading-6">{space.name}</h2>
      <p className="mt-2 text-sm text-slate-500">{space.building} · {space.floor}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-cream p-3">
        <div><p className="text-xs text-slate-500">Available seats</p><p className="mt-1 font-bold">{space.availableSeats} <span className="font-normal text-slate-400">/ {space.totalSeats}</span></p></div>
        <div><p className="text-xs text-slate-500">Location</p><p className="mt-1 truncate font-semibold">{space.location}</p></div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {space.facilities.slice(0, 2).map((facility) => <span key={facility} className="rounded-full border border-slate-100 px-2.5 py-1 text-xs text-slate-500">{facility}</span>)}
      </div>
      <Link href={`/spaces/${space.id}`} className="mt-5 inline-flex items-center justify-between rounded-xl border border-forest px-4 py-3 text-sm font-semibold text-forest transition group-hover:bg-forest group-hover:text-white">
        View space details <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export default function SpaceExplorer({ spaces }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All types");
  const [availability, setAvailability] = useState("Any availability");
  const [location, setLocation] = useState("All locations");

  const locations = useMemo(() => ["All locations", ...new Set(spaces.map((space) => space.building))], [spaces]);

  const filteredSpaces = useMemo(() => {
    const query = search.trim().toLowerCase();
    return spaces.filter((space) => {
      const matchesSearch = !query || [space.name, space.building, space.floor, space.location, space.type].some((value) => value.toLowerCase().includes(query));
      const matchesType = type === "All types" || space.type === type;
      const matchesAvailability = availability === "Any availability" || space.availability === availability;
      const matchesLocation = location === "All locations" || space.building === location;
      return matchesSearch && matchesType && matchesAvailability && matchesLocation;
    });
  }, [spaces, search, type, availability, location]);

  function clearFilters() {
    setSearch("");
    setType("All types");
    setAvailability("Any availability");
    setLocation("All locations");
  }

  return (
    <>
      <section className="rounded-3xl bg-[#EAF4EE] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-forest">Discover your next study spot</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Find a space that works for you.</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">Search campus study spaces by name, building, location, study type, and listed availability.</p>
        <label htmlFor="space-search" className="sr-only">Search study spaces</label>
        <div className="mt-7 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <span aria-hidden="true" className="text-xl">⌕</span>
          <input id="space-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by space, building, floor..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
          {search && <button onClick={() => setSearch("")} className="text-xs font-semibold text-forest">Clear</button>}
        </div>
      </section>

      <section className="mt-8" aria-label="Study space filters">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="text-lg font-bold">Explore spaces</h2><p className="mt-1 text-sm text-slate-500">{filteredSpaces.length} spaces found</p></div>
          <button onClick={clearFilters} className="text-sm font-semibold text-forest underline underline-offset-4">Reset filters</button>
        </div>
        <div className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:grid-cols-3">
          <div><label htmlFor="type-filter" className="mb-2 block text-xs font-bold text-slate-500">STUDY TYPE</label><select id="type-filter" value={type} onChange={(event) => setType(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-forest">{types.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div><label htmlFor="availability-filter" className="mb-2 block text-xs font-bold text-slate-500">AVAILABILITY</label><select id="availability-filter" value={availability} onChange={(event) => setAvailability(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-forest">{availabilityOptions.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div><label htmlFor="location-filter" className="mb-2 block text-xs font-bold text-slate-500">BUILDING / LOCATION</label><select id="location-filter" value={location} onChange={(event) => setLocation(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-forest">{locations.map((item) => <option key={item}>{item}</option>)}</select></div>
        </div>
      </section>

      {filteredSpaces.length > 0 ? (
        <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSpaces.map((space) => <SpaceCard key={space.id} space={space} />)}
        </section>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-3xl">🔎</p><h3 className="mt-3 font-bold">No spaces match your filters</h3><p className="mt-2 text-sm text-slate-500">Try another search term or reset the filters.</p>
          <button onClick={clearFilters} className="mt-5 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white">Reset filters</button>
        </div>
      )}
      <p className="mt-8 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
        Demo data: availability values are sample listings for Module 1. Live booking and occupancy updates will be added in later modules.
      </p>
    </>
  );
}