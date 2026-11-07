import Link from "next/link";
import connectDB from "@/lib/db";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import SpaceCard from "@/components/discovery/SpaceCard";

export const dynamic = "force-dynamic";

async function getFeaturedSpaces() {
  try {
    await connectDB();
    const spaces = await StudySpace.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const enriched = await Promise.all(
      spaces.map(async (sp) => {
        const availableCount = await Seat.countDocuments({
          studySpaceId: sp._id,
          status: "Available",
        });

        let calculatedAvailability = "Available";
        if (availableCount === 0) calculatedAvailability = "Full";
        else if (availableCount <= Math.max(1, Math.floor(sp.totalSeats * 0.25)))
          calculatedAvailability = "Limited";

        return {
          ...sp,
          id: sp._id.toString(),
          _id: sp._id.toString(),
          availableSeats: availableCount,
          availability: calculatedAvailability,
        };
      })
    );
    return enriched;
  } catch (err) {
    console.error("Home page space fetch error:", err);
    return [];
  }
}

export default async function HomePage() {
  const featuredSpaces = await getFeaturedSpaces();

  const categories = [
    {
      title: "Silent Study",
      desc: "Zero-distraction acoustic spaces for deep reading and exam prep.",
      type: "Silent Study",
      code: "SS",
    },
    {
      title: "Individual Desks",
      desc: "Private carrels with power sockets and dedicated task lamps.",
      type: "Individual Study",
      code: "ID",
    },
    {
      title: "Group Rooms",
      desc: "Enclosed rooms with 4K monitors and whiteboards.",
      type: "Group Study",
      code: "GR",
    },
    {
      title: "Discussion Pods",
      desc: "Roundtables for thesis discussions and peer tutoring.",
      type: "Discussion Room",
      code: "DP",
    },
  ];

  return (
    <div>
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-[#BDBDBD] bg-[#171717]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-0 lg:grid-cols-2 min-h-[520px]">
            {/* Left copy */}
            <div className="flex flex-col justify-center py-16 pr-0 lg:pr-12">
              <div className="inline-flex items-center gap-2 border border-[#F15A24]/30 px-3 py-1.5 w-fit mb-8">
                <span className="h-1.5 w-1.5 bg-[#F15A24] animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
                  Live Campus Availability
                </span>
              </div>

              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl xl:text-7xl">
                Find Your<br />
                <span className="text-[#F15A24]">Space.</span>
                <br />Focus On<br />Your Goals.
              </h1>

              <p className="mt-8 max-w-md text-sm text-white/60 leading-relaxed">
                During examination periods, students waste precious time searching for open desks.
                StudySpace connects you with real-time room availability, visual seat layouts,
                and instant reservations.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/spaces"
                  className="border border-[#F15A24] bg-[#F15A24] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-transparent hover:text-[#F15A24]"
                >
                  Explore All Spaces →
                </Link>
                <Link
                  href="/register"
                  className="border border-white/20 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white/70 transition hover:border-white hover:text-white"
                >
                  Create Account
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-14 grid grid-cols-3 gap-0 border-t border-[#2a2a2a] pt-8">
                {[
                  { value: "100%", label: "Live Occupancy" },
                  { value: "4 Types", label: "Silent to Collaborative" },
                  { value: "Zero", label: "Double-booking Conflicts" },
                ].map((stat) => (
                  <div key={stat.label} className="border-r border-[#2a2a2a] pr-6 last:border-0">
                    <div className="text-xl font-black text-white">{stat.value}</div>
                    <div className="mt-0.5 text-[10px] text-white/40 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — data panel */}
            <div className="hidden lg:flex flex-col justify-center border-l border-[#2a2a2a] py-16 pl-12">
              <div className="mb-6">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#777777]">
                  Live Campus Status
                </span>
                <h3 className="mt-1 text-sm font-bold text-white">Available Spaces Today</h3>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Central Library Silent Hall", sub: "Floor 2 · North Wing", seats: "32 Desks", type: "SILENT" },
                  { name: "Innovation Hub Team Room", sub: "Ground Floor · Room G-04", seats: "8 Seats", type: "GROUP" },
                  { name: "Learning Centre Lounge", sub: "Floor 1 · East Wing", seats: "24 Desks", type: "INDIVIDUAL" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between border border-[#2a2a2a] bg-[#1e1e1e] p-4 hover:border-[#F15A24] transition"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-xs font-bold text-white truncate">{item.name}</div>
                      <div className="text-[11px] text-[#777777]">{item.sub}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="border border-[#333] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#777777]">
                        {item.type}
                      </span>
                      <div className="text-[10px] text-[#777777] mt-1">{item.seats}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/spaces"
                className="mt-6 block border border-[#F15A24] bg-[#F15A24] py-3 text-center text-xs font-bold uppercase tracking-widest text-white transition hover:bg-transparent hover:text-[#F15A24]"
              >
                Browse All Campus Spaces
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="border-b border-[#BDBDBD]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
                Study Environment Types
              </span>
              <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#171717]">
                Every Learning Style,<br />Covered.
              </h2>
            </div>
            <Link
              href="/spaces"
              className="border border-[#171717] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171717] transition hover:bg-[#171717] hover:text-white w-fit"
            >
              View All →
            </Link>
          </div>

          <div className="grid gap-px border border-[#BDBDBD] bg-[#BDBDBD] sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, idx) => (
              <Link
                key={cat.title}
                href={`/spaces?type=${encodeURIComponent(cat.type)}`}
                className={`group flex flex-col justify-between p-7 transition hover:bg-[#171717] ${
                  idx % 2 === 0 ? "bg-white" : "bg-[#F4F3ED]"
                }`}
              >
                <div>
                  <div className="text-3xl font-black text-[#BDBDBD] group-hover:text-[#F15A24] transition leading-none mb-5">
                    {cat.code}
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight text-[#171717] group-hover:text-white transition">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#777777] leading-relaxed group-hover:text-white/60 transition">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-6 text-xs font-bold uppercase tracking-wider text-[#BDBDBD] group-hover:text-[#F15A24] transition">
                  Filter →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED SPACES ──────────────────────────────────────────────── */}
      <section className="border-b border-[#BDBDBD] bg-[#F4F3ED]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
                Live Database Records
              </span>
              <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-[#171717]">
                Featured Study Spaces
              </h2>
            </div>
            <Link
              href="/spaces"
              className="border border-[#171717] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171717] transition hover:bg-[#171717] hover:text-white"
            >
              All Spaces →
            </Link>
          </div>

          {featuredSpaces.length > 0 ? (
            <div className="grid gap-px border border-[#BDBDBD] bg-[#BDBDBD] sm:grid-cols-2 lg:grid-cols-3">
              {featuredSpaces.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#BDBDBD] p-16 text-center">
              <p className="text-xs uppercase tracking-widest text-[#777777]">
                No spaces configured yet. Run the seed script to populate campus data.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-[#BDBDBD] bg-[#171717]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-10">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
              Simple Three-Step Workflow
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">
              How StudySpace Works
            </h2>
          </div>

          <div className="grid gap-px border border-[#2a2a2a] bg-[#2a2a2a] md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Discover & Filter",
                desc: "Search by building, floor, zone, capacity, and study style. Silent study or collaborative room — your choice.",
              },
              {
                step: "02",
                title: "Choose Seat & Window",
                desc: "View the visual seat layout, pick an available desk or group room, and lock your reservation window.",
              },
              {
                step: "03",
                title: "Check-in & Focus",
                desc: "Present your digital booking pass at campus reception, check into your space, and study undisturbed.",
              },
            ].map((st) => (
              <div key={st.step} className="bg-[#1a1a1a] p-8 hover:bg-[#1e1e1e] transition">
                <div className="text-5xl font-black text-[#F15A24]/30 leading-none mb-4">
                  {st.step}
                </div>
                <h3 className="text-base font-black uppercase tracking-tight text-white">
                  {st.title}
                </h3>
                <p className="mt-3 text-xs text-white/50 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="inline-block border border-[#F15A24] bg-[#F15A24] px-10 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-transparent hover:text-[#F15A24]"
            >
              Get Started — It's Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
