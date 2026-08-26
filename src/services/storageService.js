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

// Clean initial empty users array for real user testing
const SEED_USERS = [];

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

  // --- USERS & AUTH ---
  getUsers() {
    const data = localStorage.getItem(KEYS.USERS);
    if (!data) return [];
    try {
      return JSON.parse(data) || [];
    } catch (e) {
      return [];
    }
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
      
      const idMatch = (
        uId === cleanId || 
        uEmail === cleanId || 
        uName === cleanId
      );
      
      const passMatch = (u.password || '') === password;
      return idMatch && passMatch;
    });

    if (!matchedUser) {
      throw new Error('Invalid email/ID or password. If you do not have an account, please Sign Up first!');
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
      branch: userData.branch || "Computer Science & Engineering",
      year: userData.year || "3rd Year",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      bio: userData.bio || "Student learning & exchanging technical skills on PeerNexus.",
      credits: 200,
      reputation: 100,
      skillsOffered: userData.skillsOffered || [],
      skillsWanted: userData.skillsWanted || [],
      badges: ["PeerNexus Member"]
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

  // Export / Import Token
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

  // Reset Data completely
  wipeData() {
    localStorage.removeItem(KEYS.USERS);
    localStorage.removeItem(KEYS.SKILLS);
    localStorage.removeItem(KEYS.PROJECTS);
    localStorage.removeItem(KEYS.RESOURCES);
    localStorage.removeItem(KEYS.WORKSHOPS);
    localStorage.removeItem(KEYS.TRADES);
    localStorage.removeItem(KEYS.MESSAGES);
    localStorage.removeItem(KEYS.CURRENT_USER_ID);
    this.notifySync();
  },

  // --- CLOUD DATABASE (SUPABASE) ---
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
