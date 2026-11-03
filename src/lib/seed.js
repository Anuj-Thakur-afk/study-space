import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./db.js";
import User from "../models/User.js";
import Building from "../models/Building.js";
import StudySpace from "../models/StudySpace.js";
import Seat from "../models/Seat.js";
import Booking from "../models/Booking.js";

async function seedDatabase() {
  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("Connected successfully.");

  // Clear existing collections
  console.log("Resetting collections...");
  await User.deleteMany({});
  await Building.deleteMany({});
  await StudySpace.deleteMany({});
  await Seat.deleteMany({});
  await Booking.deleteMany({});

  // 1. Seed Users
  console.log("Seeding users...");
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  const studentPasswordHash = await bcrypt.hash("Student@123", 10);

  const adminUser = await User.create({
    name: "Campus Administrator",
    email: "admin@studyspace.edu",
    passwordHash: adminPasswordHash,
    role: "ADMIN",
  });

  const studentUser = await User.create({
    name: "Alex Morgan",
    email: "student@studyspace.edu",
    passwordHash: studentPasswordHash,
    role: "STUDENT",
  });

  const student2 = await User.create({
    name: "Priya Sharma",
    email: "priya@studyspace.edu",
    passwordHash: studentPasswordHash,
    role: "STUDENT",
  });

  console.log("Users created.");

  // 2. Seed Buildings
  console.log("Seeding buildings...");
  const library = await Building.create({
    name: "Central Library",
    location: "North Campus Quad",
    description: "Main university repository for academic research, archival volumes, and multi-tier silent study halls.",
  });

  const learningCentre = await Building.create({
    name: "Learning Centre",
    location: "East Campus Promenade",
    description: "Modern facility offering open reading lounges, digital workspaces, and quiet pods.",
  });

  const innovationHub = await Building.create({
    name: "Innovation Hub",
    location: "Science & Technology Complex",
    description: "Collaborative design center with group meeting rooms, smartboards, and fabrication suites.",
  });

  const academicBlock = await Building.create({
    name: "Academic Block",
    location: "South Campus Gate 2",
    description: "Core lecture complex hosting faculty rooms, seminar spaces, and department discussion chambers.",
  });

  // 3. Seed Study Spaces
  console.log("Seeding study spaces...");
  const spacesData = [
    {
      name: "Central Library – Silent Zone",
      buildingId: library._id,
      buildingName: library.name,
      floor: "2nd Floor",
      zone: "North Wing",
      studyType: "Silent Study",
      totalSeats: 32,
      facilities: ["High-speed Wi-Fi", "Charging sockets", "Air conditioning", "Individual carrels", "Silent acoustic panels"],
      usageRules: ["Strict silence required", "Keep phones in silent mode", "No food permitted", "Laptops on silent keys only"],
      description: "A premier quiet sanctuary designed for deep concentration, exam preparation, and focused reading.",
      isActive: true,
    },
    {
      name: "Learning Centre – Reading Lounge",
      buildingId: learningCentre._id,
      buildingName: learningCentre.name,
      floor: "1st Floor",
      zone: "East Wing",
      studyType: "Individual Study",
      totalSeats: 24,
      facilities: ["Wi-Fi", "Comfortable ergonomic armchairs", "Natural daylight", "Book stands", "Charging stations"],
      usageRules: ["Headphones compulsory for audio", "Keep the area tidy", "No reserving unoccupied seats for friends"],
      description: "A calm, comfortable individual-study space with panoramic windows and relaxed seating.",
      isActive: true,
    },
    {
      name: "Innovation Hub – Group Room A",
      buildingId: innovationHub._id,
      buildingName: innovationHub.name,
      floor: "Ground Floor",
      zone: "Room G-04",
      studyType: "Group Study",
      totalSeats: 8,
      facilities: ["4K Display monitor", "Glass whiteboard", "High-speed Wi-Fi", "Power ports", "HDMI/Type-C cables"],
      usageRules: ["Keep discussions at moderate volume", "Leave room spotless after use", "Academic group projects given priority"],
      description: "Collaborative room engineered for capstone teams, peer study sessions, and design sprints.",
      isActive: true,
    },
    {
      name: "Academic Block – Discussion Room 312",
      buildingId: academicBlock._id,
      buildingName: academicBlock.name,
      floor: "3rd Floor",
      zone: "Room 312",
      studyType: "Discussion Room",
      totalSeats: 6,
      facilities: ["Magnetic whiteboard", "Wi-Fi", "Circular conference desk", "Ergonomic chairs"],
      usageRules: ["Reserved for academic discussions", "Do not disturb neighboring lecture halls", "Reset tables before leaving"],
      description: "Compact discussion suite ideal for small study circles, thesis defense practice, and tutorial reviews.",
      isActive: true,
    },
    {
      name: "Central Library – Individual Desks",
      buildingId: library._id,
      buildingName: library.name,
      floor: "1st Floor",
      zone: "South Wing",
      studyType: "Individual Study",
      totalSeats: 20,
      facilities: ["Wi-Fi", "Dedicated task lamp", "Universal charging socket", "Under-desk backpack hook"],
      usageRules: ["One student per desk", "Keep aisles clear", "Beverages in spill-proof cups only"],
      description: "Dedicated study desks with task lighting and partitions for independent coursework.",
      isActive: true,
    },
    {
      name: "Student Centre – Collaboration Pod",
      buildingId: innovationHub._id,
      buildingName: "Student Centre",
      floor: "2nd Floor",
      zone: "West Wing Pod 2",
      studyType: "Group Study",
      totalSeats: 12,
      facilities: ["High-speed Wi-Fi", "Modular tables", "Dual whiteboards", "Power strips"],
      usageRules: ["Clean whiteboard markers after use", "Do not relocate furniture outside pod", "Max booking 2 hours during exams"],
      description: "An open modular workspace crafted for active peer-learning and team brainstorming.",
      isActive: true,
    },
  ];

  const createdSpaces = await StudySpace.insertMany(spacesData);
  console.log(`Created ${createdSpaces.length} study spaces.`);

  // 4. Seed Seats for each space
  console.log("Seeding seats...");
  const seatsToInsert = [];
  const todayStr = new Date().toISOString().split("T")[0];

  for (const space of createdSpaces) {
    const cols = space.totalSeats <= 8 ? 4 : space.totalSeats <= 16 ? 4 : 6;
    for (let i = 1; i <= space.totalSeats; i++) {
      const seatNum = `${space.name.slice(0, 2).toUpperCase()}-${String(i).padStart(2, "0")}`;
      const row = Math.ceil(i / cols);
      const col = ((i - 1) % cols) + 1;
      
      const features = [];
      if (i % 2 === 1) features.push("Power Socket");
      if (i % 3 === 0) features.push("Window View");
      if (i % 4 === 0) features.push("Desk Lamp");
      if (features.length === 0) features.push("Standard Desk");

      // Give a few seats realistic pre-allocated statuses
      let initialStatus = "Available";
      if (space.studyType !== "Discussion Room") {
        if (i === 1) initialStatus = "Booked";
        else if (i === 2) initialStatus = "Occupied";
        else if (i === space.totalSeats) initialStatus = "Unavailable";
      }

      seatsToInsert.push({
        seatNumber: seatNum,
        studySpaceId: space._id,
        status: initialStatus,
        features,
        row,
        col,
      });
    }
  }

  const createdSeats = await Seat.insertMany(seatsToInsert);
  console.log(`Created ${createdSeats.length} individual seats.`);

  // 5. Seed Initial Bookings
  console.log("Seeding initial bookings...");
  const silentSpace = createdSpaces[0];
  const silentSeat1 = createdSeats.find((s) => s.studySpaceId.equals(silentSpace._id) && s.seatNumber.endsWith("01"));
  const silentSeat2 = createdSeats.find((s) => s.studySpaceId.equals(silentSpace._id) && s.seatNumber.endsWith("02"));

  const bookingsToInsert = [
    {
      userId: studentUser._id,
      studySpaceId: silentSpace._id,
      seatId: silentSeat1 ? silentSeat1._id : null,
      bookingDate: todayStr,
      startTime: "10:00",
      endTime: "12:00",
      bookingType: "SEAT",
      status: "Confirmed",
      purpose: "Operating Systems exam prep",
    },
    {
      userId: student2._id,
      studySpaceId: silentSpace._id,
      seatId: silentSeat2 ? silentSeat2._id : null,
      bookingDate: todayStr,
      startTime: "09:00",
      endTime: "11:00",
      bookingType: "SEAT",
      status: "Occupied",
      purpose: "Database Systems revision",
    },
    {
      userId: studentUser._id,
      studySpaceId: createdSpaces[2]._id, // Group Room A
      seatId: null,
      bookingDate: todayStr,
      startTime: "14:00",
      endTime: "16:00",
      bookingType: "ROOM",
      status: "Confirmed",
      purpose: "Capstone Project Sprint Meeting",
    },
  ];

  await Booking.insertMany(bookingsToInsert);
  console.log("Initial bookings created successfully.");

  console.log("\n=================================");
  console.log("DATABASE SEEDING COMPLETE!");
  console.log("Admin credentials: admin@studyspace.edu / Admin@123");
  console.log("Student credentials: student@studyspace.edu / Student@123");
  console.log("=================================\n");

  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
