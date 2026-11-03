import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import mongoose from "mongoose";
import { getSessionUser } from "@/lib/auth";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import StatusBadge from "@/components/common/StatusBadge";

export async function generateMetadata({ params }) {
  return { title: `Digital Study Pass #${params.id.slice(-6)} | StudySpace` };
}

export default async function BookingDetailsPage({ params }) {
  const session = getSessionUser();
  if (!session) {
    redirect(`/login?redirect=/bookings/${params.id}`);
  }

  await connectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  const booking = await Booking.findById(id)
    .populate("studySpaceId")
    .populate("seatId")
    .populate("userId", "name email")
    .lean();

  if (!booking) {
    notFound();
  }

  // Authorization: must be owner student or admin
  if (session.role !== "ADMIN" && booking.userId._id.toString() !== session.userId) {
    redirect("/dashboard");
  }

  const space = booking.studySpaceId || {};
  const seat = booking.seatId;

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 sm:px-8 sm:py-12 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/bookings"
          className="text-xs font-bold text-[#263653] hover:text-[#E69A68] transition"
        >
          ← Back to My Bookings
        </Link>
        <StatusBadge status={booking.status} />
      </div>

      {/* Digital Pass Card */}
      <div className="overflow-hidden rounded-3xl border border-[#263653]/15 bg-white shadow-lg">
        {/* Pass Header */}
        <div className="bg-[#263653] p-6 text-white sm:p-8">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#E69A68]">
              Campus Study Pass
            </span>
            <span className="font-mono text-xs text-slate-300">#{booking._id.toString().slice(-8).toUpperCase()}</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {space.name}
          </h1>
          <p className="mt-1 text-xs text-slate-300">
            {space.buildingName} · {space.floor} · {space.zone}
          </p>
        </div>

        {/* Perforated Divider */}
        <div className="relative border-b-2 border-dashed border-slate-200 bg-[#F5F2EA] px-6 py-2">
          <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#F5F2EA]" />
          <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#F5F2EA]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] text-center block">
            Official Academic Reservation Record
          </span>
        </div>

        {/* Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
            <div className="rounded-xl bg-[#F5F2EA] p-3">
              <span className="block text-[#777777] text-[10px] uppercase font-bold">Attendee</span>
              <span className="mt-1 block font-bold text-[#263653]">{booking.userId?.name}</span>
            </div>
            <div className="rounded-xl bg-[#F5F2EA] p-3">
              <span className="block text-[#777777] text-[10px] uppercase font-bold">Reservation Date</span>
              <span className="mt-1 block font-bold text-[#263653]">{booking.bookingDate}</span>
            </div>
            <div className="rounded-xl bg-[#F5F2EA] p-3">
              <span className="block text-[#777777] text-[10px] uppercase font-bold">Time Window</span>
              <span className="mt-1 block font-bold text-[#263653]">
                {booking.startTime} – {booking.endTime}
              </span>
            </div>
            <div className="rounded-xl bg-[#DCE5DC] p-3">
              <span className="block text-[#263653] text-[10px] uppercase font-bold">Allocated Unit</span>
              <span className="mt-1 block text-base font-extrabold text-[#263653]">
                {booking.bookingType === "ROOM" ? "Full Group Room" : seat?.seatNumber || "Assigned Desk"}
              </span>
            </div>
            <div className="rounded-xl bg-[#F5F2EA] p-3 sm:col-span-2">
              <span className="block text-[#777777] text-[10px] uppercase font-bold">Academic Purpose</span>
              <span className="mt-1 block font-medium text-[#263238]">{booking.purpose || "Study session"}</span>
            </div>
          </div>

          {/* QR Code Placeholder Graphic */}
          <div className="rounded-2xl border border-slate-100 bg-[#F5F2EA] p-4 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-xl bg-white p-2 shadow-inner font-mono text-[9px] text-[#263653] border border-slate-200">
              [QR VERIFY]
              <br />
              {booking._id.toString().slice(0, 10)}
            </div>
            <p className="mt-2 text-[11px] font-semibold text-[#263653]">
              Show this pass at the desk or room scanner for physical check-in.
            </p>
          </div>

          {/* Rules */}
          {space.usageRules?.length > 0 && (
            <div className="rounded-xl border border-slate-100 bg-white p-4 text-xs">
              <h4 className="font-bold text-[#263653] mb-2">Space Guidelines</h4>
              <ul className="space-y-1 text-[#777777]">
                {space.usageRules.map((rule) => (
                  <li key={rule} className="flex items-center gap-1.5">
                    <span>•</span> {rule}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
