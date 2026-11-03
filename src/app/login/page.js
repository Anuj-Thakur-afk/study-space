"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams ? searchParams.get("redirect") || "" : "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (redirectPath) {
        router.push(redirectPath);
      } else if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === "admin") {
      setEmail("admin@studyspace.edu");
      setPassword("Admin@123");
    } else {
      setEmail("student@studyspace.edu");
      setPassword("Student@123");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#263653] text-xl font-bold text-[#F5F2EA] shadow-md">
          S
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#263653]">
          Sign in to StudySpace
        </h1>
        <p className="mt-1 text-xs text-[#777777]">
          Access student study reservations or campus administration console.
        </p>
      </div>

      {/* Demo Fast Buttons */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm text-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block mb-2">
          One-Click Evaluator Demo Logins
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fillDemo("student")}
            className="flex-1 rounded-xl bg-[#F5F2EA] py-2 text-xs font-bold text-[#263653] hover:bg-[#DCE5DC] transition"
          >
            🎓 Student Demo
          </button>
          <button
            type="button"
            onClick={() => fillDemo("admin")}
            className="flex-1 rounded-xl bg-[#263653] py-2 text-xs font-bold text-white hover:bg-[#E69A68] transition"
          >
            🛡️ Admin Demo
          </button>
        </div>
      </div>

      {/* Login Card */}
      <div className="rounded-2xl border border-[#263653]/10 bg-white p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
              University Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@studyspace.edu"
              className="w-full rounded-xl border border-slate-200 bg-[#F5F2EA]/40 px-3.5 py-2.5 text-xs text-[#263238] outline-none focus:border-[#263653]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777777] mb-1">
              Password
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

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#263653] py-3 text-xs font-bold text-white shadow-sm hover:bg-[#E69A68] transition disabled:opacity-60"
          >
            {loading ? <LoadingSpinner size="sm" text="" /> : "Sign In to Workspace"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-[#777777]">
          New student on campus?{" "}
          <Link href="/register" className="font-bold text-[#E69A68] hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6">
      <Suspense fallback={<LoadingSpinner text="Loading authentication..." />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
