import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Link from "next/link";

export const metadata = {
  title: "User Profile | StudySpace",
  description: "View user account information and university affiliation.",
};

export default async function ProfilePage() {
  const session = getSessionUser();
  if (!session) {
    redirect("/login?redirect=/profile");
  }

  await connectDB();
  const user = await User.findById(session.userId).lean();
  if (!user) {
    redirect("/login");
  }

  const bookingCount = await Booking.countDocuments({ userId: user._id });

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12 space-y-8">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#E69A68]">
          Account Affiliation
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-[#263653] sm:text-3xl">
          Profile & Campus Account
        </h1>
      </div>

      <div className="rounded-3xl border border-[#263653]/10 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#263653] text-2xl font-bold text-white shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#263653]">{user.name}</h2>
            <p className="text-xs text-[#777777]">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full bg-[#DCE5DC] px-2.5 py-0.5 text-xs font-bold text-[#263653]">
                Role: {user.role}
              </span>
              <span className="text-xs text-[#777777]">
                Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-xl bg-[#F5F2EA] p-4">
            <span className="text-[#777777] text-[10px] uppercase font-bold">Total Reservations</span>
            <div className="mt-1 text-2xl font-extrabold text-[#263653]">{bookingCount}</div>
            <p className="mt-0.5 text-[#777777]">All-time study bookings created</p>
          </div>

          <div className="rounded-xl bg-[#F5F2EA] p-4">
            <span className="text-[#777777] text-[10px] uppercase font-bold">Campus Access Level</span>
            <div className="mt-1 text-2xl font-extrabold text-[#E69A68]">
              {user.role === "ADMIN" ? "Full Administrator" : "Standard Student"}
            </div>
            <p className="mt-0.5 text-[#777777]">
              {user.role === "ADMIN"
                ? "Manage spaces, seats, and physical occupancy"
                : "Reserve desks and collaborate in group rooms"}
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-3">
          {user.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="rounded-xl bg-[#263653] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#E69A68] transition"
            >
              Open Admin Console
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="rounded-xl bg-[#263653] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#E69A68] transition"
            >
              Go to Student Dashboard
            </Link>
          )}

          <Link
            href="/spaces"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-[#263238] hover:border-[#263653] transition"
          >
            Explore Spaces
          </Link>
        </div>
      </div>
    </div>
  );
}
