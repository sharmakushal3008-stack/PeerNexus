// Clean, empty default seed structures for production & real testing

export const CURRENT_USER = null;

export const INITIAL_SKILL_OFFERS = [];

export const INITIAL_PROJECTS = [];

export const CAMPUS_RESOURCES = [
  {
    id: "res-1",
    name: "Advanced AI & GPU Compute Lab (Lab 402)",
    type: "High-Performance Computing",
    location: "CS Block, 4th Floor",
    capacity: "20 Workstations (NVIDIA RTX 4090)",
    amenities: ["NVIDIA RTX 4090 GPUs", "Gigabit LAN", "Dual Monitors", "Air Conditioned"],
    availableSlots: ["10:00 AM - 12:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM"],
    status: "Available"
  },
  {
    id: "res-2",
    name: "Innovation & Hackathon Discussion Room B",
    type: "Team Discussion Room",
    location: "Student Activity Center, 2nd Floor",
    capacity: "8 Persons",
    amenities: ["Interactive Smart Display", "Whiteboard", "High-speed Wi-Fi", "Power Hubs"],
    availableSlots: ["11:00 AM - 01:00 PM", "01:00 PM - 03:00 PM", "05:00 PM - 07:00 PM"],
    status: "Available"
  },
  {
    id: "res-3",
    name: "IoT & Embedded Systems Prototyping Workshop",
    type: "Hardware Lab",
    location: "ECE Building, Room 108",
    capacity: "15 Benches",
    amenities: ["Oscilloscopes", "Soldering Stations", "3D Printers", "Component Library"],
    availableSlots: ["09:30 AM - 11:30 AM", "03:00 PM - 05:00 PM"],
    status: "Available"
  }
];

export const WORKSHOPS = [];

export const VIVA_QUESTIONS = [
  {
    q: "How does the Teammate Matching Algorithm prevent cold-start problems?",
    a: "We compute similarity over fallback domain tags and student academic year weights whenever skill vectors are sparse."
  },
  {
    q: "Why use Jaccard Similarity instead of Cosine Similarity for skill matching?",
    a: "Jaccard similarity measures binary presence/absence of distinct discrete skills, which fits barter tags better than dense vector embeddings without incurring heavy embedding overhead."
  },
  {
    q: "How is data consistency guaranteed in skill barter transactions?",
    a: "Credits are locked in a transient escrow state upon request submission and released only when both peers confirm session completion."
  }
];
