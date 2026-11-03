"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#E69A68] text-xl font-bold text-white shadow-md">
            S
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#263653]">
            Create Student Account
          </h1>
          <p className="mt-1 text-xs text-[#777777]">
            Register to reserve desks, lock group rooms, and track campus study hours.
          </p>
        </div>

        <div className="rounded-2xl border border-[#263653]/10 bg-white p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Lee"
                className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2.5 text-xs text-[#263238] outline-none focus:border-[#263653]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
                University Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@studyspace.edu"
                className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2.5 text-xs text-[#263238] outline-none focus:border-[#263653]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
                Password (min 6 characters)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2.5 text-xs text-[#263238] outline-none focus:border-[#263653]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2.5 text-xs text-[#263238] outline-none focus:border-[#263653]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E69A68] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#D4834F] transition disabled:opacity-60"
            >
              {loading ? <LoadingSpinner size="sm" text="" /> : "Complete Student Registration"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-[#777777]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#263653] hover:underline">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
