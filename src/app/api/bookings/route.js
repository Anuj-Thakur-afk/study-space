import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import StudySpace from "@/models/StudySpace";
import Seat from "@/models/Seat";
import User from "@/models/User";
import { getSessionUser } from "@/lib/auth";
import { bookingSchema } from "@/lib/validation";

export async function GET(request) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get("spaceId");
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query = {};

    if (session.role === "ADMIN") {
      if (spaceId && mongoose.Types.ObjectId.isValid(spaceId)) {
        query.studySpaceId = spaceId;
      }
      if (date) {
        query.bookingDate = date;
      }
      if (status && status !== "ALL") {
        query.status = status;
      }
    } else {
      // Students can strictly view their own bookings
      query.userId = session.userId;
      if (status && status !== "ALL") {
        query.status = status;
      }
    }

    let bookings = await Booking.find(query)
      .populate("studySpaceId", "name buildingName floor zone studyType")
      .populate("seatId", "seatNumber features")
      .populate("userId", "name email")
      .sort({ bookingDate: -1, startTime: -1 })
      .lean();

    // If admin provided a search query for student name or email
    if (session.role === "ADMIN" && search && search.trim()) {
      const q = search.trim().toLowerCase();
      bookings = bookings.filter((b) => {
        const studentName = b.userId?.name?.toLowerCase() || "";
        const studentEmail = b.userId?.email?.toLowerCase() || "";
        const spaceName = b.studySpaceId?.name?.toLowerCase() || "";
        return studentName.includes(q) || studentEmail.includes(q) || spaceName.includes(q);
      });
    }

    const formatted = bookings.map((b) => ({
      ...b,
      id: b._id.toString(),
      _id: b._id.toString(),
    }));

    return NextResponse.json({ bookings: formatted });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Authentication required to book a space" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const validation = bookingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { studySpaceId, seatId, bookingDate, startTime, endTime, bookingType, purpose } = validation.data;

    // 1. Validate times
    if (startTime >= endTime) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    // 2. Validate booking date not in past
    const todayStr = new Date().toISOString().split("T")[0];
    if (bookingDate < todayStr) {
      return NextResponse.json({ error: "Cannot book spaces for past dates" }, { status: 400 });
    }

    // 3. Verify study space exists and is active
    const space = await StudySpace.findById(studySpaceId);
    if (!space || !space.isActive) {
      return NextResponse.json({ error: "Selected study space is not available" }, { status: 400 });
    }

    // 4. If SEAT booking, verify seat exists and belongs to space
    let seatDoc = null;
    if (bookingType === "SEAT") {
      if (!seatId) {
        return NextResponse.json({ error: "Please select a seat" }, { status: 400 });
      }
      seatDoc = await Seat.findOne({ _id: seatId, studySpaceId });
      if (!seatDoc) {
        return NextResponse.json({ error: "Selected seat does not exist in this space" }, { status: 400 });
      }
      if (seatDoc.status === "Unavailable") {
        return NextResponse.json({ error: "This seat is currently marked unavailable" }, { status: 400 });
      }
    }

    // 5. Check for conflicts (Overlapping bookings)
    // Overlap condition: (StartA < EndB) and (EndA > StartB)
    const conflictQuery = {
      bookingDate,
      status: { $in: ["Confirmed", "Occupied"] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    };

    if (bookingType === "SEAT") {
      conflictQuery.seatId = seatId;
    } else {
      // Room-level booking conflict
      conflictQuery.studySpaceId = studySpaceId;
    }

    const existingConflict = await Booking.findOne(conflictQuery);
    if (existingConflict) {
      return NextResponse.json(
        {
          error:
            bookingType === "SEAT"
              ? "This seat is already reserved for the selected time window. Please choose another seat or time."
              : "This room is already reserved for the selected time window. Please pick a different slot.",
        },
        { status: 409 }
      );
    }

    // 6. Check if user already booked another seat/room at the exact same time
    const userConflict = await Booking.findOne({
      userId: session.userId,
      bookingDate,
      status: { $in: ["Confirmed", "Occupied"] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });
    if (userConflict) {
      return NextResponse.json(
        { error: "You already have another active reservation overlapping this time window." },
        { status: 409 }
      );
    }

    // 7. Create booking record
    const newBooking = await Booking.create({
      userId: session.userId,
      studySpaceId,
      seatId: bookingType === "SEAT" ? seatId : null,
      bookingDate,
      startTime,
      endTime,
      bookingType,
      status: "Confirmed",
      purpose: purpose || "Independent academic study",
    });

    return NextResponse.json(
      {
        message: "Reservation confirmed successfully!",
        booking: {
          ...newBooking.toObject(),
          id: newBooking._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 });
  }
}
