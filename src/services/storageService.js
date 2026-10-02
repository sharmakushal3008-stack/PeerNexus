import { CAMPUS_RESOURCES, WORKSHOPS } from '../data/mockData.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

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

const syncListeners = new Set();

if (broadcastChannel) {
  broadcastChannel.onmessage = () => {
    syncListeners.forEach(cb => {
      try { cb(); } catch (e) {}
    });
  };
}

export const storageService = {
  // Listen for Cross-Device / Cross-Tab / Local State updates
  subscribeToSync(callback) {
    if (typeof window === 'undefined' || typeof callback !== 'function') return () => {};
    syncListeners.add(callback);

    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('cf_')) {
        callback();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      syncListeners.delete(callback);
      window.removeEventListener('storage', handleStorageChange);
    };
  },

  subscribeSync(callback) {
    return this.subscribeToSync(callback);
  },

  notifySync() {
    syncListeners.forEach(cb => {
      try { cb(); } catch (e) { console.warn('Sync listener err:', e); }
    });
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
      } catch (e) {}
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

  async saveUsers(users) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    this.notifySync();
    if (isSupabaseConfigured && supabase && users.length > 0) {
      try {
        const payload = users.map(u => ({
          id: u.id,
          email: u.email,
          password: u.password || '',
          name: u.name || '',
          roll_no: u.rollNo || '',
          branch: u.branch || '',
          year: u.year || '',
          avatar: u.avatar || '',
          bio: u.bio || '',
          credits: u.credits ?? 200,
          reputation: u.reputation ?? 100,
          skills_offered: u.skillsOffered || [],
          skills_wanted: u.skillsWanted || [],
          badges: u.badges || ["PeerNexus Member"]
        }));
        await supabase.from('users').upsert(payload);
      } catch (e) {
        console.warn('Cloud users save error:', e);
      }
    }
  },

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

    matchedUser = users.find(u => {
      const uId = (u.id || '').toLowerCase();
      const uEmail = (u.email || '').toLowerCase();
      const uName = (u.name || '').toLowerCase();
      const idMatch = (uId === cleanId || uEmail === cleanId || uName === cleanId);
      const passMatch = (u.password || '') === password;
      return idMatch && passMatch;
    });

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

  // Real Multi-Device Registration Method
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

    // Auto-create initial skill listing in marketplace if skills were provided
    if (newUser.skillsOffered && newUser.skillsOffered.length > 0) {
      const existingSkills = this.getSkillOffers();
      const initialListing = {
        id: `sk-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        authorId: newUser.id,
        authorName: newUser.name,
        authorAvatar: newUser.avatar,
        authorYear: newUser.year || 'Campus Student',
        skillOffered: newUser.skillsOffered.join(', '),
        skillWanted: (newUser.skillsWanted && newUser.skillsWanted.length > 0) ? newUser.skillsWanted.join(', ') : 'Peer Skill Exchange',
        category: 'Core Computer Science',
        description: `Dedicated hands-on peer mentorship and collaborative learning session for ${newUser.skillsOffered.join(', ')}.`,
        creditsRequired: 40,
        rating: 5.0,
        status: 'Online'
      };
      this.saveSkillOffers([initialListing, ...existingSkills]);
    }

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

  logoutUser() {
    this.setActiveUserId(null);
  },

  // --- SKILL OFFERS ---
  getSkillOffers() {
    const data = localStorage.getItem(KEYS.SKILLS);
    const skills = data ? JSON.parse(data) : [];
    const users = this.getUsers();
    const usersMap = {};
    users.forEach(u => { usersMap[u.id] = u; });

    return skills.map(s => {
      const author = usersMap[s.authorId];
      let skillOffered = s.skillOffered;
      let skillWanted = s.skillWanted;

      if (!skillOffered || skillOffered === 'Tech Assistance') {
        if (author?.skillsOffered && author.skillsOffered.length > 0) {
          skillOffered = author.skillsOffered.join(', ');
        }
      }

      if (!skillWanted || skillWanted === 'Tech Assistance' || skillWanted === 'Peer Skill Exchange') {
        if (author?.skillsWanted && author.skillsWanted.length > 0) {
          skillWanted = author.skillsWanted.join(', ');
        } else if (s.description && s.description.includes('[WANTS:')) {
          const match = s.description.match(/\[WANTS:(.*?)\]/);
          if (match) skillWanted = match[1].trim();
        }
      }

      return {
        ...s,
        skillOffered: skillOffered || 'General Engineering',
        skillWanted: skillWanted || s.skillWanted || 'Software Engineering'
      };
    });
  },
  async saveSkillOffers(skills) {
    localStorage.setItem(KEYS.SKILLS, JSON.stringify(skills));
    this.notifySync();
    if (isSupabaseConfigured && supabase && skills.length > 0) {
      try {
        const payload = skills.map(s => {
          const cleanDesc = (s.description || 'Dedicated hands-on peer mentorship and collaborative learning session.').replace(/^\[WANTS:.*?\]\s*/, '');
          return {
            id: s.id,
            user_id: s.authorId,
            user_name: s.authorName,
            user_avatar: s.authorAvatar,
            title: s.skillOffered,
            category: s.category || 'Core Computer Science',
            credits: s.creditsRequired || 40,
            description: `[WANTS:${s.skillWanted || 'Full-Stack Development'}] ${cleanDesc}`
          };
        });
        await supabase.from('skills').upsert(payload);
      } catch (e) {
        console.warn('Cloud skill save error:', e);
      }
    }
  },

  async deleteSkillOffer(skillId) {
    const data = localStorage.getItem(KEYS.SKILLS);
    const current = data ? JSON.parse(data) : [];
    const updated = current.filter(s => s.id !== skillId);
    localStorage.setItem(KEYS.SKILLS, JSON.stringify(updated));
    this.notifySync();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('skills').delete().eq('id', skillId);
      } catch (e) {
        console.warn('Cloud skill delete error:', e);
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
        const payload = projects.map(p => ({
          id: p.id,
          user_id: p.leadId || 'usr-lead',
          owner: p.leadName,
          title: p.title,
          category: p.category || 'IoT & Full-Stack',
          description: p.description || '',
          roles_needed: p.rolesNeeded || [],
          tags: p.tags || ['Engineering']
        }));
        await supabase.from('projects').upsert(payload);
      } catch (e) {
        console.warn('Cloud project save error:', e);
      }
    }
  },

  async deleteProject(projectId) {
    const data = localStorage.getItem(KEYS.PROJECTS);
    const current = data ? JSON.parse(data) : [];
    const updated = current.filter(p => p.id !== projectId);
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(updated));
    this.notifySync();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').delete().eq('id', projectId);
      } catch (e) {
        console.warn('Cloud project delete error:', e);
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

  // --- TRADES & ESCROW (SUPABASE CLOUD INTEGRATION) ---
  getTradeRequests() {
    const data = localStorage.getItem(KEYS.TRADES);
    return data ? JSON.parse(data) : [];
  },
  async saveTradeRequests(trades) {
    localStorage.setItem(KEYS.TRADES, JSON.stringify(trades));
    this.notifySync();
    if (isSupabaseConfigured && supabase) {
      try {
        if (trades.length > 0) {
          const payload = trades.map(t => ({
            id: t.id,
            sender_id: t.senderId,
            receiver_id: t.receiverId,
            skill_title: t.skillOffered,
            credits: t.creditsRequired,
            status: t.status
          }));
          await supabase.from('trades').upsert(payload);
        }
      } catch (e) {
        console.warn('Cloud trade save error:', e);
      }
    }
  },

  // --- DIRECT & TEAM MESSAGES (SUPABASE CLOUD INTEGRATION) ---
  getMessages() {
    const data = localStorage.getItem(KEYS.MESSAGES);
    if (!data) return [];
    try {
      return JSON.parse(data) || [];
    } catch (e) {
      return [];
    }
  },
  async saveMessages(messages) {
    if (!Array.isArray(messages)) return;
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
    this.notifySync();

    if (isSupabaseConfigured && supabase && messages.length > 0) {
      try {
        const latest = messages[messages.length - 1];
        if (!latest) return;

        let contentPayload = latest.text || latest.content || '';
        if (latest.teamRoomId) {
          contentPayload = `[TEAM:${latest.teamRoomId}|PID:${latest.projectId || ''}|NAME:${encodeURIComponent(latest.senderName || '')}|ROLE:${encodeURIComponent(latest.senderRole || '')}|TIME:${encodeURIComponent(latest.timestamp || '')}] ${latest.text || latest.content || ''}`;
        } else if (latest.receiverId) {
          contentPayload = `[DM:TO:${latest.receiverId}|FROM:${latest.senderId}|NAME:${encodeURIComponent(latest.senderName || '')}|TIME:${encodeURIComponent(latest.timestamp || '')}] ${latest.text || latest.content || ''}`;
        }

        await supabase.from('messages').upsert({
          id: latest.id || `msg-${Date.now()}`,
          sender_id: latest.senderId || 'usr-anon',
          receiver_id: latest.receiverId || latest.senderId || 'usr-anon',
          content: contentPayload
        });
      } catch (e) {
        console.warn('Cloud message save error:', e);
      }
    }
  },

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
      const localUsers = this.getUsers();
      const localSkills = this.getSkillOffers();
      const localProjects = this.getProjects();
      const localTrades = this.getTradeRequests();
      const localMessages = this.getMessages();

      // 1. Sync & Merge Users
      const { data: cloudUsers, error: usersErr } = await supabase.from('users').select('*');
      let usersMap = {};

      if (!usersErr && cloudUsers) {
        const cloudUsersMap = {};
        cloudUsers.forEach(u => {
          cloudUsersMap[u.id] = {
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
          };
        });

        // Push any locally created users not yet in cloud
        const missingInCloud = localUsers.filter(lu => !cloudUsersMap[lu.id]);
        if (missingInCloud.length > 0) {
          const payload = missingInCloud.map(u => ({
            id: u.id,
            email: u.email,
            password: u.password || '',
            name: u.name || '',
            roll_no: u.rollNo || '',
            branch: u.branch || '',
            year: u.year || '',
            avatar: u.avatar || '',
            bio: u.bio || '',
            credits: u.credits ?? 200,
            reputation: u.reputation ?? 100,
            skills_offered: u.skillsOffered || [],
            skills_wanted: u.skillsWanted || [],
            badges: u.badges || ["PeerNexus Member"]
          }));
          await supabase.from('users').upsert(payload);
          missingInCloud.forEach(u => { cloudUsersMap[u.id] = u; });
        }

        const mergedUsers = Object.values(cloudUsersMap);
        mergedUsers.forEach(u => { usersMap[u.id] = u; });
        localStorage.setItem(KEYS.USERS, JSON.stringify(mergedUsers));
      }

      // 2. Sync & Merge Skill Offers
      const { data: cloudSkills, error: skillsErr } = await supabase.from('skills').select('*');
      if (!skillsErr && cloudSkills) {
        const cloudSkillsMap = {};
        const localSkills = this.getSkillOffers();
        const localSkillsMap = {};
        localSkills.forEach(ls => { localSkillsMap[ls.id] = ls; });

        cloudSkills.forEach(s => {
          const author = usersMap[s.user_id];
          const localSkill = localSkillsMap[s.id];

          // Determine best skillOffered
          let skillOffered = s.title || localSkill?.skillOffered;
          if (!skillOffered || skillOffered === 'Tech Assistance') {
            if (author?.skillsOffered && author.skillsOffered.length > 0) {
              skillOffered = author.skillsOffered.join(', ');
            } else {
              skillOffered = 'Computer Science & Engineering';
            }
          }

          // Parse metadata from cloud description
          let parsedWanted = null;
          let cleanDesc = s.description || '';
          if (s.description && s.description.includes('[WANTS:')) {
            const match = s.description.match(/\[WANTS:(.*?)\]\s*(.*)$/s);
            if (match) {
              parsedWanted = match[1].trim();
              cleanDesc = match[2].trim();
            }
          }

          // Determine best skillWanted
          let skillWanted = parsedWanted || s.skill_wanted || localSkill?.skillWanted;
          if (!skillWanted || skillWanted === 'Tech Assistance' || skillWanted === 'Peer Skill Exchange') {
            if (author?.skillsWanted && author.skillsWanted.length > 0) {
              skillWanted = author.skillsWanted.join(', ');
            } else if (localSkill?.skillWanted && localSkill.skillWanted !== 'Tech Assistance' && localSkill.skillWanted !== 'Peer Skill Exchange') {
              skillWanted = localSkill.skillWanted;
            } else {
              skillWanted = skillWanted || 'Full-Stack Development';
            }
          }

          cloudSkillsMap[s.id] = {
            id: s.id,
            authorId: s.user_id,
            authorName: s.user_name || (author ? author.name : 'Member'),
            authorAvatar: s.user_avatar || (author ? author.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.user_name || 'peer')}`),
            authorYear: author?.year || localSkill?.authorYear || 'Campus Student',
            skillOffered: skillOffered,
            skillWanted: skillWanted,
            category: s.category || localSkill?.category || 'Core Computer Science',
            description: cleanDesc || localSkill?.description || `Dedicated hands-on peer mentorship session for ${skillOffered}.`,
            creditsRequired: s.credits || localSkill?.creditsRequired || 40,
            rating: 5.0,
            status: 'Online'
          };
        });

        // Push any locally created skills not yet in cloud
        const missingSkillsInCloud = localSkills.filter(ls => !cloudSkillsMap[ls.id]);
        if (missingSkillsInCloud.length > 0) {
          const payload = missingSkillsInCloud.map(s => {
            const cleanDesc = (s.description || 'Dedicated hands-on peer mentorship and collaborative learning session.').replace(/^\[WANTS:.*?\]\s*/, '');
            return {
              id: s.id,
              user_id: s.authorId,
              user_name: s.authorName,
              user_avatar: s.authorAvatar,
              title: s.skillOffered,
              category: s.category || 'Core Computer Science',
              credits: s.creditsRequired || 40,
              description: `[WANTS:${s.skillWanted || 'Full-Stack Development'}] ${cleanDesc}`
            };
          });
          await supabase.from('skills').upsert(payload);
          missingSkillsInCloud.forEach(s => { cloudSkillsMap[s.id] = s; });
        }

        const mergedSkills = Object.values(cloudSkillsMap);
        localStorage.setItem(KEYS.SKILLS, JSON.stringify(mergedSkills));
      }

      // 3. Sync Projects
      const { data: cloudProjects, error: projErr } = await supabase.from('projects').select('*');
      if (!projErr && cloudProjects) {
        const cloudProjectsMap = {};
        cloudProjects.forEach(p => {
          cloudProjectsMap[p.id] = {
            id: p.id,
            leadId: p.user_id,
            leadName: p.owner || (usersMap[p.user_id] ? usersMap[p.user_id].name : 'Project Lead'),
            leadAvatar: (usersMap[p.user_id] ? usersMap[p.user_id].avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.owner || 'lead')}`),
            title: p.title,
            category: p.category || 'Full-Stack',
            description: p.description || '',
            rolesNeeded: p.roles_needed || [],
            tags: p.tags || ['React', 'Node.js'],
            deadline: 'Capstone Target',
            teamSize: `${1 + (p.roles_needed ? p.roles_needed.filter(r => r.status === 'Filled').length : 0)} / ${(p.roles_needed ? p.roles_needed.length : 0) + 1} Member${((p.roles_needed ? p.roles_needed.length : 0) + 1) > 1 ? 's' : ''}`
          };
        });

        const missingProjInCloud = localProjects.filter(lp => !cloudProjectsMap[lp.id]);
        if (missingProjInCloud.length > 0) {
          const payload = missingProjInCloud.map(p => ({
            id: p.id,
            user_id: p.leadId || 'usr-lead',
            owner: p.leadName,
            title: p.title,
            category: p.category,
            description: p.description,
            roles_needed: p.rolesNeeded,
            tags: p.tags
          }));
          await supabase.from('projects').upsert(payload);
          missingProjInCloud.forEach(p => { cloudProjectsMap[p.id] = p; });
        }

        localStorage.setItem(KEYS.PROJECTS, JSON.stringify(Object.values(cloudProjectsMap)));
      }

      // 4. Sync Trades
      const { data: cloudTrades, error: tradesErr } = await supabase.from('trades').select('*');
      if (!tradesErr && cloudTrades) {
        const formattedTrades = cloudTrades.map(t => ({
          id: t.id,
          senderId: t.sender_id,
          senderName: usersMap[t.sender_id] ? usersMap[t.sender_id].name : 'Peer Sender',
          receiverId: t.receiver_id,
          receiverName: usersMap[t.receiver_id] ? usersMap[t.receiver_id].name : 'Peer Receiver',
          skillOffered: t.skill_title || 'Skill Barter',
          creditsRequired: t.credits || 40,
          status: t.status || 'Pending Escrow',
          createdAt: t.created_at || new Date().toISOString()
        }));
        localStorage.setItem(KEYS.TRADES, JSON.stringify(formattedTrades));
      }

      // 5. Sync Messages
      const { data: cloudMessages, error: msgErr } = await supabase.from('messages').select('*');
      if (!msgErr && cloudMessages) {
        const localMessages = this.getMessages();
        const localMessagesMap = {};
        localMessages.forEach(lm => { localMessagesMap[lm.id] = lm; });

        const formattedMessages = cloudMessages.map(m => {
          const localMsg = localMessagesMap[m.id];
          let teamRoomId = localMsg?.teamRoomId;
          let projectId = localMsg?.projectId;
          let receiverId = m.receiver_id === m.sender_id ? null : m.receiver_id;
          let senderName = localMsg?.senderName || (usersMap[m.sender_id] ? usersMap[m.sender_id].name : 'Peer Member');
          let senderRole = localMsg?.senderRole || 'Team Member';
          let timestamp = localMsg?.timestamp || m.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          let text = m.content || '';

          // Parse [TEAM:...] format
          if (text.startsWith('[TEAM:')) {
            const teamMatch = text.match(/^\[TEAM:(.*?)\]\s*(.*)$/s);
            if (teamMatch) {
              const metaPart = teamMatch[1];
              text = teamMatch[2].trim();

              if (metaPart.includes('|')) {
                const parts = metaPart.split('|');
                teamRoomId = parts[0];
                parts.slice(1).forEach(p => {
                  if (p.startsWith('PID:')) projectId = p.replace('PID:', '');
                  if (p.startsWith('NAME:')) senderName = decodeURIComponent(p.replace('NAME:', ''));
                  if (p.startsWith('ROLE:')) senderRole = decodeURIComponent(p.replace('ROLE:', ''));
                  if (p.startsWith('TIME:')) timestamp = decodeURIComponent(p.replace('TIME:', ''));
                });
              } else {
                teamRoomId = metaPart.trim();
              }
            }
          }
          // Parse [DM:...] format
          else if (text.startsWith('[DM:')) {
            const dmMatch = text.match(/^\[DM:(.*?)\]\s*(.*)$/s);
            if (dmMatch) {
              const metaPart = dmMatch[1];
              text = dmMatch[2].trim();

              metaPart.split('|').forEach(p => {
                if (p.startsWith('TO:')) receiverId = p.replace('TO:', '');
                if (p.startsWith('NAME:')) senderName = decodeURIComponent(p.replace('NAME:', ''));
                if (p.startsWith('TIME:')) timestamp = decodeURIComponent(p.replace('TIME:', ''));
              });
            }
          }

          return {
            id: m.id,
            senderId: m.sender_id,
            senderName: senderName,
            senderAvatar: localMsg?.senderAvatar || (usersMap[m.sender_id] ? usersMap[m.sender_id].avatar : ''),
            senderRole: senderRole,
            receiverId: receiverId || localMsg?.receiverId,
            teamRoomId: teamRoomId || localMsg?.teamRoomId,
            projectId: projectId || localMsg?.projectId,
            projectTitle: localMsg?.projectTitle,
            text: text,
            timestamp: timestamp
          };
        });

        // Retain any team messages or local messages not yet returned by cloud
        const cloudIds = new Set(cloudMessages.map(cm => cm.id));
        const missingInCloud = localMessages.filter(lm => !cloudIds.has(lm.id));
        const combinedMessages = [...formattedMessages, ...missingInCloud];

        localStorage.setItem(KEYS.MESSAGES, JSON.stringify(combinedMessages));
      }

      this.notifySync();
      return true;
    } catch (err) {
      console.warn('Cloud sync error:', err);
      return false;
    }
  }
};
