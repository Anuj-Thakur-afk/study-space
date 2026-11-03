import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Seat from "@/models/Seat";
import Booking from "@/models/Booking";
import { getSessionUser } from "@/lib/auth";
import { occupancyUpdateSchema } from "@/lib/validation";

export async function POST(request) {
  try {
    const session = getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access: Admin required" }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();

    const validation = occupancyUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { seatId, bookingId, status } = validation.data;

    let updatedSeat = null;
    let updatedBooking = null;

    if (seatId) {
      updatedSeat = await Seat.findByIdAndUpdate(
        seatId,
        { status },
        { new: true }
      );
    }

    if (bookingId) {
      // Map seat status to valid booking status if necessary
      let bookingStatus = status;
      if (status === "Available") bookingStatus = "Completed";
      if (status === "Unavailable") bookingStatus = "Cancelled";
      if (status === "Booked") bookingStatus = "Confirmed";

      updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: bookingStatus },
        { new: true }
      );

      // If booking is attached to a seat, sync seat status
      if (updatedBooking && updatedBooking.seatId) {
        await Seat.findByIdAndUpdate(updatedBooking.seatId, { status });
      }
    }

    return NextResponse.json({
      message: "Physical occupancy state updated successfully",
      seat: updatedSeat ? { ...updatedSeat.toObject(), id: updatedSeat._id.toString() } : null,
      booking: updatedBooking ? { ...updatedBooking.toObject(), id: updatedBooking._id.toString() } : null,
    });
  } catch (error) {
    console.error("Occupancy update error:", error);
    return NextResponse.json({ error: "Failed to update occupancy" }, { status: 500 });
  }
}
