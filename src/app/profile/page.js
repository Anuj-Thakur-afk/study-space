import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profile | StudySpace",
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
      <div className="border-b border-[#BDBDBD] pb-6">
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#F15A24]">
          Account Affiliation
        </span>
        <h1 className="mt-1 text-4xl font-black uppercase tracking-tight text-[#171717] sm:text-5xl">
          Profile
        </h1>
      </div>

      <div className="border border-[#BDBDBD] bg-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-[#BDBDBD] pb-6">
          <div className="grid h-16 w-16 place-items-center bg-[#171717] text-2xl font-black text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-black text-[#171717] uppercase tracking-tight">{user.name}</h2>
            <p className="text-xs text-[#777777] font-medium">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="border border-[#F15A24] bg-[#FFE1D5] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#F15A24]">
                {user.role}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#777777]">
                Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="border border-[#BDBDBD] bg-[#F4F3ED] p-4">
            <span className="text-[#777777] text-[9px] uppercase font-bold tracking-wider">Total Reservations</span>
            <div className="mt-1 text-3xl font-black text-[#171717]">{bookingCount}</div>
            <p className="mt-1 text-[10px] text-[#777777]">All-time campus bookings</p>
          </div>

          <div className="border border-[#BDBDBD] bg-[#F4F3ED] p-4">
            <span className="text-[#777777] text-[9px] uppercase font-bold tracking-wider">Access Clearance</span>
            <div className="mt-1 text-3xl font-black text-[#F15A24]">
              {user.role === "ADMIN" ? "Admin" : "Student"}
            </div>
            <p className="mt-1 text-[10px] text-[#777777]">
              {user.role === "ADMIN"
                ? "Full management clearance"
                : "Desk & group room access"}
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-3">
          {user.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="border border-[#171717] bg-[#171717] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#F15A24] hover:border-[#F15A24] transition"
            >
              Open Admin Console
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="border border-[#171717] bg-[#171717] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#F15A24] hover:border-[#F15A24] transition"
            >
              Go to Dashboard
            </Link>
          )}

          <Link
            href="/spaces"
            className="border border-[#BDBDBD] bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#171717] hover:border-[#171717] transition"
          >
            Explore Spaces
          </Link>
        </div>
      </div>
    </div>
  );
}
