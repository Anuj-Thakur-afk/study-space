"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard Overview", icon: "📊" },
  { href: "/admin/spaces", label: "Study Spaces", icon: "🏛️" },
  { href: "/admin/seats", label: "Seat Allocations", icon: "🪑" },
  { href: "/admin/occupancy", label: "Live Occupancy", icon: "🟢" },
  { href: "/admin/bookings", label: "All Bookings", icon: "📋" },
  { href: "/admin/reports", label: "Utilization Reports", icon: "📈" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0 rounded-2xl border border-[#263653]/10 bg-white p-4 shadow-sm">
      <div className="mb-4 px-3 py-2 border-b border-slate-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#E69A68]">
          Module 3 Console
        </span>
        <h2 className="text-sm font-bold text-[#263653]">Campus Space Admin</h2>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-[#263653] text-white shadow-sm"
                  : "text-[#263238] hover:bg-[#F5F2EA] hover:text-[#263653]"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-xl bg-[#F5F2EA] p-3 text-[11px] text-[#777777]">
        <p className="font-bold text-[#263653]">Administrator Security</p>
        <p className="mt-1">
          Authorized personnel only. All occupancy and seat changes are audit-logged to MongoDB.
        </p>
      </div>
    </aside>
  );
}
