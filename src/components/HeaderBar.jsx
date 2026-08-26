import React, { useState } from 'react';
import { 
  Bell, 
  Coins, 
  Sparkles, 
  Menu, 
  X, 
  LogOut
} from 'lucide-react';

export default function HeaderBar({ activeTab, setActiveTab, currentUser, onOpenAIAdvisor, onLogout, notifications = [] }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/90 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Mobile Menu Toggle + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div>
            <h1 className="text-base font-extrabold text-white capitalize flex items-center gap-2">
              {activeTab === 'skills' && 'Skill Barter Marketplace'}
              {activeTab === 'projects' && 'Capstone & Hackathon Collaborator Hub'}
              {activeTab === 'matching' && 'Algorithm Compatibility Inspector'}
              {activeTab === 'resources' && 'Campus Labs & Workstation Booking'}
              {activeTab === 'profile' && 'Student Portfolio & Inbox'}
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">PeerNexus Platform • Logged in as <strong className="text-slate-200">{currentUser.name}</strong> (<span className="font-mono text-cyan-300">ID: {currentUser.id}</span>)</p>
          </div>
        </div>

        {/* Right Action Widgets */}
        <div className="flex items-center gap-3">
          
          {/* AI Advisor Badge Pill */}
          <button
            onClick={onOpenAIAdvisor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 text-purple-300 border border-purple-500/40 hover:bg-purple-900/60 text-xs font-semibold transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">AI Mentor</span>
          </button>

          {/* Credit Balance Pill */}
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Coins className="h-4 w-4 text-amber-400" />
            <span>{currentUser.credits}</span>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl relative transition"
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>

            {/* Notifications Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 z-50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white">Campus Inbox Notifications</span>
                </div>

                <div className="space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-xs text-slate-500 text-center py-4">No unread notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                        <div className="font-bold text-slate-200">{n.title}</div>
                        <div className="text-[11px] text-slate-400">{n.desc}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Log Out Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 text-xs font-semibold transition"
            title="Log Out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden pt-3 border-t border-slate-800 mt-3 flex flex-col gap-2">
          {['skills', 'projects', 'matching', 'resources', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-xs font-semibold text-left capitalize ${
                activeTab === tab ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white' : 'bg-slate-900 text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

    </header>
  );
}
