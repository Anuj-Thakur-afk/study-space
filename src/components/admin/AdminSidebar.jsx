"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const DAILY_TASKS = [
  { href: "/admin", label: "Dashboard", code: "DB" },
  { href: "/admin/bookings", label: "Bookings", code: "BK" },
  { href: "/admin/occupancy", label: "Live Occupancy", code: "OC" },
];

const MANAGEMENT_TASKS = [
  { href: "/admin/spaces", label: "Spaces", code: "SP" },
  { href: "/admin/seats", label: "Seats", code: "ST" },
  { href: "/admin/reports", label: "Usage Reports", code: "RP" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <aside className="w-full md:w-56 shrink-0 border border-[#BDBDBD] bg-[#171717] text-white p-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2 mb-2">
          <div className="grid h-6 w-6 place-items-center bg-[#F15A24] text-white font-black text-[10px]">
            SS
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            StudySpace
          </span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24] block">
          Admin Console
        </span>
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-4">
        <div>
          <span className="block px-3 pb-1 text-[9px] font-black uppercase tracking-widest text-[#777777]">
            Daily Tasks
          </span>
          <div className="space-y-1">
            {DAILY_TASKS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? "bg-[#F15A24] text-white"
                      : "text-[#BDBDBD] hover:bg-[#222] hover:text-white"
                  }`}
                >
                  <span className={`text-[9px] font-mono font-black ${isActive ? "text-white" : "text-[#777777]"}`}>
                    {item.code}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <span className="block px-3 pb-1 text-[9px] font-black uppercase tracking-widest text-[#777777]">
            Setup & Reports
          </span>
          <div className="space-y-1">
            {MANAGEMENT_TASKS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? "bg-[#F15A24] text-white"
                      : "text-[#BDBDBD] hover:bg-[#222] hover:text-white"
                  }`}
                >
                  <span className={`text-[9px] font-mono font-black ${isActive ? "text-white" : "text-[#777777]"}`}>
                    {item.code}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Logout button */}
      <div className="p-3 border-t border-[#2a2a2a] mt-6">
        <button
          onClick={handleLogout}
          className="w-full border border-[#C43C32]/40 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-[#C43C32] hover:bg-[#C43C32] hover:text-white transition flex items-center justify-between"
        >
          <span>Sign Out</span>
          <span>→</span>
        </button>
      </div>

      <div className="p-4 border-t border-[#2a2a2a] text-[9px] text-[#777777] uppercase tracking-wider">
        Audit logging active · MongoDB connected
      </div>
    </aside>
  );
}
