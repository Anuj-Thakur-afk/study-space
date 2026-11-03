import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#263653]/10 bg-[#FFFFFF] text-[#263238]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#263653] text-[#F5F2EA] font-bold">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-[#263653]">StudySpace</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-[#777777] leading-relaxed">
              Find Your Space. Focus on Your Goals. An academic workspace discovery and reservation platform
              designed to eliminate study space competition during peak examination periods.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#263653]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Campus System Operational · Real-time Occupancy Active
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#263653]">Modules</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#777777]">
              <li>
                <Link href="/spaces" className="hover:text-[#E69A68] transition">
                  Module 1: Discovery & Filters
                </Link>
              </li>
              <li>
                <Link href="/spaces" className="hover:text-[#E69A68] transition">
                  Module 2: Seat & Room Booking
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#E69A68] transition">
                  Module 3: Space Administration
                </Link>
              </li>
              <li>
                <Link href="/admin/occupancy" className="hover:text-[#E69A68] transition">
                  Admin Occupancy Management
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#263653]">Academic Context</h4>
            <div className="mt-3 text-xs text-[#777777] space-y-1.5 leading-relaxed">
              <p><strong className="text-[#263653]">Project ID:</strong> P06</p>
              <p><strong className="text-[#263653]">Stack:</strong> Next.js App Router, React.js, Tailwind CSS, MongoDB, Mongoose, Zod</p>
              <p><strong className="text-[#263653]">Curriculum:</strong> INT252 (Units I-IV) & INT257 (Units I-IV)</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-6 text-xs text-[#777777]">
          <p>© {new Date().getFullYear()} StudySpace. All university campus study facilities reserved.</p>
          <p className="mt-2 sm:mt-0 font-medium text-[#263653]">
            Modern Academic Workspace Design System
          </p>
        </div>
      </div>
    </footer>
  );
}
