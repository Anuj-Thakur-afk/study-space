"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  const isActive = (path) => pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-40 border-b border-[#263653]/10 bg-[#FFFFFF]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#263653] text-[#F5F2EA] shadow-sm transition group-hover:bg-[#E69A68]">
            <span className="text-lg font-extrabold tracking-tight">S</span>
          </div>
          <div>
            <span className="block text-lg font-bold tracking-tight text-[#263653]">StudySpace</span>
            <span className="block -mt-1 text-[10px] font-medium uppercase tracking-wider text-[#777777]">
              Campus Discovery
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-[#263238]">
          <Link
            href="/spaces"
            className={`rounded-lg px-3.5 py-2 transition ${
              isActive("/spaces")
                ? "bg-[#DCE5DC] text-[#263653] font-semibold"
                : "hover:bg-[#F5F2EA] text-[#263238]"
            }`}
          >
            Explore Spaces
          </Link>

          {user && user.role === "STUDENT" && (
            <>
              <Link
                href="/dashboard"
                className={`rounded-lg px-3.5 py-2 transition ${
                  isActive("/dashboard")
                    ? "bg-[#DCE5DC] text-[#263653] font-semibold"
                    : "hover:bg-[#F5F2EA] text-[#263238]"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/bookings"
                className={`rounded-lg px-3.5 py-2 transition ${
                  isActive("/bookings")
                    ? "bg-[#DCE5DC] text-[#263653] font-semibold"
                    : "hover:bg-[#F5F2EA] text-[#263238]"
                }`}
              >
                My Bookings
              </Link>
            </>
          )}

          {user && user.role === "ADMIN" && (
            <>
              <Link
                href="/admin"
                className={`rounded-lg px-3.5 py-2 transition ${
                  pathname === "/admin"
                    ? "bg-[#263653] text-white font-semibold"
                    : "hover:bg-[#F5F2EA] text-[#263238]"
                }`}
              >
                Admin Overview
              </Link>
              <Link
                href="/admin/spaces"
                className={`rounded-lg px-3 py-2 transition ${
                  isActive("/admin/spaces")
                    ? "bg-[#263653] text-white font-semibold"
                    : "hover:bg-[#F5F2EA] text-[#263238]"
                }`}
              >
                Spaces
              </Link>
              <Link
                href="/admin/seats"
                className={`rounded-lg px-3 py-2 transition ${
                  isActive("/admin/seats")
                    ? "bg-[#263653] text-white font-semibold"
                    : "hover:bg-[#F5F2EA] text-[#263238]"
                }`}
              >
                Seats
              </Link>
              <Link
                href="/admin/occupancy"
                className={`rounded-lg px-3 py-2 transition ${
                  isActive("/admin/occupancy")
                    ? "bg-[#263653] text-white font-semibold"
                    : "hover:bg-[#F5F2EA] text-[#263238]"
                }`}
              >
                Occupancy
              </Link>
              <Link
                href="/admin/bookings"
                className={`rounded-lg px-3 py-2 transition ${
                  isActive("/admin/bookings")
                    ? "bg-[#263653] text-white font-semibold"
                    : "hover:bg-[#F5F2EA] text-[#263238]"
                }`}
              >
                Bookings
              </Link>
              <Link
                href="/admin/reports"
                className={`rounded-lg px-3 py-2 transition ${
                  isActive("/admin/reports")
                    ? "bg-[#263653] text-white font-semibold"
                    : "hover:bg-[#F5F2EA] text-[#263238]"
                }`}
              >
                Reports
              </Link>
            </>
          )}
        </nav>

        {/* Auth / Account Actions */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-slate-100" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-[#F5F2EA] py-1 pl-1.5 pr-3 text-xs font-semibold text-[#263653] hover:border-[#263653] transition"
              >
                <div className="grid h-7 w-7 place-items-center rounded-full bg-[#263653] text-white font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span>{user.name}</span>
                <span className="rounded bg-[#DCE5DC] px-1.5 py-0.5 text-[10px] text-[#263653]">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-[#777777] hover:border-rose-300 hover:text-rose-600 transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-xs font-semibold text-[#263653] hover:bg-[#F5F2EA] transition"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#E69A68] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#D4834F] transition"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-[#263653] hover:bg-[#F5F2EA]"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-5 py-4 space-y-3">
          <Link
            href="/spaces"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#263653]"
          >
            Explore Spaces
          </Link>

          {user && user.role === "STUDENT" && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#263653]"
              >
                Dashboard
              </Link>
              <Link
                href="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#263653]"
              >
                My Bookings
              </Link>
            </>
          )}

          {user && user.role === "ADMIN" && (
            <>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#263653]"
              >
                Admin Overview
              </Link>
              <Link
                href="/admin/spaces"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#263653]"
              >
                Spaces Management
              </Link>
              <Link
                href="/admin/seats"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#263653]"
              >
                Seat Management
              </Link>
              <Link
                href="/admin/occupancy"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#263653]"
              >
                Occupancy
              </Link>
              <Link
                href="/admin/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-[#263653]"
              >
                Reports
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-[#263653]"
                >
                  {user.name} ({user.role})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-xs font-semibold text-[#263653]"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-xl bg-[#E69A68] py-2.5 text-center text-xs font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
