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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleSignUp = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const res = await fetch("/api/auth/google/initiate");
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Google sign-up unavailable");
      }
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err.message || "Could not initiate Google sign-up");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-[#F4F3ED] px-6 py-12 sm:px-10">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo + Heading */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="grid h-8 w-8 place-items-center bg-[#F15A24] text-white font-black text-xs">
              SS
            </div>
            <span className="text-sm font-bold tracking-widest text-[#171717] uppercase">
              StudySpace
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#171717] uppercase leading-none">
            Create<br />Account.
          </h1>
          <p className="mt-2 text-xs text-[#777777]">
            Register to reserve desks, group rooms, and track study hours.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="border border-[#C43C32] bg-[#FAEAE9] p-3 text-xs text-[#C43C32]">
            {error}
          </div>
        )}

        {/* Google Sign-Up */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="flex w-full items-center justify-center gap-3 border border-[#BDBDBD] bg-white px-4 py-3 text-xs font-semibold text-[#171717] transition hover:border-[#171717] hover:bg-[#F4F3ED] disabled:opacity-60"
        >
          {googleLoading ? (
            <LoadingSpinner size="sm" text="" />
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#BDBDBD]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#F4F3ED] px-3 text-[10px] font-bold uppercase tracking-widest text-[#777777]">
              Or Register With Email
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Lee"
              className="w-full border border-[#BDBDBD] bg-white px-3.5 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717] transition placeholder:text-[#BDBDBD]"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@studyspace.edu"
              className="w-full border border-[#BDBDBD] bg-white px-3.5 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717] transition placeholder:text-[#BDBDBD]"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-1.5">
              Password <span className="text-[#777777] normal-case tracking-normal font-normal">(min. 6 characters)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#BDBDBD] bg-white px-3.5 py-2.5 pr-10 text-xs text-[#171717] outline-none focus:border-[#171717] transition placeholder:text-[#BDBDBD]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#171717] transition"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-1.5">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-[#BDBDBD] bg-white px-3.5 py-2.5 text-xs text-[#171717] outline-none focus:border-[#171717] transition placeholder:text-[#BDBDBD]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 bg-[#F15A24] py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#171717] disabled:opacity-60"
          >
            {loading ? <LoadingSpinner size="sm" text="" /> : "Create Student Account"}
          </button>
        </form>

        <p className="text-center text-xs text-[#777777]">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#171717] hover:text-[#F15A24] transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
