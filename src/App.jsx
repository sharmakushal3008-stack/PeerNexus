import React, { useState, useEffect } from 'react';
import SidebarNav from './components/SidebarNav';
import HeaderBar from './components/HeaderBar';
import SkillExchange from './components/SkillExchange';
import ProjectCollaborator from './components/ProjectCollaborator';
import MatchingEngine from './components/MatchingEngine';
import ResourceBooking from './components/ResourceBooking';
import ProfileDashboard from './components/ProfileDashboard';
import AIAdvisorModal from './components/AIAdvisorModal';
import DirectChatDrawer from './components/DirectChatDrawer';
import EditProfileModal from './components/EditProfileModal';
import AuthView from './components/AuthView';
import LandingPage from './components/LandingPage';
import ActiveSessionRoomModal from './components/ActiveSessionRoomModal';

import { storageService } from './services/storageService';

export default function App() {
  const [activeTab, setActiveTab] = useState('skills');
  const [showAuth, setShowAuth] = useState(false);
  
  // Persistent Multi-User Shared Tables & Session State
  const [users, setUsers] = useState(() => storageService.getUsers());
  const [activeUserId, setActiveUserId] = useState(() => storageService.getActiveUserId());
  
  const [skillOffers, setSkillOffers] = useState(() => storageService.getSkillOffers());
  const [projects, setProjects] = useState(() => storageService.getProjects());
  const [tradeRequests, setTradeRequests] = useState(() => storageService.getTradeRequests());
  const [messages, setMessages] = useState(() => storageService.getMessages());

  // Modals & Active Room State
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [activeSessionTrade, setActiveSessionTrade] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Derived Active User Object
  const currentUser = users.find(u => u.id === activeUserId);

  // Auto-sync from Supabase Cloud on App Startup & Live 3s Polling for Peer-to-Peer Updates
  useEffect(() => {
    async function doCloudSync() {
      await storageService.syncFromCloud();
      setUsers(storageService.getUsers());
      setActiveUserId(storageService.getActiveUserId());
      setSkillOffers(storageService.getSkillOffers());
      setProjects(storageService.getProjects());
      setTradeRequests(storageService.getTradeRequests());
      setMessages(storageService.getMessages());
    }

    doCloudSync();

    // Live background polling interval (3 seconds) so peers receive requests across devices
    const interval = setInterval(() => {
      doCloudSync();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Real-Time Cross-Tab / Cross-Window Sync Listener
  useEffect(() => {
    const unsubscribe = storageService.subscribeToSync(() => {
      setUsers(storageService.getUsers());
      setActiveUserId(storageService.getActiveUserId());
      setSkillOffers(storageService.getSkillOffers());
      setProjects(storageService.getProjects());
      setTradeRequests(storageService.getTradeRequests());
      setMessages(storageService.getMessages());
    });
    return unsubscribe;
  }, []);

  // Sync to storage on local state change
  useEffect(() => { storageService.saveUsers(users); }, [users]);
  useEffect(() => { storageService.setActiveUserId(activeUserId); }, [activeUserId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real Async Login Handler
  const handleLoginSuccess = async (identifier, password) => {
    const loggedUser = await storageService.loginUser(identifier, password);
    setUsers(storageService.getUsers());
    setActiveUserId(loggedUser.id);
    showToast(`Welcome back, ${loggedUser.name}! 👋`);
  };

  // Real Async Registration Handler
  const handleRegisterSuccess = async (newUserData) => {
    const newUser = await storageService.registerUser(newUserData);
    setUsers(storageService.getUsers());
    setActiveUserId(newUser.id);
    showToast(`Welcome to PeerNexus, ${newUser.name}! (ID: ${newUser.id}) 🎉`);
  };

  // Real Logout Handler
  const handleLogout = () => {
    storageService.logoutUser();
    setActiveUserId(null);
    setShowAuth(false);
    showToast(`Logged out successfully.`);
  };

  // Send Trade Request to Peer (Pushed to Supabase Cloud)
  const handleTradeRequest = async (skillOffer) => {
    if (!currentUser) return;
    const newTradeRequest = {
      id: `trd-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: skillOffer.authorId,
      receiverName: skillOffer.authorName,
      skillId: skillOffer.id,
      skillOffered: skillOffer.skillOffered,
      creditsRequired: skillOffer.creditsRequired,
      status: 'Pending Escrow',
      createdAt: new Date().toISOString()
    };

    const updatedTrades = [newTradeRequest, ...tradeRequests];
    setTradeRequests(updatedTrades);
    await storageService.saveTradeRequests(updatedTrades);

    // Hold credits in escrow for current user
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, credits: Math.max(0, u.credits - skillOffer.creditsRequired) };
      }
      return u;
    });
    setUsers(updatedUsers);
    storageService.saveUsers(updatedUsers);

    showToast(`Request sent to peer! Locked ${skillOffer.creditsRequired} Cr in Escrow.`);
  };

  // Accept Trade Request (Pushed to Supabase Cloud)
  const handleAcceptTradeRequest = async (tradeId) => {
    const updatedTrades = tradeRequests.map(t => {
      if (t.id === tradeId) return { ...t, status: 'Accepted' };
      return t;
    });
    setTradeRequests(updatedTrades);
    await storageService.saveTradeRequests(updatedTrades);
    showToast(`Accepted trade request! Session room is active.`);
  };

  // Decline Trade Request (Pushed to Supabase Cloud)
  const handleDeclineTradeRequest = async (tradeId) => {
    const trd = tradeRequests.find(t => t.id === tradeId);
    if (trd) {
      const updatedUsers = users.map(u => {
        if (u.id === trd.senderId) return { ...u, credits: u.credits + trd.creditsRequired };
        return u;
      });
      setUsers(updatedUsers);
      storageService.saveUsers(updatedUsers);
    }
    const updatedTrades = tradeRequests.filter(t => t.id !== tradeId);
    setTradeRequests(updatedTrades);
    await storageService.saveTradeRequests(updatedTrades);
    showToast(`Trade request declined & escrow refunded.`);
  };

  // Complete Trade Session & Transfer Credits (Pushed to Supabase Cloud)
  const handleCompleteTrade = async (tradeObj, rating = 5) => {
    const updatedTrades = tradeRequests.map(t => {
      if (t.id === tradeObj.id) return { ...t, status: 'Completed' };
      return t;
    });
    setTradeRequests(updatedTrades);
    await storageService.saveTradeRequests(updatedTrades);
    setActiveSessionTrade(null);

    const updatedUsers = users.map(u => {
      if (u.id === tradeObj.receiverId) {
        return {
          ...u,
          credits: u.credits + tradeObj.creditsRequired,
          reputation: Math.min(100, u.reputation + 3),
          completedTrades: (u.completedTrades || 0) + 1
        };
      }
      if (u.id === tradeObj.senderId) {
        return {
          ...u,
          completedTrades: (u.completedTrades || 0) + 1
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    await storageService.saveUsers(updatedUsers);

    showToast(`Session completed! ${tradeObj.creditsRequired} Cr released to recipient.`);
  };

  // Post Skill Offer (Pushed to Supabase Cloud)
  const handleAddNewSkillOffer = async (newOffer) => {
    if (!currentUser) return;
    const updatedSkills = [newOffer, ...skillOffers];
    setSkillOffers(updatedSkills);
    await storageService.saveSkillOffers(updatedSkills);

    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          credits: u.credits + 50,
          skillsOffered: Array.from(new Set([...(u.skillsOffered || []), newOffer.skillOffered])),
          skillsWanted: Array.from(new Set([...(u.skillsWanted || []), newOffer.skillWanted]))
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    await storageService.saveUsers(updatedUsers);

    showToast(`Skill offer "${newOffer.skillOffered}" published! Earned +50 Credits! 🎉`);
  };

  // Delete / Withdraw Skill Offer
  const handleDeleteSkillOffer = async (skillId) => {
    const updatedSkills = skillOffers.filter(s => s.id !== skillId);
    setSkillOffers(updatedSkills);
    await storageService.deleteSkillOffer(skillId);
    showToast(`Skill listing removed from campus marketplace.`);
  };

  // Apply to Project Role (Pushed to Supabase Cloud)
  const handleApplyToRole = async (project, roleName) => {
    if (!currentUser) return;
    const newApplicant = {
      id: `app-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      roleApplied: roleName,
      matchScore: 94,
      skills: currentUser.skillsOffered
    };

    const updatedProjects = projects.map(p => {
      if (p.id === project.id) {
        return { ...p, applicants: [...(p.applicants || []), newApplicant] };
      }
      return p;
    });

    setProjects(updatedProjects);
    await storageService.saveProjects(updatedProjects);

    showToast(`Applied for ${roleName} in project "${project.title}"!`);
  };

  // Accept Project Applicant
  const handleAcceptApplicant = async (projectId, applicantObj) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedRoles = p.rolesNeeded.map(r => r.role === applicantObj.roleApplied ? { ...r, status: 'Filled' } : r);
        const updatedApplicants = p.applicants.filter(a => a.id !== applicantObj.id);
        return { ...p, rolesNeeded: updatedRoles, applicants: updatedApplicants };
      }
      return p;
    });
    setProjects(updatedProjects);
    await storageService.saveProjects(updatedProjects);

    showToast(`Accepted ${applicantObj.studentName} onto the project team!`);
  };

  // Reject Project Applicant
  const handleRejectApplicant = async (projectId, applicantId) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, applicants: p.applicants.filter(a => a.id !== applicantId) };
      }
      return p;
    });
    setProjects(updatedProjects);
    await storageService.saveProjects(updatedProjects);

    showToast(`Applicant declined.`);
  };

  // Post New Project (Pushed to Supabase Cloud)
  const handleAddNewProject = async (newProj) => {
    if (!currentUser) return;
    const updatedProjects = [{ ...newProj, leadId: currentUser.id }, ...projects];
    setProjects(updatedProjects);
    await storageService.saveProjects(updatedProjects);

    showToast(`Project "${newProj.title}" published!`);
  };

  // Delete / Withdraw Project (Pushed to Supabase Cloud)
  const handleDeleteProject = async (projectId) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    await storageService.deleteProject(projectId);
    showToast(`Project listing removed.`);
  };

  // Send Direct Message or Team Broadcast (Pushed to Supabase Cloud)
  const handleSendMessage = async (msgObj) => {
    if (!msgObj) return;
    const currentMsgs = storageService.getMessages();
    const updatedMessages = [...currentMsgs.filter(m => m.id !== msgObj.id), msgObj];
    setMessages(updatedMessages);
    await storageService.saveMessages(updatedMessages);
  };

  // Reset Storage
  const handleWipeData = () => {
    storageService.wipeData();
    setUsers([]);
    setActiveUserId(null);
    setSkillOffers([]);
    setProjects([]);
    setTradeRequests([]);
    setMessages([]);
    showToast(`Cleared database!`);
  };

  // Dismissed / Read notification IDs per user
  const [dismissedNotifIds, setDismissedNotifIds] = useState(() => {
    try {
      const activeId = storageService.getActiveUserId();
      const saved = localStorage.getItem(`cf_dismissed_notifs_${activeId || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Whenever currentUser changes, load their dismissed notification IDs
  useEffect(() => {
    if (currentUser?.id) {
      try {
        const saved = localStorage.getItem(`cf_dismissed_notifs_${currentUser.id}`);
        setDismissedNotifIds(saved ? JSON.parse(saved) : []);
      } catch {
        setDismissedNotifIds([]);
      }
    }
  }, [currentUser?.id]);

  const handleDismissNotification = (notifId) => {
    if (!currentUser) return;
    setDismissedNotifIds(prev => {
      const updated = Array.from(new Set([...prev, notifId]));
      try {
        localStorage.setItem(`cf_dismissed_notifs_${currentUser.id}`, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist dismissed notification', e);
      }
      return updated;
    });
  };

  // Compute Real-Time Notifications list for currentUser
  const rawUserNotifications = currentUser ? [
    // 1. Incoming Pending Escrow Requests
    ...tradeRequests
      .filter(t => t.receiverId === currentUser.id && t.status === 'Pending Escrow')
      .map(t => ({
        id: `notif-req-${t.id}`,
        type: 'INCOMING_REQUEST',
        title: '⚡ Incoming Skill Trade Request',
        desc: `${t.senderName} requested to barter: ${t.skillOffered} (${t.creditsRequired} Cr)`,
        timestamp: 'Action Needed',
        trade: t
      })),

    // 2. Accepted Trade Requests (Sender notified when receiver accepts)
    ...tradeRequests
      .filter(t => t.senderId === currentUser.id && t.status === 'Accepted')
      .map(t => ({
        id: `notif-acc-${t.id}`,
        type: 'ACCEPTED_REQUEST',
        title: '✅ Trade Request Accepted!',
        desc: `${t.receiverName || 'Peer'} accepted your request for ${t.skillOffered}. Click to enter live room!`,
        timestamp: 'Live Room Ready',
        trade: t
      })),

    // 3. Completed Trade Requests
    ...tradeRequests
      .filter(t => (t.senderId === currentUser.id || t.receiverId === currentUser.id) && t.status === 'Completed')
      .map(t => ({
        id: `notif-comp-${t.id}`,
        type: 'COMPLETED_REQUEST',
        title: '🎉 Session Completed',
        desc: `Session for ${t.skillOffered} completed. Escrow released!`,
        timestamp: 'Completed',
        trade: t
      })),

    // 4. Messages sent to currentUser
    ...messages
      .filter(m => m.receiverId === currentUser.id)
      .slice(-3)
      .map(m => ({
        id: `notif-msg-${m.id}`,
        type: 'MESSAGE',
        title: `💬 Message from ${m.senderName}`,
        desc: m.text,
        timestamp: m.timestamp || 'Recent',
        senderId: m.senderId
      }))
  ] : [];

  const userNotifications = rawUserNotifications.filter(n => !dismissedNotifIds.includes(n.id));

  const handleClearAllNotifications = () => {
    if (!currentUser || rawUserNotifications.length === 0) return;
    const allIds = rawUserNotifications.map(n => n.id);
    setDismissedNotifIds(prev => {
      const updated = Array.from(new Set([...prev, ...allIds]));
      try {
        localStorage.setItem(`cf_dismissed_notifs_${currentUser.id}`, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist dismissed notifications', e);
      }
      return updated;
    });
    showToast('All notifications cleared');
  };

  const handleNotificationClick = (notif) => {
    // Automatically clear notification when opened/clicked
    handleDismissNotification(notif.id);

    if (notif.trade) {
      if (notif.trade.status === 'Accepted') {
        setActiveSessionTrade(notif.trade);
      } else {
        setActiveTab('profile');
      }
    } else if (notif.senderId) {
      const sender = users.find(u => u.id === notif.senderId);
      if (sender) setChatRecipient(sender);
    }
  };

  // UNAUTHENTICATED VISITOR VIEW: LANDING PAGE OR AUTH MODAL
  if (!currentUser) {
    if (showAuth) {
      return (
        <AuthView
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          onBackToLanding={() => setShowAuth(false)}
        />
      );
    }

    return (
      <LandingPage
        onGetStarted={() => setShowAuth(true)}
        onOpenLogin={() => setShowAuth(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <HeaderBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
          onLogout={handleLogout}
          notifications={userNotifications}
          onNotificationClick={handleNotificationClick}
          onClearNotification={handleDismissNotification}
          onClearAllNotifications={handleClearAllNotifications}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {activeTab === 'skills' && (
            <SkillExchange
              skillOffers={skillOffers}
              currentUser={currentUser}
              onTradeRequest={handleTradeRequest}
              onAddNewSkillOffer={handleAddNewSkillOffer}
              onDeleteSkillOffer={handleDeleteSkillOffer}
              onOpenChat={(recipient) => setChatRecipient(recipient)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectCollaborator
              projects={projects}
              currentUser={currentUser}
              onApplyToRole={handleApplyToRole}
              onAddNewProject={handleAddNewProject}
              onDeleteProject={handleDeleteProject}
              onOpenChat={(recipient) => setChatRecipient(recipient)}
              onAcceptApplicant={handleAcceptApplicant}
              onRejectApplicant={handleRejectApplicant}
              onSendMessage={handleSendMessage}
              messages={messages}
            />
          )}

          {activeTab === 'matching' && (
            <MatchingEngine
              currentUser={currentUser}
              skillOffers={skillOffers}
            />
          )}

          {activeTab === 'resources' && (
            <ResourceBooking
              resources={storageService.getResources()}
              workshops={storageService.getWorkshops()}
              onBookResource={(r, slot) => showToast(`Reserved ${r.name} for ${slot}!`)}
              onRegisterWorkshop={(w) => showToast(`Registered for "${w.title}"!`)}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileDashboard
              currentUser={currentUser}
              tradeRequests={tradeRequests}
              skillOffers={skillOffers}
              userProjects={projects.filter(p => {
                const cleanLead = (p.leadName || '').replace(/\s*\(You\)/gi, '').trim();
                return (p.leadId && currentUser && p.leadId === currentUser.id) || (currentUser?.name && cleanLead.toLowerCase() === currentUser.name.toLowerCase());
              })}
              onEditProfile={() => setIsEditProfileOpen(true)}
              onResetData={handleWipeData}
              onAcceptTradeRequest={handleAcceptTradeRequest}
              onDeclineTradeRequest={handleDeclineTradeRequest}
              onCompleteTrade={handleCompleteTrade}
              onOpenSessionRoom={(tradeObj) => setActiveSessionTrade(tradeObj)}
              onOpenChat={(recipient) => setChatRecipient(recipient)}
              onDeleteSkillOffer={handleDeleteSkillOffer}
            />
          )}

        </main>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(updatedUser) => {
          setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
          showToast(`Profile changes saved!`);
        }}
      />

      {/* AI Advisor Modal */}
      <AIAdvisorModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        currentUser={currentUser}
      />

      {/* Direct Chat Drawer */}
      <DirectChatDrawer
        isOpen={!!chatRecipient}
        onClose={() => setChatRecipient(null)}
        currentUser={currentUser}
        recipient={chatRecipient}
        allMessages={messages}
        onSendMessage={handleSendMessage}
      />

      {/* Active Session Room Modal (Live Video, Scratchpad & Chat) */}
      <ActiveSessionRoomModal
        isOpen={!!activeSessionTrade}
        onClose={() => setActiveSessionTrade(null)}
        trade={activeSessionTrade}
        currentUser={currentUser}
        messages={messages}
        onSendMessage={handleSendMessage}
        onCompleteTrade={handleCompleteTrade}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-cyan-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-bounce">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
