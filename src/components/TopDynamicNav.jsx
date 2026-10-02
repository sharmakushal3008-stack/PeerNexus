import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Repeat, 
  Users, 
  Cpu, 
  Calendar, 
  User, 
  Coins, 
  Sparkles, 
  Search, 
  Bell, 
  LogOut, 
  CheckCheck, 
  Trash2, 
  ChevronDown, 
  Layers,
  X,
  Radio,
  Command,
  Flame,
  Award
} from 'lucide-react';

export default function TopDynamicNav({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAIAdvisor,
  onOpenCommandPalette,
  onLogout,
  notifications = [],
  onClearNotification,
  onClearAllNotifications,
  onNotificationClick
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navItems = [
    { id: 'skills', label: 'Skill Barter', icon: Repeat, desc: 'Mentorship', shortcut: '⌘1' },
    { id: 'projects', label: 'Capstone Hub', icon: Users, desc: 'Team Rooms', badge: 'Hot', shortcut: '⌘2' },
    { id: 'matching', label: 'CS Inspector', icon: Cpu, desc: 'Algorithm Viva', badge: 'Viva', shortcut: '⌘3' },
    { id: 'resources', label: 'GPU & Labs', icon: Calendar, desc: 'Workstations', shortcut: '⌘4' },
    { id: 'profile', label: 'Portfolio', icon: User, desc: 'Reputation & Vault', shortcut: '⌘5' }
  ];

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto glass-dock rounded-2xl p-2 sm:px-4 flex items-center justify-between gap-3 transition-all">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div 
            onClick={() => setActiveTab('skills')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  PeerNexus
                </span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-md bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Smart Campus Platform</p>
            </div>
          </div>
        </div>

        {/* Center: Dynamic Island Navigation Pills */}
        <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
                title={`${item.label} (${item.shortcut})`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>

                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                    isActive 
                      ? 'bg-white/25 text-white' 
                      : item.badge === 'Hot' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Command HUD, AI Mentor, Live Pulse, Wallet & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Quick Command Palette HUD Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-indigo-500/40 text-xs font-medium transition shadow-inner"
            title="Press Ctrl+K or ⌘K to open command search"
          >
            <Search className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-[11px] text-slate-400">Search</span>
            <kbd className="text-[9px] bg-slate-900 font-mono px-1.5 py-0.5 rounded border border-slate-700 text-purple-300 font-bold">⌘K</kbd>
          </button>

          {/* AI Capstone Mentor Quick Button */}
          <button
            onClick={onOpenAIAdvisor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-950/80 to-indigo-950/80 hover:from-purple-900 hover:to-indigo-900 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-400/60 text-xs font-bold transition shadow-sm"
            title="Open AI Capstone Mentor"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">AI Mentor</span>
          </button>

          {/* Live Campus Pulse Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-300">14 Live Peers</span>
          </div>

          {/* Credits Wallet Chip */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-amber-600/10 hover:from-amber-500/20 hover:to-amber-600/20 border border-amber-500/30 px-2.5 py-1.5 rounded-xl text-xs font-black text-amber-300 cursor-pointer transition shadow-sm"
            title="Your Campus Barter Credits"
          >
            <Coins className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
            <span>{currentUser.credits}</span>
            <span className="text-[9px] text-amber-400/80 font-normal">Cr</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition relative"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-pink-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-100">
                    <Bell className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Campus Activity Notifications</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono">
                      {notifications.length}
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearAllNotifications}
                      className="text-[10px] text-slate-400 hover:text-red-400 transition"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      You're all caught up! No new notifications.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onNotificationClick?.(n);
                          setShowNotifications(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500/40 transition cursor-pointer flex items-start justify-between gap-2 text-xs group"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-bold text-slate-200 group-hover:text-cyan-300 transition truncate">
                            {n.title}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug">{n.desc}</p>
                          <span className="text-[9px] text-slate-500 font-mono">{n.time}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClearNotification?.(n.id);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-300 rounded"
                          title="Dismiss"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-7 w-7 rounded-full border border-purple-500/40 object-cover"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-100 truncate max-w-[90px]">{currentUser.name}</div>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in space-y-1">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 mb-1">
                  <div className="font-bold text-xs text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-purple-300 font-mono">ID: {currentUser.id}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser.email}</div>
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Reputation:</span>
                    <span className="font-bold text-emerald-400">★ {currentUser.reputation}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl flex items-center gap-2 transition font-medium"
                >
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Student Portfolio & Vault</span>
                </button>

                <button
                  onClick={() => {
                    onOpenAIAdvisor?.();
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl flex items-center gap-2 transition font-medium"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>AI Capstone Advisor</span>
                </button>

                <div className="pt-1 border-t border-slate-800/60">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl flex items-center gap-2 transition font-semibold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
