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
      <div className="flex items-center justify-between border-b border-[#BDBDBD] pb-4">
        <Link
          href="/bookings"
          className="text-xs font-bold uppercase tracking-wider text-[#777777] hover:text-[#F15A24] transition"
        >
          ← Back to My Bookings
        </Link>
        <StatusBadge status={booking.status} />
      </div>

      {/* Digital Pass Card */}
      <div className="border-2 border-[#171717] bg-white">
        {/* Pass Header */}
        <div className="bg-[#171717] p-6 text-white sm:p-8 border-b-2 border-[#171717]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#F15A24]">
              Campus Study Pass
            </span>
            <span className="font-mono text-xs text-[#BDBDBD]">
              #{booking._id.toString().slice(-8).toUpperCase()}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            {space.name}
          </h1>
          <p className="mt-1 text-xs text-[#BDBDBD]">
            {space.buildingName} · {space.floor} · {space.zone}
          </p>
        </div>

        {/* Perforated Divider */}
        <div className="border-b border-dashed border-[#BDBDBD] bg-[#F4F3ED] px-6 py-2.5">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#777777] text-center block">
            Official Academic Reservation Record
          </span>
        </div>

        {/* Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
            <div className="border border-[#BDBDBD] bg-[#F4F3ED] p-3">
              <span className="block text-[#777777] text-[9px] uppercase font-bold tracking-wider">Attendee</span>
              <span className="mt-1 block font-bold text-[#171717]">{booking.userId?.name}</span>
            </div>
            <div className="border border-[#BDBDBD] bg-[#F4F3ED] p-3">
              <span className="block text-[#777777] text-[9px] uppercase font-bold tracking-wider">Date</span>
              <span className="mt-1 block font-bold text-[#171717]">{booking.bookingDate}</span>
            </div>
            <div className="border border-[#BDBDBD] bg-[#F4F3ED] p-3">
              <span className="block text-[#777777] text-[9px] uppercase font-bold tracking-wider">Time Window</span>
              <span className="mt-1 block font-bold text-[#171717]">
                {booking.startTime} – {booking.endTime}
              </span>
            </div>
            <div className="border border-[#F15A24] bg-[#FFE1D5] p-3">
              <span className="block text-[#F15A24] text-[9px] uppercase font-bold tracking-wider">Allocated Unit</span>
              <span className="mt-1 block text-sm font-black text-[#171717]">
                {booking.bookingType === "ROOM" ? "Full Group Room" : seat?.seatNumber || "Assigned Desk"}
              </span>
            </div>
            <div className="border border-[#BDBDBD] bg-[#F4F3ED] p-3 sm:col-span-2">
              <span className="block text-[#777777] text-[9px] uppercase font-bold tracking-wider">Academic Purpose</span>
              <span className="mt-1 block font-semibold text-[#171717]">{booking.purpose || "Study session"}</span>
            </div>
          </div>

          {/* QR Code / Digital Verification Block */}
          <div className="border border-[#BDBDBD] bg-[#F4F3ED] p-5 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center bg-white p-2 border border-[#171717] font-mono text-[9px] text-[#171717] font-bold">
              [PASS CODE]
              <br />
              {booking._id.toString().slice(0, 8).toUpperCase()}
            </div>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#171717]">
              Show this pass at reception or door scanner for check-in.
            </p>
          </div>

          {/* Space Guidelines */}
          {space.usageRules?.length > 0 && (
            <div className="border border-[#BDBDBD] p-4 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-[#171717] text-[10px] mb-2">Space Guidelines</h4>
              <ul className="space-y-1.5 text-[#777777]">
                {space.usageRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2">
                    <span className="text-[#F15A24] font-bold">•</span>
                    <span>{rule}</span>
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
