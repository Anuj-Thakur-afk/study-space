import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Seat from "@/models/Seat";
import Booking from "@/models/Booking";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid study space ID" }, { status: 400 });
    }

    const seats = await Seat.find({ studySpaceId: id }).sort({ row: 1, col: 1, seatNumber: 1 }).lean();

    // If date and times are specified, determine slot-specific booked or occupied state
    let slotBookings = [];
    if (date && startTime && endTime) {
      slotBookings = await Booking.find({
        studySpaceId: id,
        bookingDate: date,
        status: { $in: ["Confirmed", "Occupied"] },
        // Check for time overlap
        $or: [
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ],
      }).lean();
    }

    const enrichedSeats = seats.map((seat) => {
      let liveStatus = seat.status;

      // If seat has a booking in this slot, update live status accordingly
      if (liveStatus !== "Unavailable") {
        const matchingBooking = slotBookings.find(
          (b) => b.seatId && b.seatId.toString() === seat._id.toString()
        );
        if (matchingBooking) {
          liveStatus = matchingBooking.status === "Occupied" ? "Occupied" : "Booked";
        }
      }

      return {
        ...seat,
        id: seat._id.toString(),
        _id: seat._id.toString(),
        status: liveStatus,
      };
    });

    return NextResponse.json({ seats: enrichedSeats });
  } catch (error) {
    console.error("Fetch seats error:", error);
    return NextResponse.json({ error: "Failed to fetch seats" }, { status: 500 });
  }
}
