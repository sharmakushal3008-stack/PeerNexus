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
          reputation: Math.min(100, u.reputation + 3)
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
          skillsOffered: Array.from(new Set([...u.skillsOffered, newOffer.skillOffered]))
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    storageService.saveUsers(updatedUsers);

    showToast(`Skill offer "${newOffer.skillOffered}" published! Earned +50 Credits! 🎉`);
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

  // Send Direct Message (Pushed to Supabase Cloud)
  const handleSendMessage = async (msgObj) => {
    const updatedMessages = [...messages, msgObj];
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

  // AUTHENTICATED USER DASHBOARD
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
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
          notifications={tradeRequests.filter(t => t.receiverId === currentUser.id).map(t => ({
            id: t.id,
            title: 'Incoming Skill Trade Request',
            desc: `${t.senderName} requested ${t.skillOffered}`
          }))}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {activeTab === 'skills' && (
            <SkillExchange
              skillOffers={skillOffers}
              currentUser={currentUser}
              onTradeRequest={handleTradeRequest}
              onAddNewSkillOffer={handleAddNewSkillOffer}
              onOpenChat={(recipient) => setChatRecipient(recipient)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectCollaborator
              projects={projects}
              currentUser={currentUser}
              onApplyToRole={handleApplyToRole}
              onAddNewProject={handleAddNewProject}
              onOpenChat={(recipient) => setChatRecipient(recipient)}
              onAcceptApplicant={handleAcceptApplicant}
              onRejectApplicant={handleRejectApplicant}
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
              userProjects={projects.filter(p => p.leadId === currentUser.id || (p.leadName && p.leadName.includes(currentUser.name)))}
              onEditProfile={() => setIsEditProfileOpen(true)}
              onResetData={handleWipeData}
              onAcceptTradeRequest={handleAcceptTradeRequest}
              onDeclineTradeRequest={handleDeclineTradeRequest}
              onCompleteTrade={handleCompleteTrade}
              onOpenSessionRoom={(tradeObj) => setActiveSessionTrade(tradeObj)}
              onOpenChat={(recipient) => setChatRecipient(recipient)}
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
