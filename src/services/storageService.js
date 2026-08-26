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

  // Active Session User ID stored in sessionStorage so closing/exiting the browser forces re-login
  getActiveUserId() {
    if (typeof window === 'undefined') return null;
    localStorage.removeItem(KEYS.CURRENT_USER_ID);
    return sessionStorage.getItem(KEYS.CURRENT_USER_ID) || null;
  },

  setActiveUserId(id) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.CURRENT_USER_ID);
    if (id) {
      sessionStorage.setItem(KEYS.CURRENT_USER_ID, id);
    } else {
      sessionStorage.removeItem(KEYS.CURRENT_USER_ID);
    }
    this.notifySync();
  },
  
  // Real Universal Multi-Device Login Method
  async loginUser(identifier, password) {
    const cleanId = (identifier || '').trim().toLowerCase();
    let users = this.getUsers();
    let matchedUser = null;

    // 1. Try local cache first
    matchedUser = users.find(u => {
      const uId = (u.id || '').toLowerCase();
      const uEmail = (u.email || '').toLowerCase();
      const uName = (u.name || '').toLowerCase();
      const idMatch = (uId === cleanId || uEmail === cleanId || uName === cleanId);
      const passMatch = (u.password || '') === password;
      return idMatch && passMatch;
    });

    // 2. Query Supabase Cloud Database directly
    if (!matchedUser && isSupabaseConfigured && supabase) {
      try {
        const { data: cloudUsers } = await supabase
          .from('users')
          .select('*');

        if (cloudUsers && cloudUsers.length > 0) {
          const formattedUsers = cloudUsers.map(u => ({
            id: u.id,
            email: u.email,
            password: u.password || '',
            name: u.name || '',
            rollNo: u.roll_no || u.rollNo || '',
            branch: u.branch || '',
            year: u.year || '',
            avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name || 'user')}`,
            bio: u.bio || '',
            credits: u.credits ?? 200,
            reputation: u.reputation ?? 100,
            skillsOffered: u.skills_offered || u.skillsOffered || [],
            skillsWanted: u.skills_wanted || u.skillsWanted || [],
            badges: u.badges || ["PeerNexus Member"]
          }));

          this.saveUsers(formattedUsers);
          users = formattedUsers;

          matchedUser = users.find(u => {
            const uId = (u.id || '').toLowerCase();
            const uEmail = (u.email || '').toLowerCase();
            const uName = (u.name || '').toLowerCase();
            const idMatch = (uId === cleanId || uEmail === cleanId || uName === cleanId);
            const passMatch = (u.password || '') === password;
            return idMatch && passMatch;
          });
        }
      } catch (err) {
        console.warn('Supabase cloud login fetch error:', err);
      }
    }

    if (!matchedUser) {
      throw new Error('Invalid Email, Unique ID or Password. Please check your credentials!');
    }

    this.setActiveUserId(matchedUser.id);
    return matchedUser;
  },

  // Real Multi-Device Registration Method (No pre-filled dummy strings)
  async registerUser(userData) {
    let users = this.getUsers();
    const cleanEmail = (userData.email || '').trim().toLowerCase();

    const existingLocal = users.find(u => (u.email || '').toLowerCase() === cleanEmail);
    if (existingLocal) {
      throw new Error('An account with this email address already exists. Please log in instead!');
    }

    const uniqueId = userData.uniqueId ? userData.uniqueId.trim().toLowerCase() : `usr-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const newUser = {
      id: uniqueId,
      email: userData.email,
      password: userData.password,
      name: userData.name,
      rollNo: userData.rollNo || '',
      branch: userData.branch || '',
      year: userData.year || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      bio: userData.bio || '',
      credits: 200,
      reputation: 100,
      skillsOffered: userData.skillsOffered || [],
      skillsWanted: userData.skillsWanted || [],
      badges: ["PeerNexus Member"]
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setActiveUserId(newUser.id);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('users').upsert({
          id: newUser.id,
          email: newUser.email,
          password: newUser.password,
          name: newUser.name,
          roll_no: newUser.rollNo,
          branch: newUser.branch,
          year: newUser.year,
          avatar: newUser.avatar,
          bio: newUser.bio,
          credits: newUser.credits,
          reputation: newUser.reputation,
          skills_offered: newUser.skillsOffered,
          skills_wanted: newUser.skillsWanted,
          badges: newUser.badges
        });
      } catch (err) {
        console.warn('Cloud register insert error:', err);
      }
    }

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
  async saveSkillOffers(skills) {
    localStorage.setItem(KEYS.SKILLS, JSON.stringify(skills));
    this.notifySync();
    if (isSupabaseConfigured && supabase && skills.length > 0) {
      try {
        const latest = skills[0];
        await supabase.from('skills').upsert({
          id: latest.id,
          user_id: latest.authorId,
          user_name: latest.authorName,
          user_avatar: latest.authorAvatar,
          title: latest.skillOffered,
          category: latest.category,
          credits: latest.creditsRequired,
          description: latest.description
        });
      } catch (e) {
        console.warn('Cloud skill save error:', e);
      }
    }
  },

  // --- PROJECTS ---
  getProjects() {
    const data = localStorage.getItem(KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  },
  async saveProjects(projects) {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    this.notifySync();
    if (isSupabaseConfigured && supabase && projects.length > 0) {
      try {
        const latest = projects[0];
        await supabase.from('projects').upsert({
          id: latest.id,
          user_id: latest.leadId || 'usr-lead',
          owner: latest.leadName,
          title: latest.title,
          category: latest.category,
          description: latest.description,
          roles_needed: latest.rolesNeeded,
          tags: latest.tags
        });
      } catch (e) {
        console.warn('Cloud project save error:', e);
      }
    }
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
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(KEYS.CURRENT_USER_ID);
    }
    this.notifySync();
  },

  // --- CLOUD DATABASE (SUPABASE) FULL AUTOMATIC SYNC ---
  isCloudConnected() {
    return isSupabaseConfigured;
  },

  async syncFromCloud() {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { data: cloudUsers } = await supabase.from('users').select('*');
      if (cloudUsers && cloudUsers.length > 0) {
        const formattedUsers = cloudUsers.map(u => ({
          id: u.id,
          email: u.email,
          password: u.password || '',
          name: u.name || '',
          rollNo: u.roll_no || u.rollNo || '',
          branch: u.branch || '',
          year: u.year || '',
          avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name || 'user')}`,
          bio: u.bio || '',
          credits: u.credits ?? 200,
          reputation: u.reputation ?? 100,
          skillsOffered: u.skills_offered || u.skillsOffered || [],
          skillsWanted: u.skills_wanted || u.skillsWanted || [],
          badges: u.badges || ["PeerNexus Member"]
        }));

        this.saveUsers(formattedUsers);
      }

      const { data: skills } = await supabase.from('skills').select('*');
      if (skills && skills.length > 0) {
        const formattedSkills = skills.map(s => ({
          id: s.id,
          authorId: s.user_id,
          authorName: s.user_name || 'Member',
          authorAvatar: s.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.user_name || 'peer')}`,
          skillOffered: s.title,
          skillWanted: 'Tech Assistance',
          category: s.category || 'Machine Learning',
          description: s.description || '',
          creditsRequired: s.credits || 40,
          rating: 5.0,
          status: 'Online'
        }));
        this.saveSkillOffers(formattedSkills);
      }

      const { data: projects } = await supabase.from('projects').select('*');
      if (projects && projects.length > 0) {
        const formattedProjects = projects.map(p => ({
          id: p.id,
          leadId: p.user_id,
          leadName: p.owner || 'Project Lead',
          title: p.title,
          category: p.category || 'Full-Stack',
          description: p.description || '',
          rolesNeeded: p.roles_needed || [],
          tags: p.tags || ['React', 'Node.js'],
          deadline: 'Capstone Target',
          teamSize: '1 / 3 Members'
        }));
        this.saveProjects(formattedProjects);
      }

      return true;
    } catch (err) {
      console.warn('Cloud sync error:', err);
      return false;
    }
  }
};
