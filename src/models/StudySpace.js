import mongoose from "mongoose";

const StudySpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Space name is required"],
      trim: true,
    },
    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: false,
    },
    buildingName: {
      type: String,
      required: [true, "Building name is required"],
      trim: true,
    },
    floor: {
      type: String,
      required: [true, "Floor is required"],
      trim: true,
    },
    zone: {
      type: String,
      required: [true, "Zone/Location is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    studyType: {
      type: String,
      enum: ["Silent Study", "Individual Study", "Group Study", "Discussion Room"],
      required: true,
    },
    totalSeats: {
      type: Number,
      required: [true, "Total seats is required"],
      min: 1,
    },
    facilities: {
      type: [String],
      default: [],
    },
    usageRules: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

StudySpaceSchema.index({ buildingName: 1, studyType: 1, isActive: 1 });

export default mongoose.models.StudySpace || mongoose.model("StudySpace", StudySpaceSchema);
