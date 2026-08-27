# PeerNexus (CampusForge) - Smart Campus Skill Exchange & Project Collaborator Platform

**PeerNexus** (also known as **CampusForge**) is an AI-powered, multi-tenant web application designed for B.Tech Computer Science and Engineering students. It enables students to barter technical skills via an Escrow Credit system, recruit hackathon & capstone project collaborators, reserve high-performance campus GPU lab workstations, inspect matching compatibility algorithms for viva evaluations, and conduct live WebRTC trade sessions with shared code scratchpads and Gemini AI guidance.

---

## 🌟 Key Technical Features

### 1. 🔐 Multi-Tenant Authentication & Recovery
- Student account registration with auto-generated unique Student IDs (`stu-XXXX`).
- Secure credentials authentication with cross-device sync key recovery.

### 2. 🔄 Peer-to-Peer Skill Barter Marketplace
- Escrow credit system ensuring safe skill trades between students.
- Reputation tracking, student ratings, and instant credit transfers upon session completion.

### 3. 👥 Capstone & Hackathon Collaborator Portal
- Post project openings, evaluate applicant skill compatibility scores, and manage project rosters.

### 4. 🧮 Interactive CS Algorithm Visualizer (Matching Engine)
- Live calculation of **Jaccard Set Similarity** and **Mutual Complementarity Matrix**.
- Built-in algorithm step-through inspector designed for external viva presentations and project evaluations.

### 5. 🖥️ Campus Resource & Lab Workstation Reservation
- Reserve campus GPU workstations, HPC clusters, and specialized hardware equipment for capstone training.

### 6. 📹 Active Trade Session Room
- **Multi-tier WebRTC Camera & Audio Acquisition**: Automatically negotiates Video + Audio streams, graceful video-only fallbacks, or synthetic 30FPS live camera feeds when hardware webcams are unavailable.
- **Bi-directional WebRTC Peer Video Stream**: Real-time cross-tab signaling via `BroadcastChannel` & STUN servers.
- **Collaborative Code & Notes Scratchpad**: Real-time shared code editor with instant peer sync.
- **Session Chat**: In-room messaging drawer.

### 7. 🤖 Gemini AI Capstone Mentor
- Integrated Google Gemini AI assistant for project ideation, report advice, architecture recommendations, and tech stack selection.

### 8. ☁️ Cloud Persistence & Supabase Integration
- Built-in dual-mode storage engine: seamless local persistence with optional live cloud sync via Supabase Realtime.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Core** | React 19, Vite 8, JavaScript (ES Module) |
| **Styling & UI** | Tailwind CSS v4 (`@tailwindcss/vite`), Custom CSS Design Tokens |
| **Animations & 3D** | Framer Motion, Three.js, React Three Fiber, React Three Drei, Canvas Confetti |
| **Icons & Assets** | Lucide React |
| **AI Integration** | `@google/generative-ai` (Google Gemini API) |
| **Backend & Sync** | Supabase (`@supabase/supabase-js`) & Multi-User Storage Service |
| **Linting & Tooling** | Oxlint |

---

## 📁 Repository Structure

```
PeerNexus/
├── public/                          # Static public assets
├── src/
│   ├── components/
│   │   ├── AuthView.jsx              # Registration, Login, & Cross-Device Sync
│   │   ├── SidebarNav.jsx            # Left navigation sidebar & user badge
│   │   ├── HeaderBar.jsx             # Top bar with search & active notifications
│   │   ├── SkillExchange.jsx         # Escrow credit skill barter marketplace
│   │   ├── ProjectCollaborator.jsx   # Capstone recruitment & applicant management
│   │   ├── MatchingEngine.jsx        # Viva algorithm visualizer & matrix inspector
│   │   ├── ResourceBooking.jsx       # Campus GPU lab workstation reservations
│   │   ├── ProfileDashboard.jsx      # Student portfolio & transaction inbox
│   │   ├── ActiveSessionRoomModal.jsx# Live session room (WebRTC, code scratchpad, chat)
│   │   ├── DirectChatDrawer.jsx      # Direct peer messaging drawer
│   │   ├── EditProfileModal.jsx      # Student profile editor
│   │   ├── AIAdvisorModal.jsx        # Gemini AI Capstone Mentor modal
│   │   └── Footer.jsx                # Platform footer
│   ├── data/
│   │   └── mockData.js               # Campus seed data & initial resources
│   ├── services/
│   │   └── storageService.js         # Multi-user local & Supabase persistence engine
│   ├── utils/
│   │   └── matchingAlgorithm.js      # Jaccard index & complementarity math
│   ├── App.jsx                       # Main app container & tab routing
│   ├── main.jsx                      # React application entry point
│   ├── index.css                     # Tailwind CSS v4 configuration & tokens
│   └── App.css                       # Component styling utilities
├── supabase/                         # Database schema & migrations
├── .env.example                      # Sample environment variables
├── package.json                      # Project dependencies & build scripts
├── vite.config.js                    # Vite bundler configuration
└── README.md                         # Platform documentation
```

---

## ⚡ Quick Start & Setup

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/sharmakushal3008-stack/PeerNexus.git

# Navigate to project root
cd PeerNexus

# Install node dependencies
npm install
```

### 2. Environment Configuration (Optional)
Copy `.env.example` to `.env` and fill in optional API keys:
```bash
cp .env.example .env
```
```env
# Optional Gemini AI Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional Supabase Cloud Credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 📝 License
This project is built for B.Tech CS Capstone and Academic Demonstrations.
