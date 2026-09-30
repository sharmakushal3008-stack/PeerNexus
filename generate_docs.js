import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType,
  ShadingType
} from 'docx';
import fs from 'fs';
import path from 'path';

function createTitle(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 200, before: 100 },
    run: {
      size: 36,
      bold: true,
      color: "0F172A",
      font: "Segoe UI"
    }
  });
}

function createSubtitle(text) {
  return new Paragraph({
    text: text,
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    run: {
      size: 22,
      italics: true,
      color: "0284C7",
      font: "Segoe UI"
    }
  });
}

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 150 },
    run: {
      size: 28,
      bold: true,
      color: "0369A1",
      font: "Segoe UI"
    }
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 250, after: 100 },
    run: {
      size: 24,
      bold: true,
      color: "0F172A",
      font: "Segoe UI"
    }
  });
}

function createHeading3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    run: {
      size: 20,
      bold: true,
      color: "334155",
      font: "Segoe UI"
    }
  });
}

function createParagraph(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix + " ", bold: true, color: "0F172A", font: "Segoe UI", size: 21 }));
  }
  children.push(new TextRun({ text: text, color: "334155", font: "Segoe UI", size: 21 }));
  return new Paragraph({
    children,
    spacing: { after: 120, line: 280 }
  });
}

function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix + ": ", bold: true, color: "0F172A", font: "Segoe UI", size: 21 }));
  }
  children.push(new TextRun({ text: text, color: "334155", font: "Segoe UI", size: 21 }));
  return new Paragraph({
    bullet: { level: 0 },
    children,
    spacing: { after: 80, line: 260 }
  });
}

function createSubBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix + ": ", bold: true, color: "0F172A", font: "Segoe UI", size: 20 }));
  }
  children.push(new TextRun({ text: text, color: "475569", font: "Segoe UI", size: 20 }));
  return new Paragraph({
    bullet: { level: 1 },
    children,
    spacing: { after: 60, line: 240 }
  });
}

function createDivider() {
  return new Paragraph({
    border: {
      bottom: { color: "CBD5E1", size: 6, style: BorderStyle.SINGLE }
    },
    spacing: { before: 200, after: 200 }
  });
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: "Segoe UI",
          size: 21,
          color: "334155"
        }
      }
    }
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440
          }
        }
      },
      children: [
        createTitle("PeerNexus (CampusForge)"),
        createSubtitle("Comprehensive Platform Features & Technical Functionalities Specification"),
        
        createParagraph("This document provides an exhaustive, feature-by-feature breakdown of the PeerNexus platform. PeerNexus is an AI-powered, multi-tenant academic collaboration and skill-barter ecosystem engineered specifically for B.Tech Computer Science and Engineering students, capstone teams, and campus research labs."),
        
        createDivider(),

        // SECTION 1
        createHeading1("1. Executive Overview & System Purpose"),
        createParagraph("PeerNexus addresses critical friction points in undergraduate engineering curricula: finding balanced capstone partners, exchanging technical skills without monetary cost, reserving limited campus GPU resources, inspecting algorithm mechanics for academic vivas, and conducting structured real-time peer mentorship."),
        createBullet("Equitable Skill Barter", "Non-Monetary Credit Economy where students earn credits by mentoring others and spend credits to learn new engineering skills."),
        createBullet("Capstone & Hackathon Assembly", "Automated role-based team recruitment matching frontend, backend, ML, and DevOps specialists."),
        createBullet("Academic Viva Inspection", "Interactive mathematical inspector explaining Jaccard Similarity and Complementarity calculations to university evaluators."),
        createBullet("Campus Hardware Management", "Time-slotted reservations for high-performance computing (HPC) nodes, NVIDIA A100 / RTX 4090 GPU rigs, and embedded lab kits."),
        createBullet("Dual WebRTC + Cloud Collaboration", "Full-featured active trade session rooms with bi-directional video, audio waveforms, synchronized code scratchpads, and integrated Gemini AI mentorship."),

        createDivider(),

        // SECTION 2
        createHeading1("2. Technical Stack & Infrastructure"),
        createParagraph("PeerNexus is built using modern, production-grade web technologies:"),
        createBullet("Core Frontend Framework", "React 19 (ES Modules) bundled with Vite 8 for instant Hot Module Replacement (HMR) and sub-second builds."),
        createBullet("Styling & Tokens", "Tailwind CSS v4 with bespoke glassmorphic tokens, responsive utility classes, and custom animations."),
        createBullet("3D & Particle Systems", "Three.js, React Three Fiber, React Three Drei, and custom HTML5 Canvas interactive cursor spotlight animations."),
        createBullet("AI Integration", "Google Gemini 1.5 Flash API (@google/generative-ai) with context-aware academic prompting and smart offline fallback heuristic engines."),
        createBullet("Dual-Tier Persistence & Cloud Sync", "Supabase Realtime (PostgreSQL + WebSockets) coupled with multi-tenant LocalStorage fallback and auto-sync broadcast listeners."),
        createBullet("Peer-to-Peer WebRTC Engine", "Browser WebRTC API with multi-tier STUN server signaling (`stun:stun.l.google.com:19302`), cross-tab `BroadcastChannel`, and synthetic HTML5 canvas video generation."),
        createBullet("Code Quality & Linting", "Oxlint high-performance static analysis."),

        createDivider(),

        // SECTION 3
        createHeading1("3. Multi-Tenant Authentication & Identity System"),
        createParagraph("Located in src/components/AuthView.jsx and src/services/storageService.js, this module manages student identity, registration, and cross-device session synchronization."),
        createBullet("Unique Student ID Generation", "Automatically generates standardized campus identification codes (format: stu-XXXX) during student registration."),
        createBullet("Dual-Mode Authentication", "Supports login via Student ID or Registered Email combined with secure credentials verification."),
        createBullet("Cross-Device Sync Key Export/Import", "Allows students to export their complete cryptographic session payload and resume their active account across multiple browsers or devices."),
        createBullet("One-Click Persona Switcher (Demo Quick-Login)", "Includes pre-configured demo student profiles (Full Stack Lead, ML Engineer, DevOps Specialist, System Architect) for instantaneous viva and demonstration evaluation."),
        createBullet("Client-Side Form Validation & Toast Notifications", "Real-time password matching, email regex checks, and dynamic feedback toasts on successful authentication."),

        createDivider(),

        // SECTION 4
        createHeading1("4. Public Landing Page & Interactive Visualizer"),
        createParagraph("Located in src/components/LandingPage.jsx, src/components/InteractiveMouseCanvas.jsx, and src/components/Canvas3DPreview.jsx."),
        createBullet("Interactive Cursor Glow Canvas", "Custom 2D HTML5 canvas particle spotlight following the user's cursor with smooth easing and gradient diffusion."),
        createBullet("Dynamic Live Feature Tab Previewer", "Allows unauthenticated visitors to toggle between interactive previews of Skill Barter, Project Matchmaking, Algorithm Matrix, and GPU Lab Reservations before signing in."),
        createBullet("Value Proposition Hero Section", "Clear call-to-action buttons, platform stats (12+ campus labs, 500+ active peers, 98% viva pass rate), and feature benefit grids."),
        createBullet("Sticky Glassmorphism Navbar", "Seamless navigation with quick sign-in triggers and theme indicators."),

        createDivider(),

        // SECTION 5
        createHeading1("5. Peer-to-Peer Skill Barter Marketplace"),
        createParagraph("Located in src/components/SkillExchange.jsx and managed via src/App.jsx."),
        createBullet("Search & Category Filtering", "Instant real-time search across skill titles, descriptions, and category tags (Web Dev, Machine Learning, Cloud, DevOps, Blockchain, Mobile)."),
        createBullet("Escrow Credit Locking Mechanism", "When a student requests a trade, the required credits are automatically deducted from their balance and locked in Escrow, guaranteeing safety for both teacher and learner."),
        createBullet("Post New Skill Offer (+50 Cr Reward)", "Students can publish new mentoring offerings with customized credit rates, estimated duration, and prerequisite tags, earning an immediate +50 credit publishing bonus."),
        createBullet("Student Reputation & Rating Badges", "Displays verified peer reputation scores (0-100%), star ratings, total completed sessions, and university department badges."),
        createBullet("Direct Peer Messaging Trigger", "One-click button on any skill listing to launch a direct 1-on-1 slide-out chat drawer with the offering student."),

        createDivider(),

        // SECTION 6
        createHeading1("6. Capstone & Hackathon Collaborator Portal"),
        createParagraph("Located in src/components/ProjectCollaborator.jsx."),
        createBullet("Project Recruitment Directory", "Browse active 4th-year capstone projects, research papers, and upcoming hackathon team openings."),
        createBullet("Multi-Role Team Rostering", "Project leads can define granular open roles (e.g., 'React & WebRTC Specialist', 'PyTorch ML Researcher') with required skill tags and slot status (Open vs Filled)."),
        createBullet("Automated Skill Compatibility Scoring", "Calculates a dynamic match percentage score when students apply for a role, comparing their profile skills against the project requirements."),
        createBullet("Applicant Review & Management Drawer", "Project leads can review incoming applicants, inspect their match scores, and either Accept them (automatically updating the role slot to 'Filled') or Reject them."),
        createBullet("Publish New Project Posting", "Modal dialog allowing leads to configure project title, abstract, tech stack tags, milestone deadlines, and custom role vacancies."),

        createDivider(),

        // SECTION 7
        createHeading1("7. CS Algorithm Visualizer & Viva Inspector (Matching Engine)"),
        createParagraph("Located in src/components/MatchingEngine.jsx and src/utils/matchingAlgorithm.js."),
        createBullet("Jaccard Set Similarity Visualizer", "Calculates Jaccard Index: J(A, B) = |A ∩ B| / |A ∪ B|, displaying exact intersection sets, union sets, and percentage compatibility."),
        createBullet("Mutual Complementarity Matrix", "Calculates bidirectional skill synergy: how effectively Student A's offered skills satisfy Student B's wanted skills, combined with how Student B satisfies Student A."),
        createBullet("Interactive Step-by-Step Viva Evaluation Mode", "Step-by-step mathematical inspector designed specifically for university external viva examiners to inspect algorithmic stages, set theory calculations, and weighting formulas."),
        createBullet("Visual Venn Diagrams & Overlap Tables", "Graphical representation of overlapping technical competencies and complementary gaps."),

        createDivider(),

        // SECTION 8
        createHeading1("8. Campus Hardware & GPU Lab Reservation System"),
        createParagraph("Located in src/components/ResourceBooking.jsx."),
        createBullet("High-Performance Hardware Reservations", "Reserve campus GPU rigs (NVIDIA A100 80GB, Dual RTX 4090 workstations), HPC clusters, and embedded IoT hardware suites."),
        createBullet("Granular Time Slot Management", "Book specialized time windows (Morning Slot, Afternoon Deep Learning, Evening Fine-Tuning, Overnight Training)."),
        createBullet("Real-Time Capacity & Status Badges", "Displays available nodes, current utilization percentages, and instant booking confirmation alerts."),
        createBullet("Campus Tech Workshops & Hackathon Seminars", "Integrated campus event registration portal with live remaining seat counters and topic descriptions."),

        createDivider(),

        // SECTION 9
        createHeading1("9. Live WebRTC Active Session Room"),
        createParagraph("Located in src/components/ActiveSessionRoomModal.jsx."),
        createBullet("Bi-Directional Video & Audio Conferencing", "Full WebRTC video calling with hardware camera/microphone device discovery, mute toggles, and video enable/disable controls."),
        createBullet("Synthetic 30 FPS Camera & Audio Equalizer Fallback", "Dynamic HTML5 canvas stream generator that renders an animated avatar and live audio waveform equalizer when hardware webcams are unavailable or in demo mode."),
        createBullet("Dual-Tier Signaling (BroadcastChannel + Supabase)", "Peer signaling across browser windows and networked devices using WebRTC STUN servers (`stun:stun.l.google.com:19302`) and Supabase Realtime channels."),
        createBullet("Collaborative Code & Notes Scratchpad", "Synchronized in-room code editor with language selection (JavaScript, Python, C++, SQL), instant peer text broadcasting, one-click code copy, and local file export (.txt / .js)."),
        createBullet("Integrated Session Chat Drawer", "Dedicated in-room messaging stream for sharing code snippets, terminal commands, and technical links during trade sessions."),
        createBullet("Session Finalization & Escrow Release", "Structured session closure modal allowing students to submit 1-5 star ratings, add session feedback, and automatically release held Escrow credits to the mentor."),

        createDivider(),

        // SECTION 10
        createHeading1("10. Global Notification Center & Header Bar"),
        createParagraph("Located in src/components/HeaderBar.jsx and src/App.jsx."),
        createBullet("Real-Time Unread Notification Badge", "Dynamic indicator badge showing pending actions and alerts."),
        createBullet("Multi-Category Alert Routing", "Categorizes notifications into: Incoming Escrow Requests, Accepted Trade Session Ready alerts, Completed Session confirmations, and Incoming Direct Messages."),
        createBullet("One-Click Smart Navigation", "Clicking an alert directly opens the relevant active trade room, directs to the user inbox, or opens the direct messaging drawer."),
        createBullet("Active User Credit Counter", "Always-visible credit balance badge reflecting real-time updates and escrow deductions."),
        createBullet("Global Search & Quick Actions", "Direct access to Gemini AI advisor, profile settings, and session termination."),

        createDivider(),

        // SECTION 11
        createHeading1("11. Real-Time Standalone Direct Messaging"),
        createParagraph("Located in src/components/DirectChatDrawer.jsx."),
        createBullet("Persistent Slide-Out Chat Drawer", "1-on-1 private messaging interface accessible anywhere across the platform without leaving the current view."),
        createBullet("Chronological Message Threading", "Timestamped conversation bubbles with sender/receiver alignment and auto-scrolling to the latest message."),
        createBullet("Dual Local & Cloud Sync", "Immediate local message rendering with automatic background push to Supabase Realtime for cross-device delivery."),

        createDivider(),

        // SECTION 12
        createHeading1("12. Google Gemini AI Academic & Capstone Mentor"),
        createParagraph("Located in src/components/AIAdvisorModal.jsx."),
        createBullet("Gemini 1.5 Flash Integration", "Powered by Google's generative AI API (`@google/generative-ai`) for sub-second academic mentoring responses."),
        createBullet("Configurable API Key & Offline Heuristic Fallback", "Custom API key banner allowing students to input their own Gemini key, paired with a sophisticated offline fallback engine that provides project suggestions and viva preparation tips even without an internet key."),
        createBullet("Academic Prompt Templates", "One-click prompt suggestions for Capstone Ideation, Abstract & Proposal Writing, Teammate Role Gap Analysis, and Viva Defense Questions."),

        createDivider(),

        // SECTION 13
        createHeading1("13. Student Portfolio Dashboard & Profile Management"),
        createParagraph("Located in src/components/ProfileDashboard.jsx and src/components/EditProfileModal.jsx."),
        createBullet("Comprehensive Academic Profile", "Displays Student ID, Full Name, Major, GPA, Graduation Year, Bio, and GitHub / Portfolio links."),
        createBullet("Skills Inventory Management", "Custom tag management interface for adding/removing 'Skills Offered' and 'Skills Wanted'."),
        createBullet("Escrow Trade Request Inbox", "Interactive dashboard tabs for managing incoming trade requests (Accept / Decline), launching active accepted rooms, and reviewing completed trade receipts."),
        createBullet("My Published Projects & Skills", "Centralized view to monitor personal project recruitment progress and active skill listings."),
        createBullet("Demonstration Database Wipe & Reset", "One-click developer utility to clear local storage and re-initialize demo seed data for fresh presentation demonstrations."),

        createDivider(),

        // SECTION 14
        createHeading1("14. Dual-Mode Storage & Persistence Engine"),
        createParagraph("Located in src/services/storageService.js and src/services/supabaseClient.js."),
        createBullet("Zero-Config LocalStorage Persistence", "Full client-side database emulation allowing the entire platform to run 100% offline out-of-the-box."),
        createBullet("Supabase Cloud Sync & Realtime Subscriptions", "When Supabase credentials are provided, seamlessly pushes users, trades, projects, and messages to PostgreSQL tables and listens for realtime multi-client mutations."),
        createBullet("Automatic 3-Second Background Polling", "Periodic synchronization interval ensuring peer trade requests and room invitations are synchronized across separate physical devices."),
        createBullet("Initial Mock Seed Data", "Comprehensive pre-populated datasets in src/data/mockData.js with authentic engineering profiles, capstone proposals, skill offerings, and lab infrastructure."),

        createDivider(),

        // SECTION 15
        createHeading1("15. Complete Repository File Structure & Architecture"),
        createParagraph("Below is the comprehensive file tree of the PeerNexus platform:"),
        createBullet("src/App.jsx", "Root orchestrator managing multi-user session state, notification routing, modal triggers, and global persistence sync."),
        createBullet("src/components/LandingPage.jsx", "Public landing page with interactive feature tabs and hero CTA."),
        createBullet("src/components/AuthView.jsx", "Multi-tenant login, registration, and cross-device sync key manager."),
        createBullet("src/components/SidebarNav.jsx", "Left navigation bar with view switching, user badge, and logout action."),
        createBullet("src/components/HeaderBar.jsx", "Top app bar with global search, live notifications drawer, credit balance, and AI trigger."),
        createBullet("src/components/SkillExchange.jsx", "Escrow credit skill barter marketplace with category search and trade initiator."),
        createBullet("src/components/ProjectCollaborator.jsx", "Capstone & hackathon collaborator recruitment portal with role application and applicant management."),
        createBullet("src/components/MatchingEngine.jsx", "CS algorithm visualizer inspecting Jaccard Similarity and Complementarity calculations for academic vivas."),
        createBullet("src/components/ResourceBooking.jsx", "Campus GPU workstations, HPC clusters, and technical workshop registration."),
        createBullet("src/components/ProfileDashboard.jsx", "Student portfolio stats, trade request inbox, published projects, and database reset utility."),
        createBullet("src/components/ActiveSessionRoomModal.jsx", "Live WebRTC video conferencing, synthetic camera fallback, synchronized code scratchpad, and session chat."),
        createBullet("src/components/DirectChatDrawer.jsx", "Slide-out 1-on-1 direct peer messaging drawer."),
        createBullet("src/components/EditProfileModal.jsx", "Student profile details editor (Bio, GPA, links, skill tags)."),
        createBullet("src/components/AIAdvisorModal.jsx", "Google Gemini AI capstone mentor and academic proposal ideator."),
        createBullet("src/components/InteractiveMouseCanvas.jsx", "Dynamic HTML5 cursor particle spotlight canvas."),
        createBullet("src/components/Canvas3DPreview.jsx", "3D preview canvas wrapper component."),
        createBullet("src/components/Footer.jsx", "Platform footer with academic attribution."),
        createBullet("src/services/storageService.js", "Dual-mode persistence engine (LocalStorage + Supabase Cloud Sync)."),
        createBullet("src/services/supabaseClient.js", "Supabase client initialization and connection status helper."),
        createBullet("src/utils/matchingAlgorithm.js", "Mathematical implementation of Jaccard index and bidirectional complementarity matrix."),
        createBullet("src/data/mockData.js", "Initial mock student database, project proposals, skill offers, and lab resources."),
        createBullet("supabase/schema.sql", "PostgreSQL database schema and security policies for cloud deployment.")
      ]
    }
  ]
});

async function main() {
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve('PeerNexus_Complete_Features_Documentation.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Successfully generated: ${outputPath}`);
}

main().catch(console.error);
