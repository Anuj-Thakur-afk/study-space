import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#BDBDBD] bg-[#171717] text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center border border-[#F15A24] bg-[#F15A24] text-white font-black text-xs">
                SS
              </div>
              <span className="text-sm font-bold tracking-widest text-white uppercase">
                StudySpace
              </span>
            </div>
            <p className="mt-4 max-w-sm text-xs text-[#777777] leading-relaxed">
              Find Your Space. Focus on Your Goals. A campus workspace discovery and
              reservation platform eliminating study space competition during peak
              examination periods.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#477A55]">
              <span className="inline-block h-1.5 w-1.5 bg-[#477A55] animate-pulse" />
              System Operational — Real-time Occupancy Active
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-4">
              Navigate
            </h4>
            <ul className="space-y-2.5 text-xs text-[#BDBDBD]">
              <li>
                <Link href="/" className="hover:text-[#F15A24] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/spaces" className="hover:text-[#F15A24] transition">
                  Explore Spaces
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#F15A24] transition">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:text-[#F15A24] transition">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#F15A24] transition">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-4">
              Stack
            </h4>
            <div className="text-xs text-[#BDBDBD] space-y-1.5 leading-relaxed">
              <p>Next.js 14 App Router</p>
              <p>React · Tailwind CSS</p>
              <p>MongoDB · Mongoose</p>
              <p>Zod Validation</p>
              <p>JWT · HttpOnly Cookies</p>
              <p>Google OAuth 2.0</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-[#2a2a2a] pt-6 text-[10px] text-[#555]">
          <p className="uppercase tracking-widest">
            © {new Date().getFullYear()} StudySpace. All rights reserved.
          </p>
          <p className="mt-2 sm:mt-0 font-bold uppercase tracking-widest text-[#333]">
            INT252 · INT257 · Units I–IV
          </p>
        </div>
      </div>
    </footer>
  );
}
