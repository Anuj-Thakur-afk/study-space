import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
  email: z.string().email("Invalid university email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const spaceSchema = z.object({
  name: z.string().min(3, "Space name must be at least 3 characters"),
  buildingName: z.string().min(2, "Building name is required"),
  floor: z.string().min(1, "Floor is required"),
  zone: z.string().min(1, "Zone/Wing is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  studyType: z.enum(["Silent Study", "Individual Study", "Group Study", "Discussion Room"]),
  totalSeats: z.coerce.number().int().min(1, "Must have at least 1 seat"),
  facilities: z.array(z.string()).default([]),
  usageRules: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export const bookingSchema = z.object({
  studySpaceId: z.string().min(1, "Study space is required"),
  seatId: z.string().optional().nullable(),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time format (HH:MM)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time format (HH:MM)"),
  bookingType: z.enum(["SEAT", "ROOM"]).default("SEAT"),
  purpose: z.string().max(100).optional().default("Study session"),
});

export const seatStatusSchema = z.object({
  status: z.enum(["Available", "Booked", "Occupied", "Unavailable"]),
});

export const occupancyUpdateSchema = z.object({
  bookingId: z.string().optional(),
  seatId: z.string().optional(),
  status: z.enum(["Available", "Booked", "Occupied", "Unavailable"]),
});
