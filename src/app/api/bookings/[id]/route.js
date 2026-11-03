import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Seat from "@/models/Seat";
import { getSessionUser } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await Booking.findById(id)
      .populate("studySpaceId")
      .populate("seatId")
      .populate("userId", "name email role")
      .lean();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Authorization check
    if (session.role !== "ADMIN" && booking.userId._id.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized access to this booking" }, { status: 403 });
    }

    return NextResponse.json({
      booking: {
        ...booking,
        id: booking._id.toString(),
        _id: booking._id.toString(),
      },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json({ error: "Failed to fetch booking details" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only owner student or admin can cancel
    if (session.role !== "ADMIN" && booking.userId.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized: You cannot modify this booking" }, { status: 403 });
    }

    if (booking.status === "Cancelled") {
      return NextResponse.json({ error: "Booking is already cancelled" }, { status: 400 });
    }

    booking.status = "Cancelled";
    await booking.save();

    // If seat was booked and is not marked unavailable, reset to Available
    if (booking.seatId) {
      const seat = await Seat.findById(booking.seatId);
      if (seat && seat.status === "Booked") {
        seat.status = "Available";
        await seat.save();
      }
    }

    return NextResponse.json({
      message: "Booking cancelled successfully",
      booking: { ...booking.toObject(), id: booking._id.toString() },
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  // Map DELETE to same cancel logic
  return PATCH(request, { params });
}
