import Link from "next/link";

const highlights = [
  { number: "01", title: "Find your fit", text: "Explore silent zones, individual desks, and group rooms in one place." },
  { number: "02", title: "Know before you go", text: "Compare capacity, facilities, location, and the current availability listing." },
  { number: "03", title: "Study with less stress", text: "Spend less time searching and more time focusing on your work." }
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-forest">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white">S</span>
          StudySpace
        </Link>
        <Link href="/spaces" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#194633]">
          Explore spaces
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-12 sm:px-8 md:grid-cols-[1.1fr_.9fr] md:items-center md:pt-20">
        <div>
          <p className="mb-5 inline-flex rounded-full bg-mint px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-forest">
            Your campus study-space guide
          </p>
          <h1 className="max-w-2xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            Find your space.<br /><span className="text-forest">Focus on your goals.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Discover study areas that match the way you work — from peaceful silent zones to rooms made for group discussions.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/spaces" className="rounded-full bg-forest px-7 py-3.5 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#194633]">
              Find a study space <span aria-hidden="true">→</span>
            </Link>
            <a href="#how-it-works" className="rounded-full border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 hover:border-forest">
              How it works
            </a>
          </div>
          <div className="mt-12 flex gap-8 border-t border-slate-200 pt-7">
            <div><p className="text-2xl font-bold text-forest">3</p><p className="mt-1 text-sm text-slate-500">Study styles</p></div>
            <div><p className="text-2xl font-bold text-forest">1 place</p><p className="mt-1 text-sm text-slate-500">To explore spaces</p></div>
            <div><p className="text-2xl font-bold text-forest">Easy</p><p className="mt-1 text-sm text-slate-500">Space discovery</p></div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-[#EAF4EE] blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] bg-[#DCEBE0] p-5 sm:p-7">
            <div className="rounded-2xl bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div><p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Discover campus</p><p className="mt-1 text-lg font-bold">Spaces for your next session</p></div>
                <span className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-forest">Explore</span>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  ["Quiet Library Zone", "Silent study · Library, Floor 2", "Quiet"],
                  ["Innovation Hub", "Group study · Academic Block", "Group"],
                  ["Reading Lounge", "Individual study · Learning Centre", "Calm"]
                ].map(([name, detail, tag], index) => (
                  <div key={name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${index === 1 ? "bg-[#F7EEDC]" : "bg-mint"}`}>
                      <span className="text-xl">{index === 1 ? "👥" : index === 0 ? "📚" : "☕"}</span>
                    </div>
                    <div className="min-w-0 flex-1"><p className="font-semibold">{name}</p><p className="mt-1 truncate text-xs text-slate-500">{detail}</p></div>
                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-600">{tag}</span>
                  </div>
                ))}
              </div>
              <Link href="/spaces" className="mt-5 block rounded-xl bg-forest py-3 text-center text-sm font-semibold text-white">Browse all spaces</Link>
            </div>
            <p className="px-2 pb-1 pt-5 text-center text-sm font-medium text-forest">A better way to find where you study best.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-forest">Simple by design</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A space for every study style.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.number} className="rounded-2xl border border-slate-100 bg-cream p-7">
                <p className="text-sm font-bold text-forest">{item.number}</p>
                <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-200 px-5 py-7 text-center text-sm text-slate-500">StudySpace · P06 Study Space Discovery and Booking</footer>
    </main>
  );
}