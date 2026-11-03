import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g. "CREATE_SPACE", "UPDATE_SPACE", "DELETE_SPACE", "UPDATE_SEAT", "CANCEL_BOOKING"
    },
    targetType: {
      type: String,
      required: true, // "StudySpace", "Seat", "Booking", "Occupancy"
    },
    targetId: {
      type: String,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
