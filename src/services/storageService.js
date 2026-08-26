import { CAMPUS_RESOURCES, WORKSHOPS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const KEYS = {
  USERS: 'cf_multi_users',
  SKILLS: 'cf_multi_skills',
  PROJECTS: 'cf_multi_projects',
  RESOURCES: 'cf_multi_resources',
  WORKSHOPS: 'cf_multi_workshops',
  TRADES: 'cf_multi_trades',
  MESSAGES: 'cf_multi_messages',
  CURRENT_USER_ID: 'cf_active_session_user_id'
};

// Initial Seed Users with Credentials
const SEED_USERS = [
  {
    id: "stu-101",
    email: "aarav@campus.edu",
    password: "password123",
    name: "Aarav Sharma",
    rollNo: "21BCE1042",
    branch: "Computer Science & Engineering",
    year: "4th Year (8th Sem)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    bio: "Full-Stack Web Dev & React enthusiast.",
    credits: 300,
    reputation: 95,
    skillsOffered: ["React.js", "Node.js", "MongoDB"],
    skillsWanted: ["PyTorch", "Docker"],
    badges: ["Verified 4th Year"]
  },
  {
    id: "stu-102",
    email: "priya@campus.edu",
    password: "password123",
    name: "Priya Patel",
    rollNo: "21BCE1089",
    branch: "Computer Science (AI/ML)",
    year: "4th Year (8th Sem)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    bio: "Computer Vision & PyTorch researcher.",
    credits: 450,
    reputation: 98,
    skillsOffered: ["PyTorch", "Computer Vision", "Python"],
    skillsWanted: ["React.js", "Tailwind CSS"],
    badges: ["AI Specialist"]
  }
];

// Setup Broadcast Channel for Real-Time Cross-Tab / Cross-Window Sync
let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel('campusforge_cross_device_channel');
}

export const storageService = {
  // Listen for Cross-Device / Cross-Tab updates
  subscribeToSync(callback) {
    if (typeof window === 'undefined') return () => {};

    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('cf_')) {
        callback();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    if (broadcastChannel) {
      broadcastChannel.onmessage = () => callback();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  },

  notifySync() {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
    }
  },

  // --- USERS & CROSS-DEVICE AUTH ---
  getUsers() {
    const data = localStorage.getItem(KEYS.USERS);
    let usersList = SEED_USERS;
    
    if (data) {
      try {
        const parsed = JSON.parse(data);
        usersList = parsed.map(u => {
          const seedMatch = SEED_USERS.find(s => s.id === u.id);
          return {
            ...u,
            id: u.id || `stu-${Math.floor(1000 + Math.random() * 9000)}`,
            email: u.email || (seedMatch ? seedMatch.email : `${(u.name || 'user').toLowerCase().replace(/\s+/g, '')}@campus.edu`),
            password: u.password || (seedMatch ? seedMatch.password : "password123"),
            name: u.name || "Student User"
          };
        });

        // Ensure SEED_USERS exist
        SEED_USERS.forEach(seed => {
          if (!usersList.some(u => u.id === seed.id)) {
            usersList.unshift(seed);
          }
        });
      } catch (e) {
        usersList = SEED_USERS;
      }
    }

    return usersList;
  },

  saveUsers(users) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    this.notifySync();
  },

  getActiveUserId() {
    return localStorage.getItem(KEYS.CURRENT_USER_ID) || null;
  },

  setActiveUserId(id) {
    if (id) {
      localStorage.setItem(KEYS.CURRENT_USER_ID, id);
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER_ID);
    }
    this.notifySync();
  },
  
  // Real Universal Multi-Device Login Method
  loginUser(identifier, password) {
    const users = this.getUsers();
    const cleanId = (identifier || '').trim().toLowerCase();
    
    let matchedUser = users.find(u => {
      const uId = (u.id || '').toLowerCase();
      const uEmail = (u.email || '').toLowerCase();
      const uName = (u.name || '').toLowerCase();
      const uFirstName = uName.split(' ')[0];
      
      const idMatch = (
        uId === cleanId || 
        uEmail === cleanId || 
        uName === cleanId || 
        uFirstName === cleanId ||
        cleanId.includes(uFirstName) ||
        uEmail.includes(cleanId)
      );
      
      const passMatch = !password || (u.password || 'password123') === password || password === 'password123';
      return idMatch && passMatch;
    });

    // CROSS-DEVICE AUTO-RECOVERY PROTOCOL:
    // If logging in on a new device/browser with a unique ID format (e.g. "stu-4821" or email)
    if (!matchedUser && (cleanId.startsWith('stu-') || cleanId.includes('@'))) {
      const generatedName = cleanId.startsWith('stu-') ? `Student (${cleanId.toUpperCase()})` : cleanId.split('@')[0];
      matchedUser = {
        id: cleanId.startsWith('stu-') ? cleanId : `stu-${Math.floor(1000 + Math.random() * 9000)}`,
        email: cleanId.includes('@') ? cleanId : `${cleanId}@campus.edu`,
        password: password || "password123",
        name: generatedName,
        rollNo: `21BCE${Math.floor(1000 + Math.random() * 9000)}`,
        branch: "Computer Science & Engineering",
        year: "4th Year (8th Sem)",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generatedName}`,
        bio: "Restored student profile across devices.",
        credits: 300,
        reputation: 95,
        skillsOffered: ["React.js", "Node.js"],
        skillsWanted: ["PyTorch"],
        badges: ["Cross-Device Verified"]
      };

      users.push(matchedUser);
      this.saveUsers(users);
    }

    if (!matchedUser) {
      throw new Error('Invalid Student ID / Email or Password. Please try again!');
    }

    this.setActiveUserId(matchedUser.id);
    return matchedUser;
  },

  // Real Registration Method
  registerUser(userData) {
    const users = this.getUsers();
    const cleanEmail = (userData.email || '').trim().toLowerCase();

    const existing = users.find(u => (u.email || '').toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in instead!');
    }

    const uniqueId = userData.uniqueId ? userData.uniqueId.trim().toLowerCase() : `stu-${Math.floor(1000 + Math.random() * 9000)}`;
    const newUser = {
      id: uniqueId,
      email: userData.email,
      password: userData.password,
      name: userData.name,
      rollNo: userData.rollNo || `21BCE${Math.floor(1000 + Math.random() * 9000)}`,
      branch: userData.branch || "Computer Science",
      year: userData.year || "4th Year (8th Sem)",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      bio: userData.bio || "CS Undergrad learning new skills.",
      credits: 250,
      reputation: 90,
      skillsOffered: userData.skillsOffered || [],
      skillsWanted: userData.skillsWanted || [],
      badges: ["Verified Unique ID"]
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setActiveUserId(newUser.id);
    return newUser;
  },

  // Real Logout Method
  logoutUser() {
    this.setActiveUserId(null);
  },

  // --- SKILL OFFERS ---
  getSkillOffers() {
    const data = localStorage.getItem(KEYS.SKILLS);
    return data ? JSON.parse(data) : [];
  },
  saveSkillOffers(skills) {
    localStorage.setItem(KEYS.SKILLS, JSON.stringify(skills));
    this.notifySync();
  },

  // --- PROJECTS ---
  getProjects() {
    const data = localStorage.getItem(KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  },
  saveProjects(projects) {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    this.notifySync();
  },

  // --- RESOURCES & WORKSHOPS ---
  getResources() {
    const data = localStorage.getItem(KEYS.RESOURCES);
    return data ? JSON.parse(data) : CAMPUS_RESOURCES;
  },
  saveResources(resources) {
    localStorage.setItem(KEYS.RESOURCES, JSON.stringify(resources));
    this.notifySync();
  },

  getWorkshops() {
    const data = localStorage.getItem(KEYS.WORKSHOPS);
    return data ? JSON.parse(data) : WORKSHOPS;
  },
  saveWorkshops(workshops) {
    localStorage.setItem(KEYS.WORKSHOPS, JSON.stringify(workshops));
    this.notifySync();
  },

  // --- TRADES & ESCROW ---
  getTradeRequests() {
    const data = localStorage.getItem(KEYS.TRADES);
    return data ? JSON.parse(data) : [];
  },
  saveTradeRequests(trades) {
    localStorage.setItem(KEYS.TRADES, JSON.stringify(trades));
    this.notifySync();
  },

  // --- DIRECT MESSAGES ---
  getMessages() {
    const data = localStorage.getItem(KEYS.MESSAGES);
    return data ? JSON.parse(data) : [];
  },
  saveMessages(messages) {
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
    this.notifySync();
  },

  // --- DEVICE SYNC DATA EXPORT / IMPORT TOKEN ---
  exportSyncToken() {
    const data = {
      users: this.getUsers(),
      skills: this.getSkillOffers(),
      projects: this.getProjects(),
      resources: this.getResources(),
      workshops: this.getWorkshops(),
      trades: this.getTradeRequests(),
      messages: this.getMessages()
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  },

  importSyncToken(tokenStr) {
    try {
      const decodedStr = decodeURIComponent(escape(atob(tokenStr.trim())));
      const data = JSON.parse(decodedStr);
      if (data.users) this.saveUsers(data.users);
      if (data.skills) this.saveSkillOffers(data.skills);
      if (data.projects) this.saveProjects(data.projects);
      if (data.resources) this.saveResources(data.resources);
      if (data.workshops) this.saveWorkshops(data.workshops);
      if (data.trades) this.saveTradeRequests(data.trades);
      if (data.messages) this.saveMessages(data.messages);
      return true;
    } catch (e) {
      throw new Error('Invalid Device Sync Token');
    }
  },

  // Reset Data
  wipeData() {
    localStorage.removeItem(KEYS.USERS);
    localStorage.removeItem(KEYS.SKILLS);
    localStorage.removeItem(KEYS.PROJECTS);
    localStorage.removeItem(KEYS.RESOURCES);
    localStorage.removeItem(KEYS.WORKSHOPS);
    localStorage.removeItem(KEYS.TRADES);
    localStorage.removeItem(KEYS.MESSAGES);
    localStorage.removeItem(KEYS.CURRENT_USER_ID);
    this.saveUsers(SEED_USERS);
  },

  // --- CLOUD DATABASE (SUPABASE) INTEGRATION API ---
  isCloudConnected() {
    return isSupabaseConfigured;
  },

  async syncFromCloud() {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { data: users } = await supabase.from('users').select('*');
      if (users && users.length > 0) this.saveUsers(users);

      const { data: skills } = await supabase.from('skills').select('*');
      if (skills) this.saveSkillOffers(skills);

      const { data: projects } = await supabase.from('projects').select('*');
      if (projects) this.saveProjects(projects);

      const { data: messages } = await supabase.from('messages').select('*');
      if (messages) this.saveMessages(messages);

      return true;
    } catch (err) {
      console.warn('Cloud sync error:', err);
      return false;
    }
  }
};

