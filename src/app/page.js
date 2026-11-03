import Link from "next/link";
import connectDB from "@/lib/db";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import SpaceCard from "@/components/discovery/SpaceCard";

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
        else if (availableCount <= Math.max(1, Math.floor(sp.totalSeats * 0.25))) calculatedAvailability = "Limited";

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
      title: "Silent Study Zones",
      desc: "Zero-distraction acoustic spaces for deep reading and exam preparation.",
      type: "Silent Study",
      icon: "📚",
      color: "bg-[#DCE5DC]",
    },
    {
      title: "Individual Desks",
      desc: "Private carrels equipped with power sockets and dedicated task lamps.",
      type: "Individual Study",
      icon: "🪑",
      color: "bg-[#F5F2EA]",
    },
    {
      title: "Group Study Rooms",
      desc: "Enclosed rooms with 4K monitors and whiteboards for team project sprints.",
      type: "Group Study",
      icon: "👥",
      color: "bg-[#F7EEDC]",
    },
    {
      title: "Discussion Pods",
      desc: "Collaborative roundtables ideal for thesis discussions and peer tutoring.",
      type: "Discussion Room",
      icon: "💬",
      color: "bg-[#EAEFF4]",
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#263653]/10 bg-[#FFFFFF] pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#DCE5DC] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#263653]">
                <span className="h-2 w-2 rounded-full bg-[#E69A68]" />
                University Campus Study Guide & Booking Platform
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#263653] sm:text-6xl sm:leading-[1.1]">
                Find Your Space. <br />
                <span className="text-[#E69A68]">Focus on Your Goals.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base text-[#777777] leading-relaxed">
                During examination periods, students waste precious time searching for open desks.
                StudySpace connects you with real-time room availability, visual seat layouts, and instant reservations.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/spaces"
                  className="rounded-full bg-[#263653] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#E69A68]"
                >
                  Explore All Study Spaces →
                </Link>
                <a
                  href="#how-it-works"
                  className="rounded-full border border-slate-200 bg-[#F5F2EA] px-6 py-3.5 text-sm font-bold text-[#263238] hover:border-[#263653] transition"
                >
                  How StudySpace Works
                </a>
              </div>

              {/* Metric stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-100 pt-8">
                <div>
                  <div className="text-2xl font-extrabold text-[#263653]">100%</div>
                  <div className="text-xs text-[#777777] mt-0.5">Live Occupancy</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#263653]">4 Categories</div>
                  <div className="text-xs text-[#777777] mt-0.5">Silent to Collaborative</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#263653]">Zero</div>
                  <div className="text-xs text-[#777777] mt-0.5">Double-booking Conflicts</div>
                </div>
              </div>
            </div>

            {/* Visual Hero Mockup */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-[#DCE5DC]/50 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-[#263653]/10 bg-[#F5F2EA] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                      Live Campus Status
                    </span>
                    <h3 className="text-sm font-bold text-[#263653]">Available Spaces Today</h3>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                    🟢 Open Now
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    {
                      name: "Central Library Silent Hall",
                      sub: "Floor 2 · North Wing",
                      seats: "32 Desks",
                      type: "Silent Study",
                    },
                    {
                      name: "Innovation Hub Team Room",
                      sub: "Ground Floor · Room G-04",
                      seats: "8 Seats",
                      type: "Group Study",
                    },
                    {
                      name: "Learning Centre Lounge",
                      sub: "Floor 1 · East Wing",
                      seats: "24 Desks",
                      type: "Individual Study",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-sm"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="font-bold text-xs text-[#263653] truncate">{item.name}</div>
                        <div className="text-[11px] text-[#777777]">{item.sub}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="rounded-full bg-[#F5F2EA] px-2 py-0.5 text-[10px] font-bold text-[#263653]">
                          {item.type}
                        </span>
                        <div className="text-[10px] text-[#777777] mt-1">{item.seats}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/spaces"
                  className="mt-6 block rounded-xl bg-[#263653] py-2.5 text-center text-xs font-bold text-white transition hover:bg-[#E69A68]"
                >
                  Browse Full Campus Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Study Categories Section */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E69A68]">
            Work the Way You Learn Best
          </span>
          <h2 className="mt-2 text-2xl font-extrabold text-[#263653] sm:text-3xl">
            Diverse Study Environments for Every Session
          </h2>
          <p className="mt-2 text-xs text-[#777777] leading-relaxed">
            Eliminating conflict between students who need pinpoint silence and those working on active group projects.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="group flex flex-col justify-between rounded-2xl border border-[#263653]/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#E69A68]"
            >
              <div>
                <div className={`grid h-12 w-12 place-items-center rounded-xl ${cat.color} text-2xl`}>
                  {cat.icon}
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#263653]">{cat.title}</h3>
                <p className="mt-2 text-xs text-[#777777] leading-relaxed">{cat.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href={`/spaces?type=${encodeURIComponent(cat.type)}`}
                  className="text-xs font-bold text-[#263653] group-hover:text-[#E69A68] transition flex items-center justify-between"
                >
                  <span>Filter by {cat.type}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Spaces from Database */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E69A68]">
              Live Campus Availability
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-[#263653] sm:text-3xl">
              Featured Study Spaces
            </h2>
            <p className="mt-1 text-xs text-[#777777]">
              Real database records connected to actual desk and room allocations.
            </p>
          </div>
          <Link
            href="/spaces"
            className="rounded-full border border-[#263653] px-4 py-2 text-xs font-bold text-[#263653] hover:bg-[#263653] hover:text-white transition"
          >
            View All Spaces →
          </Link>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="border-y border-[#263653]/10 bg-[#FFFFFF] py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E69A68]">
              Simple Three-Step Workflow
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-[#263653] sm:text-3xl">
              How StudySpace Keeps Campus Organized
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Discover & Filter",
                desc: "Search by building, floor, zone, capacity, and desired study style (silent study or collaborative room).",
              },
              {
                step: "02",
                title: "Choose Seat & Window",
                desc: "View the visual seat layout, pick an available desk or group room, and lock your reservation window.",
              },
              {
                step: "03",
                title: "Check-in & Focus",
                desc: "Present your digital pass at the campus reception, check into your space, and study with total peace of mind.",
              },
            ].map((st) => (
              <div
                key={st.step}
                className="rounded-2xl border border-slate-100 bg-[#F5F2EA] p-6 shadow-sm"
              >
                <div className="text-2xl font-black text-[#E69A68]">{st.step}</div>
                <h3 className="mt-3 text-base font-bold text-[#263653]">{st.title}</h3>
                <p className="mt-2 text-xs text-[#777777] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
