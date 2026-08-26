export const CURRENT_USER = {
  id: "user-001",
  name: "Aarav Sharma",
  rollNo: "21BCE1042",
  branch: "Computer Science & Engineering",
  year: "4th Year (8th Sem)",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  bio: "Passionate about Full-Stack Web Development, React, and Cloud Systems. Looking to learn PyTorch & Mobile Dev for final capstone.",
  credits: 450,
  reputation: 98,
  skillsOffered: ["React.js", "Node.js", "Tailwind CSS", "MongoDB", "Git & GitHub"],
  skillsWanted: ["PyTorch", "Flutter", "Docker", "UI/UX Design"],
  completedTrades: 12,
  activeProjects: 2,
  badges: ["Top Skill Mentor", "Hackathon Finalist", "Verified 4th Year"]
};

export const INITIAL_SKILL_OFFERS = [
  {
    id: "sk-1",
    authorId: "stu-102",
    authorName: "Priya Patel",
    authorYear: "4th Year CS",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    skillOffered: "PyTorch & Computer Vision",
    skillWanted: "React / Frontend Dev",
    category: "Machine Learning",
    experienceLevel: "Advanced",
    description: "Will teach CNNs, ResNet, and PyTorch model deployment in exchange for help building a React dashboard for my research project.",
    rating: 4.9,
    sessionsCount: 15,
    creditsRequired: 50,
    availableDays: ["Tue", "Thu", "Sat"],
    status: "Online"
  },
  {
    id: "sk-2",
    authorId: "stu-103",
    authorName: "Rohan Verma",
    authorYear: "3rd Year IT",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    skillOffered: "Figma UI/UX & Prototyping",
    skillWanted: "Node.js / Express APIs",
    category: "Design & UX",
    experienceLevel: "Intermediate",
    description: "Offering hands-on lessons on Figma wireframing, component design systems, and mobile UI heuristics. Need help creating REST APIs.",
    rating: 4.8,
    sessionsCount: 9,
    creditsRequired: 40,
    availableDays: ["Mon", "Wed", "Fri"],
    status: "Away"
  },
  {
    id: "sk-3",
    authorId: "stu-104",
    authorName: "Sneha Reddy",
    authorYear: "4th Year CS (AI/ML)",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    skillOffered: "Docker & Kubernetes Basics",
    skillWanted: "System Design & SQL",
    category: "DevOps & Cloud",
    experienceLevel: "Intermediate",
    description: "Learn containerizing microservices, writing Dockerfiles, and deploying to AWS ECS. Looking for SQL query optimization guidance.",
    rating: 5.0,
    sessionsCount: 21,
    creditsRequired: 60,
    availableDays: ["Sat", "Sun"],
    status: "Online"
  },
  {
    id: "sk-4",
    authorId: "stu-105",
    authorName: "Vikram Malhotra",
    authorYear: "4th Year ECE",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    skillOffered: "Embedded C & Arduino IoT",
    skillWanted: "Python Scripting & Data Parsing",
    category: "Hardware & IoT",
    experienceLevel: "Expert",
    description: "Can teach sensor interfacing, ESP32 Wi-Fi modules, and PCB layout basics. Want to learn Python for data logging.",
    rating: 4.7,
    sessionsCount: 8,
    creditsRequired: 45,
    availableDays: ["Wed", "Sat"],
    status: "Offline"
  },
  {
    id: "sk-5",
    authorId: "stu-106",
    authorName: "Ananya Iyer",
    authorYear: "3rd Year CS",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    skillOffered: "Data Structures & Algorithms (Java)",
    skillWanted: "System Design & Web Dev",
    category: "Core Computer Science",
    experienceLevel: "Advanced",
    description: "LeetCode 500+ solved. Teaching Graph algorithms, Dynamic Programming, and Tree traversals for placement preparation.",
    rating: 4.95,
    sessionsCount: 34,
    creditsRequired: 55,
    availableDays: ["Daily Evenings"],
    status: "Online"
  }
];

export const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    title: "EcoSmart Campus - IoT Waste & Energy Monitor",
    category: "IoT & Full-Stack",
    leadName: "Priya Patel",
    leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    deadline: "Final Capstone (April 2026)",
    description: "Building an end-to-end IoT monitoring system that tracks campus trash bin levels and classroom power consumption using smart sensors and a React dashboard.",
    rolesNeeded: [
      { role: "React Frontend Developer", status: "Open", skills: ["React", "Tailwind", "Recharts"] },
      { role: "IoT Hardware Engineer", status: "Filled", skills: ["ESP32", "Arduino", "MQTT"] },
      { role: "Backend API Dev", status: "Open", skills: ["Node.js", "Express", "PostgreSQL"] }
    ],
    applicants: [
      { id: "app-1", studentName: "Rohan Verma", roleApplied: "React Frontend Developer", matchScore: 89, skills: ["React", "Figma", "CSS"] },
      { id: "app-2", studentName: "Ananya Iyer", roleApplied: "Backend API Dev", matchScore: 94, skills: ["Java", "SQL", "Node.js"] }
    ],
    tags: ["IoT", "Sustainability", "React", "Node.js"],
    teamSize: "2 / 4 Members",
    matchScore: 92
  },
  {
    id: "proj-2",
    title: "MedVisiAI - Chest X-Ray Pathology Classifier",
    category: "Deep Learning & HealthTech",
    leadName: "Sneha Reddy",
    leadAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    deadline: "Smart India Hackathon 2026",
    description: "Developing a lightweight deep learning pipeline using Vision Transformers to detect pneumonia and lung abnormalities from medical X-rays with explainable AI heatmap visualization.",
    rolesNeeded: [
      { role: "PyTorch Researcher", status: "Filled", skills: ["PyTorch", "Torchvision", "CNN"] },
      { role: "Full-Stack Web Engineer", status: "Open", skills: ["React", "FastAPI", "Docker"] },
      { role: "UI/UX Designer", status: "Open", skills: ["Figma", "User Research"] }
    ],
    applicants: [
      { id: "app-3", studentName: "Vikram Malhotra", roleApplied: "Full-Stack Web Engineer", matchScore: 82, skills: ["Python", "FastAPI"] }
    ],
    tags: ["Deep Learning", "FastAPI", "PyTorch", "React"],
    teamSize: "2 / 4 Members",
    matchScore: 88
  },
  {
    id: "proj-3",
    title: "PeerCode - Collaborative Algorithmic Code Editor",
    category: "Developer Tools & WebSockets",
    leadName: "Aarav Sharma (You)",
    leadAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    deadline: "Major Project (Semester 8)",
    description: "Web-based collaborative code editor with real-time cursor tracking, syntax highlight, AST code complexity analysis, and integrated code execution runner.",
    rolesNeeded: [
      { role: "WebSockets / Backend Engineer", status: "Open", skills: ["Socket.io", "Node.js", "Docker"] },
      { role: "Frontend UI Specialist", status: "Filled", skills: ["React", "Monaco Editor"] }
    ],
    applicants: [
      { id: "app-4", studentName: "Priya Patel", roleApplied: "WebSockets / Backend Engineer", matchScore: 96, skills: ["Node.js", "React", "Docker"] }
    ],
    tags: ["WebSockets", "React", "Monaco", "Node.js"],
    teamSize: "2 / 3 Members",
    matchScore: 96
  }
];

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
    status: "Limited Slots"
  }
];

export const WORKSHOPS = [
  {
    id: "ws-1",
    title: "Mastering Docker & Microservices Architecture",
    speaker: "Sneha Reddy (4th Year CS)",
    date: "Tomorrow, 4:00 PM",
    venue: "Lab 402 / Online Hybrid",
    attendees: 38,
    maxAttendees: 50,
    tags: ["DevOps", "Docker", "Microservices"]
  },
  {
    id: "ws-2",
    title: "Cracking FAANG & Tech Interviews: System Design 101",
    speaker: "Ananya Iyer (Placement Lead)",
    date: "Saturday, 11:00 AM",
    venue: "Auditorium Hall B",
    attendees: 112,
    maxAttendees: 150,
    tags: ["Placement Prep", "System Design", "DSA"]
  }
];

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
