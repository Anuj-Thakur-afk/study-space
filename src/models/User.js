import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      // Not required — Google OAuth users won't have a password
      default: null,
    },
    googleId: {
      // Google `sub` claim — unique identifier for Google accounts
      type: String,
      default: null,
      sparse: true, // Allow multiple null values in the unique index
    },
    role: {
      type: String,
      enum: ["STUDENT", "ADMIN"],
      default: "STUDENT",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
