export const studySpaces = [
  {
    id: "central-library-silent-zone",
    name: "Central Library – Silent Zone",
    building: "Central Library",
    floor: "2nd Floor",
    location: "North Wing",
    type: "Silent Study",
    totalSeats: 48,
    availableSeats: 12,
    availability: "Available",
    facilities: ["Wi-Fi", "Charging points", "Air conditioning", "Individual desks"],
    rules: ["Maintain silence", "Keep phones on silent mode", "No group discussions"],
    description: "A quiet reading area designed for individual study, exam preparation, and focused work."
  },
  {
    id: "learning-centre-reading-lounge",
    name: "Learning Centre – Reading Lounge",
    building: "Learning Centre",
    floor: "1st Floor",
    location: "East Wing",
    type: "Individual Study",
    totalSeats: 30,
    availableSeats: 0,
    availability: "Full",
    facilities: ["Wi-Fi", "Comfortable seating", "Reading lights"],
    rules: ["Use headphones for audio", "Keep the area tidy", "Do not reserve seats for others"],
    description: "A relaxed individual-study space with comfortable seating and a calm atmosphere."
  },
  {
    id: "innovation-hub-group-room",
    name: "Innovation Hub – Group Room",
    building: "Innovation Hub",
    floor: "Ground Floor",
    location: "Room G-04",
    type: "Group Study",
    totalSeats: 10,
    availableSeats: 4,
    availability: "Available",
    facilities: ["Display screen", "Whiteboard", "Wi-Fi", "Power outlets"],
    rules: ["Keep discussions at a reasonable volume", "Leave the room clean", "Share equipment responsibly"],
    description: "A collaborative room for team assignments, project planning, and group discussions."
  },
  {
    id: "academic-block-discussion-room",
    name: "Academic Block – Discussion Room",
    building: "Academic Block",
    floor: "3rd Floor",
    location: "Room 312",
    type: "Discussion Room",
    totalSeats: 8,
    availableSeats: 2,
    availability: "Limited",
    facilities: ["Whiteboard", "Wi-Fi", "Round table"],
    rules: ["Use the room for academic discussion", "Avoid disturbing nearby classrooms", "Return furniture to its place"],
    description: "A small discussion room suitable for collaborative learning and short team meetings."
  },
  {
    id: "library-individual-desks",
    name: "Library – Individual Desks",
    building: "Central Library",
    floor: "1st Floor",
    location: "South Wing",
    type: "Individual Study",
    totalSeats: 36,
    availableSeats: 9,
    availability: "Available",
    facilities: ["Wi-Fi", "Desk lamps", "Charging points"],
    rules: ["One person per desk", "Keep walkways clear", "Food is not permitted"],
    description: "Dedicated desks for students who prefer independent study in a shared library environment."
  },
  {
    id: "student-centre-group-zone",
    name: "Student Centre – Group Zone",
    building: "Student Centre",
    floor: "2nd Floor",
    location: "West Wing",
    type: "Group Study",
    totalSeats: 20,
    availableSeats: 0,
    availability: "Full",
    facilities: ["Wi-Fi", "Large tables", "Power outlets"],
    rules: ["Keep noise within the group zone", "Do not move furniture outside the zone"],
    description: "An open collaborative area for group assignments and peer-learning sessions."
  }
];

export function getStudySpaceById(id) {
  return studySpaces.find((space) => space.id === id);
}