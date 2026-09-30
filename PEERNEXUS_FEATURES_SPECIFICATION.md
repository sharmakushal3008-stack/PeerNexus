# PeerNexus (CampusForge)
## Comprehensive Platform Features & Technical Functionalities Specification

> **Target Audience:** B.Tech Computer Science & Engineering Students, Academic Project Coordinators, Viva Evaluators, and Campus Lab Administrators.

---

## 1. Executive Overview & System Purpose

**PeerNexus** (also known as **CampusForge**) is an AI-powered, multi-tenant academic collaboration and skill-barter web application designed for university engineering students. It solves four primary challenges in academic computer science environments:

1. **Non-Monetary Skill Exchange**: A decentralized, trust-minimized skill trading marketplace using an automated **Escrow Credit Economy** (students earn credits by teaching and spend credits to learn).
2. **Capstone & Hackathon Team Recruitment**: A project collaborator portal allowing project leads to post vacancies for specific engineering roles (Frontend, ML, Systems, DevOps) with automated candidate compatibility scoring.
3. **Interactive CS Algorithm Visualizer for Viva Examinations**: A dedicated mathematical matching engine inspector that breaks down **Jaccard Set Similarity** and **Mutual Complementarity Matrix** calculations step-by-step for university viva evaluators.
4. **Campus GPU Lab & Workstation Reservations**: A reservation portal for high-performance computing hardware (NVIDIA A100 Tensor Core nodes, Dual RTX 4090 workstations) and campus technical workshops.
5. **Real-Time Active Trade Session Rooms**: Full-featured WebRTC virtual meeting rooms with bi-directional video/audio, dynamic synthetic camera/audio equalizers (for hardware-free demos), synchronized collaborative code scratchpads, and integrated Google Gemini AI guidance.

---

## 2. Technical Stack & Architecture

| Layer | Technology | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (ES Modules) | Component-driven UI with Hooks, Context, and stateful drawers. |
| **Build Tool & Bundler**| Vite 8 | Ultra-fast Hot Module Replacement (HMR) and optimized rollup bundling. |
| **Styling & Design System** | Tailwind CSS v4 (`@tailwindcss/vite`) | Bespoke dark-mode slate theme with custom design tokens, glassmorphism, and responsive grids. |
| **Animations & 3D** | Three.js, React Three Fiber, Framer Motion | Smooth modal transitions, tab fades, interactive particle canvas, and canvas confetti. |
| **Iconography** | Lucide React | Modern, consistent SVG icon set for all UI modules. |
| **AI Capstone Mentor** | Google Gemini 1.5 Flash API (`@google/generative-ai`) | Real-time academic ideation, proposal writing advice, and offline heuristic fallback mode. |
| **Persistence & Cloud Sync** | Dual-Mode Storage Engine (LocalStorage + Supabase Realtime) | Zero-config offline LocalStorage database with automatic live cloud synchronization via PostgreSQL & WebSockets. |
| **P2P Audio/Video** | WebRTC + HTML5 Canvas Stream | Bi-directional media streams, STUN server signaling (`stun:stun.l.google.com:19302`), and synthetic 30 FPS avatar generation. |
| **Static Code Analysis**| Oxlint | High-performance JavaScript linting and validation. |

---

## 3. Detailed Feature-by-Feature Breakdown

### 3.1 Multi-Tenant Authentication & Identity System (`AuthView.jsx`, `storageService.js`)
- **Auto-Generated Student IDs**: Assigns unique campus IDs (format: `stu-XXXX`) upon registration.
- **Dual Identifier Login**: Allows authentication via either Student ID or registered university email.
- **Cross-Device Sync Key**: Cryptographic session export/import allowing students to resume their profile state across multiple machines.
- **Demo Persona Quick-Login**: Instant one-click login for preset test accounts (Full Stack Lead, ML Researcher, DevOps Specialist) for swift academic viva demonstrations.
- **Secure Client Session Management**: Instant local persistence with active user switching and automatic logout routines.

---

### 3.2 Public Landing Page (`LandingPage.jsx`, `InteractiveMouseCanvas.jsx`)
- **Interactive Cursor Spotlight Canvas**: Smooth 2D HTML5 particle canvas that responds dynamically to mouse movement with radial glow gradients.
- **Dynamic Live Feature Switcher**: Unauthenticated visitors can preview interactive cards for Skill Barter, Project Assembly, Algorithm Engine, and Lab Booking before logging in.
- **Platform Analytics Banner**: Displays key campus impact metrics (12+ campus labs, 500+ student peers, 98% viva pass rate).
- **Glassmorphic Navigation Bar**: Quick routing to Login or Registration modal dialogs.

---

### 3.3 Peer-to-Peer Skill Barter Marketplace (`SkillExchange.jsx`)
- **Category & Keyword Filtering**: Real-time search across Web Development, Machine Learning, Cloud Architecture, DevOps, Blockchain, and System Design.
- **Automated Escrow Credit Locking**: When a student requests a trade session, the required credits are held in Escrow and deducted from their balance immediately.
- **Post Skill Offerings (+50 Credit Reward)**: Students can publish new tutoring offerings with custom credit prices, earning a `+50 Credit` incentive bonus upon publishing.
- **Reputation Badges & Completed Sessions Counter**: Shows verified student reputation scores (0-100%), 5-star ratings, and departmental affiliations.
- **Direct Peer Chat Trigger**: One-click slide-out chat drawer launcher on every skill listing card.

---

### 3.4 Capstone & Hackathon Collaborator Portal (`ProjectCollaborator.jsx`)
- **Recruitment Board**: Browse ongoing 4th-year capstone projects, research initiatives, and hackathon teams.
- **Role Roster Management**: Leads can configure specific open roles (e.g., *React & WebRTC Specialist*, *PyTorch Researcher*) with required skill tags and slot statuses (`Open` vs `Filled`).
- **Dynamic Skill Match Compatibility Scoring**: Calculates a real-time percentage match score when students apply for a role by comparing their profile skills with project requirements.
- **Applicant Review Drawer**: Project leads can inspect applicants' match scores, view their skill portfolios, and **Accept** (auto-filling the role) or **Decline** candidates.
- **Publish New Project**: Dialog for defining title, abstract, tech stack tags, deadlines, and required team vacancies.

---

### 3.5 CS Algorithm Visualizer & Viva Inspector (`MatchingEngine.jsx`, `matchingAlgorithm.js`)
- **Jaccard Set Similarity Metric**:
  $$\text{Jaccard Index } J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
  Visualizes shared technical overlap, union sets, and intersection elements.
- **Mutual Complementarity Matrix**: Evaluates bidirectional skill synergy (how what Student A offers fulfills what Student B wants, combined with how Student B fulfills Student A's learning goals).
- **Viva Step-by-Step Inspector Mode**: Built specifically for university evaluators to inspect mathematical matrices, weighting factors, and set calculations during final year evaluations.
- **Visual Overlap Matrices & Venn Displays**: Clear visual representation of overlapping vs complementary competencies.

---

### 3.6 Campus GPU Lab & Workstation Reservations (`ResourceBooking.jsx`)
- **Hardware Inventory**: Reserve time on NVIDIA A100 Tensor Core GPUs (80GB VRAM), Dual RTX 4090 workstations, HPC clusters, and embedded IoT testbeds.
- **Time Slot Selection**: Choose between Morning, Afternoon Deep Learning, Evening Fine-Tuning, or Overnight Batch Training slots.
- **Campus Tech Workshops & Hackathons**: View upcoming technical seminars with real-time remaining seat counters and 1-click registration.

---

### 3.7 Live WebRTC Active Trade Session Room (`ActiveSessionRoomModal.jsx`)
- **Bi-Directional Video & Audio**: Hardware camera and microphone negotiation with individual mute and video toggles.
- **Synthetic 30 FPS Camera & Dynamic Equalizer Fallback**: Built-in animated HTML5 canvas avatar and dynamic audio waveform generator that activates when hardware cameras are absent or during offline testing.
- **Dual Signaling Engine**: Combines browser `BroadcastChannel` (for instant cross-tab testing) with Supabase Realtime channels for networked devices.
- **Synchronized Collaborative Code & Notes Scratchpad**: In-room shared code editor with syntax highlighting (JavaScript, Python, C++, SQL), instant peer broadcasting, one-click code copy, and local file export (`.txt` / `.js`).
- **In-Room Live Session Chat**: Real-time communication drawer for terminal commands and reference links.
- **Session Completion & Escrow Release**: Peer rating dialog (1-5 stars) that automatically finalizes the trade, awards reputation points, and releases Escrow credits to the mentor.

---

### 3.8 Global Notification Center & Header Bar (`HeaderBar.jsx`)
- **Live Unread Badges**: Tracks actionable events across the application.
- **Notification Categories**:
  - *Incoming Trade Requests* (action required)
  - *Accepted Trade Requests* (click to immediately enter the live room)
  - *Completed Trade Confirmations* (Escrow receipts)
  - *Direct Messages* (click to open conversation thread)
- **Global Search & Credit Balance Counter**: Real-time visual credit display reflecting all Escrow holds and transfers.

---

### 3.9 Standalone Direct Peer Messaging (`DirectChatDrawer.jsx`)
- **Slide-Out Chat Interface**: Persistent drawer accessible from any screen without losing current context.
- **Chronological Message History**: Auto-scrolling conversation view with formatted timestamps and sender identification.
- **Dual Persistence**: Instant local message updates pushed to Supabase Realtime for cross-device delivery.

---

### 3.10 Google Gemini AI Academic & Capstone Mentor (`AIAdvisorModal.jsx`)
- **Gemini 1.5 Flash Integration**: Rapid AI responses for capstone ideation, literature review suggestions, and software architecture designs.
- **Custom API Key Banner & Offline Fallback**: Enter a personal Gemini API key or use the intelligent offline academic fallback mode for offline demonstrations.
- **Quick Prompt Buttons**: Pre-engineered prompts for *Project Ideation*, *Profile Bio Writing*, and *Viva Preparation Questions*.

---

### 3.11 Student Portfolio & Profile Dashboard (`ProfileDashboard.jsx`, `EditProfileModal.jsx`)
- **Academic Portfolio**: Displays GPA, Major, Expected Graduation Year, Bio, and GitHub/LinkedIn links.
- **Skills Management**: Interactive tag editor for adding or removing *Skills Offered* and *Skills Wanted*.
- **Trade Request Inbox**: Manage pending incoming/outgoing requests, accept trades, or launch active live session rooms.
- **Published Projects & Skills Manager**: Monitor recruitment status and edit active offerings.
- **Demonstration Database Wipe & Reset**: 1-click utility to reset state back to default university seed data.

---

### 3.12 Dual-Mode Persistence & Cloud Sync Engine (`storageService.js`)
- **Offline-First LocalStorage Emulation**: Complete client-side database emulation allowing the application to function with zero backend configuration.
- **Live Cloud Sync via Supabase Realtime**: Multi-tenant synchronization across separate physical devices.
- **3-Second Background Polling & Broadcast Listeners**: Ensures peer requests, notifications, and room invitations are synchronized in real-time.
