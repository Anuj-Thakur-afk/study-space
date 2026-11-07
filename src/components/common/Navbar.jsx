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

  const isActive = (path) =>
    pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-40 border-b border-[#BDBDBD] bg-[#171717]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="grid h-9 w-9 place-items-center border border-[#F15A24] bg-[#F15A24] text-white font-black text-sm transition group-hover:bg-transparent group-hover:text-[#F15A24]">
            <span>SS</span>
          </div>
          <div>
            <span className="block text-sm font-bold tracking-widest text-white uppercase">
              StudySpace
            </span>
            <span className="block -mt-0.5 text-[9px] font-medium uppercase tracking-widest text-[#777777]">
              Campus Booking
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-0.5 text-xs font-semibold uppercase tracking-wider">
          <Link
            href="/spaces"
            className={`px-4 py-2.5 transition-all border-b-2 ${
              isActive("/spaces")
                ? "border-[#F15A24] text-[#F15A24]"
                : "border-transparent text-[#BDBDBD] hover:text-white hover:border-[#777777]"
            }`}
          >
            Explore
          </Link>

          {user && user.role === "STUDENT" && (
            <>
              <Link
                href="/dashboard"
                className={`px-4 py-2.5 transition-all border-b-2 ${
                  isActive("/dashboard")
                    ? "border-[#F15A24] text-[#F15A24]"
                    : "border-transparent text-[#BDBDBD] hover:text-white hover:border-[#777777]"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/bookings"
                className={`px-4 py-2.5 transition-all border-b-2 ${
                  isActive("/bookings")
                    ? "border-[#F15A24] text-[#F15A24]"
                    : "border-transparent text-[#BDBDBD] hover:text-white hover:border-[#777777]"
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
                className={`px-4 py-2.5 transition-all border-b-2 ${
                  pathname === "/admin"
                    ? "border-[#F15A24] text-[#F15A24]"
                    : "border-transparent text-[#BDBDBD] hover:text-white hover:border-[#777777]"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/spaces"
                className={`px-4 py-2.5 transition-all border-b-2 ${
                  isActive("/admin/spaces")
                    ? "border-[#F15A24] text-[#F15A24]"
                    : "border-transparent text-[#BDBDBD] hover:text-white hover:border-[#777777]"
                }`}
              >
                Spaces
              </Link>
              <Link
                href="/admin/seats"
                className={`px-4 py-2.5 transition-all border-b-2 ${
                  isActive("/admin/seats")
                    ? "border-[#F15A24] text-[#F15A24]"
                    : "border-transparent text-[#BDBDBD] hover:text-white hover:border-[#777777]"
                }`}
              >
                Seats
              </Link>
              <Link
                href="/admin/bookings"
                className={`px-4 py-2.5 transition-all border-b-2 ${
                  isActive("/admin/bookings")
                    ? "border-[#F15A24] text-[#F15A24]"
                    : "border-transparent text-[#BDBDBD] hover:text-white hover:border-[#777777]"
                }`}
              >
                Bookings
              </Link>
            </>
          )}
        </nav>

        {/* Auth / Account Actions */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-24 animate-pulse bg-[#2a2a2a]" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 border border-[#2a2a2a] hover:border-[#F15A24] px-3 py-1.5 transition group"
              >
                <div className="grid h-6 w-6 place-items-center bg-[#F15A24] text-white font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-[#BDBDBD] group-hover:text-white transition">
                  {user.name.split(" ")[0]}
                </span>
                <span className="border border-[#777777] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#777777]">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="border border-[#333] px-3.5 py-1.5 text-xs font-semibold text-[#777777] uppercase tracking-wider hover:border-[#C43C32] hover:text-[#C43C32] transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#BDBDBD] hover:text-white transition border border-transparent hover:border-[#777777]"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-[#F15A24] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-[#171717] transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden border border-[#333] p-2 text-white hover:border-[#F15A24] hover:text-[#F15A24] transition"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2a2a2a] bg-[#171717] px-5 py-4 space-y-1">
          <Link
            href="/spaces"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
              isActive("/spaces")
                ? "text-[#F15A24] border-l-2 border-[#F15A24] pl-3"
                : "text-[#BDBDBD] hover:text-white hover:border-l-2 hover:border-[#777777] hover:pl-3"
            }`}
          >
            Explore Spaces
          </Link>

          {user && user.role === "STUDENT" && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  isActive("/dashboard")
                    ? "text-[#F15A24] border-l-2 border-[#F15A24] pl-3"
                    : "text-[#BDBDBD] hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                  isActive("/bookings")
                    ? "text-[#F15A24] border-l-2 border-[#F15A24] pl-3"
                    : "text-[#BDBDBD] hover:text-white"
                }`}
              >
                My Bookings
              </Link>
            </>
          )}

          {user && user.role === "ADMIN" && (
            <>
              {[
                { href: "/admin", label: "Dashboard" },
                { href: "/admin/spaces", label: "Spaces" },
                { href: "/admin/seats", label: "Seats" },
                { href: "/admin/occupancy", label: "Occupancy" },
                { href: "/admin/bookings", label: "Bookings" },
                { href: "/admin/reports", label: "Reports" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#BDBDBD] hover:text-white transition"
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}

          <div className="pt-4 mt-2 border-t border-[#2a2a2a]">
            {user ? (
              <div className="flex items-center justify-between">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-white"
                >
                  {user.name}{" "}
                  <span className="text-[#777777]">({user.role})</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="border border-[#C43C32] px-3 py-1.5 text-xs font-bold text-[#C43C32] hover:bg-[#C43C32] hover:text-white transition uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 border border-[#BDBDBD] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-[#BDBDBD] hover:text-white hover:border-white transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 bg-[#F15A24] py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-[#171717] transition"
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
