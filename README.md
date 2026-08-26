# CampusForge - Smart Campus Skill Exchange & Project Collaborator Platform

**CampusForge** is an AI-powered, multi-tenant web application designed for B.Tech CS Final Year Capstone Projects. It enables students to exchange technical skills (via an Escrow Credit barter system), recruit hackathon & project collaborators, reserve campus GPU lab workstations, and run matching compatibility algorithms for viva evaluations.

---

## 🌟 Key Technical Features
1. **Multi-User Architecture & Unique ID Authentication**
   - Clean registration, Unique Student IDs (`stu-XXXX`), credentials authentication, and universal cross-device recovery.
2. **Peer-to-Peer Skill Barter Marketplace**
   - Credit-based escrow barter engine with rating & reputation tracking.
3. **Capstone & Hackathon Collaborator Portal**
   - Post project openings, calculate applicant compatibility scores, and accept/reject applicants into project rosters.
4. **Interactive CS Algorithm Visualizer**
   - Live Jaccard set similarity and mutual complementarity matrix calculator for external viva presentation.
5. **Active Trade Session Room**
   - Integrated WebRTC video room simulator, collaborative lecture code scratchpad, and direct chat drawer.
6. **Gemini AI Capstone Mentor**
   - AI assistant for project ideation, report advice, and tech stack recommendations.

---

## 🚀 Quick Start & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## 📁 Clean Repository Structure

```
src/
├── components/
│   ├── AuthView.jsx                 # Login, Sign Up, & Device Sync Screen
│   ├── SidebarNav.jsx               # Left navigation bar with user info
│   ├── HeaderBar.jsx                # Top action bar with notifications
│   ├── SkillExchange.jsx            # Skill barter marketplace
│   ├── ProjectCollaborator.jsx     # Capstone & hackathon recruitment hub
│   ├── MatchingEngine.jsx           # Viva demonstration & algorithm inspector
│   ├── ResourceBooking.jsx          # Campus lab workstation reservation
│   ├── ProfileDashboard.jsx         # Student portfolio & inbox
│   ├── ActiveSessionRoomModal.jsx   # Live session room (video, code notes, chat)
│   ├── DirectChatDrawer.jsx         # Direct messaging drawer
│   ├── EditProfileModal.jsx         # Profile editing modal
│   ├── AIAdvisorModal.jsx           # Gemini AI capstone mentor modal
│   └── Footer.jsx                   # Page footer
├── data/
│   └── mockData.js                  # Campus resources & seed data
├── services/
│   └── storageService.js            # Multi-user data persistence & sync engine
├── utils/
│   └── matchingAlgorithm.js        # Jaccard index & complementarity math
├── App.jsx                          # Main application container
└── index.css                        # Styling tokens & Tailwind CSS v4 setup
```
