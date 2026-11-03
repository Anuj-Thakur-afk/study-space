import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    studySpaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudySpace",
      required: [true, "Study space ID is required"],
      index: true,
    },
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
      default: null,
    },
    bookingDate: {
      type: String, // YYYY-MM-DD
      required: [true, "Booking date is required"],
    },
    startTime: {
      type: String, // HH:MM
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String, // HH:MM
      required: [true, "End time is required"],
    },
    bookingType: {
      type: String,
      enum: ["SEAT", "ROOM"],
      default: "SEAT",
    },
    status: {
      type: String,
      enum: ["Confirmed", "Occupied", "Completed", "Cancelled"],
      default: "Confirmed",
    },
    purpose: {
      type: String,
      default: "Study session",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// Indexes to speed up conflict checking and queries
BookingSchema.index({ seatId: 1, bookingDate: 1, status: 1 });
BookingSchema.index({ studySpaceId: 1, bookingDate: 1, status: 1 });
BookingSchema.index({ userId: 1, bookingDate: 1 });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
