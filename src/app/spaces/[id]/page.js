import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudySpaceById, studySpaces } from "@/lib/spaces";

export function generateStaticParams() {
  return studySpaces.map((space) => ({ id: space.id }));
}

export async function generateMetadata({ params }) {
  const space = getStudySpaceById(params.id);
  return { title: space ? `${space.name} | StudySpace` : "Space not found | StudySpace" };
}

export default function SpaceDetailsPage({ params }) {
  const space = getStudySpaceById(params.id);
  if (!space) notFound();

  const statusStyle = space.availability === "Available" ? "bg-emerald-50 text-emerald-700" : space.availability === "Limited" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";

  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-forest"><span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white">S</span>StudySpace</Link>
          <Link href="/spaces" className="text-sm font-semibold text-forest">← Back to spaces</Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <p className="text-sm text-slate-500"><Link href="/spaces" className="hover:text-forest">Explore spaces</Link> / {space.name}</p>
        <div className="mt-6 rounded-3xl bg-[#EAF4EE] p-7 sm:p-10">
          <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-forest">{space.type}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle}`}>{space.availability}</span></div>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">{space.name}</h1>
          <p className="mt-4 text-slate-600">{space.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4"><p className="text-xs text-slate-500">Building</p><p className="mt-1 font-bold">{space.building}</p></div>
            <div className="rounded-2xl bg-white p-4"><p className="text-xs text-slate-500">Floor / Room</p><p className="mt-1 font-bold">{space.floor}</p></div>
            <div className="rounded-2xl bg-white p-4"><p className="text-xs text-slate-500">Zone</p><p className="mt-1 font-bold">{space.location}</p></div>
          </div>
        </div>
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-bold">Capacity information</h2>
            <p className="mt-5 text-4xl font-bold text-forest">{space.availableSeats}<span className="text-lg font-medium text-slate-400"> / {space.totalSeats}</span></p>
            <p className="mt-1 text-sm text-slate-500">Seats listed as available</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-forest" style={{ width: `${(space.availableSeats / space.totalSeats) * 100}%` }} /></div>
          </section>
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-bold">Facilities</h2>
            <ul className="mt-4 space-y-3">{space.facilities.map((facility) => <li key={facility} className="flex items-center gap-2 text-sm text-slate-600"><span className="text-forest">✓</span>{facility}</li>)}</ul>
          </section>
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft md:col-span-2">
            <h2 className="text-lg font-bold">Usage rules</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">{space.rules.map((rule) => <li key={rule} className="rounded-xl bg-cream p-3 text-sm text-slate-600">{rule}</li>)}</ul>
          </section>
        </div>
        <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          This page is part of Module 1 (Discovery). Seat reservation and live occupancy controls will be implemented in Module 2.
        </div>
      </div>
    </main>
  );
}