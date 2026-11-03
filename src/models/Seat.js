import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: [true, "Seat number is required"],
      trim: true,
    },
    studySpaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudySpace",
      required: [true, "Study space ID is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["Available", "Booked", "Occupied", "Unavailable"],
      default: "Available",
    },
    features: {
      type: [String],
      default: [],
    },
    row: {
      type: Number,
      default: 1,
    },
    col: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

SeatSchema.index({ studySpaceId: 1, seatNumber: 1 }, { unique: true });

export default mongoose.models.Seat || mongoose.model("Seat", SeatSchema);
