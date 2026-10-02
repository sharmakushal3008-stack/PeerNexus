import React, { useState } from 'react';
import { 
  GraduationCap, 
  Repeat, 
  Users, 
  Cpu, 
  Calendar, 
  User, 
  Coins, 
  Sparkles,
  ChevronRight,
  LogOut,
  Settings,
  ShieldCheck,
  Activity,
  Zap,
  Flame,
  Code2,
  Compass,
  Radio,
  Layers,
  Crown
} from 'lucide-react';

export default function SidebarNav({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onOpenAIAdvisor, 
  onOpenEditProfile, 
  onLogout 
}) {
  const [isHoveredAi, setIsHoveredAi] = useState(false);

  const navItems = [
    { 
      id: 'skills', 
      label: 'Skill Exchange', 
      icon: Repeat, 
      desc: 'P2P Escrow & Mentorship', 
      tag: '40+ Skills',
      tagColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      accentColor: 'text-cyan-400 group-hover:text-cyan-300'
    },
    { 
      id: 'projects', 
      label: 'Capstone Collab Hub', 
      icon: Users, 
      desc: 'Team Rooms & Sprints', 
      tag: '🔥 Active',
      tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      accentColor: 'text-purple-400 group-hover:text-purple-300'
    },
    { 
      id: 'matching', 
      label: 'Algorithm Inspector', 
      icon: Cpu, 
      desc: 'Interactive CS Viva Lab', 
      tag: 'CS Viva',
      tagColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      accentColor: 'text-emerald-400 group-hover:text-emerald-300'
    },
    { 
      id: 'resources', 
      label: 'Lab & Room Booking', 
      icon: Calendar, 
      desc: 'GPU Rigs & Study Pods', 
      tag: 'Available',
      tagColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      accentColor: 'text-indigo-400 group-hover:text-indigo-300'
    },
    { 
      id: 'profile', 
      label: 'Student Portfolio', 
      icon: User, 
      desc: 'Reputation & Contracts', 
      tag: 'Verified',
      tagColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      accentColor: 'text-amber-400 group-hover:text-amber-300'
    }
  ];

  return (
    <aside 
      className="w-72 flex flex-col justify-between hidden md:flex shrink-0 h-screen sticky top-0 z-30 select-none overflow-y-auto no-scrollbar"
      style={{
        background: 'linear-gradient(180deg, #070a12 0%, #05080f 45%, #030408 100%)',
        borderRight: '1px solid rgba(99, 102, 241, 0.18)',
        boxShadow: '4px 0 30px rgba(0, 0, 0, 0.6)'
      }}
    >
      
      {/* Top Section */}
      <div className="space-y-4">
        
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40 relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative group cursor-pointer">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-600/30 transition-transform group-hover:scale-105">
                  <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-cyan-300 transition-transform group-hover:rotate-12" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 ring-2 ring-emerald-500/40 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-cyan-300">
                    PeerNexus
                  </span>
                  <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-200 border border-indigo-500/40 shadow-sm">
                    PRO
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-slate-300">P2P Campus Mesh</span>
                  <span className="text-slate-500">• v2.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Capstone Co-Pilot Interactive Card */}
        <div className="px-3.5">
          <div
            onClick={onOpenAIAdvisor}
            onMouseEnter={() => setIsHoveredAi(true)}
            onMouseLeave={() => setIsHoveredAi(false)}
            className="w-full p-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden group shadow-xl"
            style={{
              background: isHoveredAi 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.22) 0%, rgba(168, 85, 247, 0.25) 100%)' 
                : 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.7) 100%)',
              border: isHoveredAi 
                ? '1px solid rgba(168, 85, 247, 0.6)' 
                : '1px solid rgba(99, 102, 241, 0.3)',
              boxShadow: isHoveredAi ? '0 8px 25px rgba(124, 58, 237, 0.25)' : 'none'
            }}
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="flex items-center justify-between gap-2 relative z-10">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/40 shrink-0 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-200 transition truncate">
                      AI Capstone Co-Pilot
                    </span>
                    <span className="text-[8px] uppercase font-extrabold bg-purple-500/30 text-purple-200 px-1 py-0.2 rounded border border-purple-400/40">
                      GPT-4
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 group-hover:text-slate-300 transition truncate">
                    Instant Stack Review & Architecture
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-purple-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center justify-between">
            <span>Navigation Workspace</span>
            <span className="text-[9px] text-purple-400/80 font-mono font-normal">5 Modules</span>
          </div>

          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 group relative overflow-hidden text-left cursor-pointer ${
                    isActive
                      ? 'text-white shadow-xl'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`}
                  style={{
                    background: isActive 
                      ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.28) 0%, rgba(147, 51, 234, 0.18) 70%, rgba(15, 23, 42, 0) 100%)' 
                      : 'transparent',
                    border: isActive 
                      ? '1px solid rgba(129, 140, 248, 0.45)' 
                      : '1px solid transparent'
                  }}
                >
                  {/* Glowing left edge marker for active item */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-cyan-400 via-indigo-500 to-purple-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-indigo-600/40 text-cyan-300 border border-indigo-400/50 shadow-inner' 
                        : 'bg-slate-900/80 text-slate-400 border border-slate-800 group-hover:bg-slate-800 group-hover:border-slate-700'
                    }`}>
                      <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-300' : item.accentColor}`} />
                    </div>

                    <div className="min-w-0">
                      <div className={`text-xs font-bold leading-tight truncate ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {item.label}
                      </div>
                      <div className={`text-[10px] font-normal leading-tight mt-0.5 truncate ${isActive ? 'text-indigo-200' : 'text-slate-500 group-hover:text-slate-400'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {/* Micro-Badge */}
                  {item.tag && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border transition shrink-0 ${
                      isActive 
                        ? 'bg-purple-500/30 text-purple-200 border-purple-400/40 shadow-sm' 
                        : item.tagColor
                    }`}>
                      {item.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Campus Telemetry / Network Pulse */}
        <div className="px-4 pt-1">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
                Live Network Radar
              </span>
              <span className="text-emerald-400 font-mono text-[9px] bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
                Connected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-xs font-black text-cyan-300">12+</div>
                <div className="text-[9px] text-slate-400">Live Trades</div>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-xs font-black text-purple-300">98%</div>
                <div className="text-[9px] text-slate-400">Match Rate</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: User Vault & Controls */}
      <div 
        className="p-3.5 border-t border-slate-800/80 space-y-2.5"
        style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(7, 10, 18, 0.95) 100%)'
        }}
      >
        {/* User Card */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850/90 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-10 w-10 rounded-full border-2 border-indigo-500/40 group-hover:border-purple-400 object-cover transition-colors"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-sm" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-100 group-hover:text-purple-200 transition truncate">
                  {currentUser.name}
                </span>
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" title="Verified Campus Student" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 truncate">
                <span>{currentUser.id}</span>
              </div>
            </div>
          </div>

          {/* Credit Vault Pill */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black shrink-0 transition-transform group-hover:scale-105 shadow-md"
            style={{
              background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.2) 0%, rgba(245, 158, 11, 0.25) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24'
            }}
            title={`${currentUser.credits} Campus Credits Available`}
          >
            <Coins className="h-3.5 w-3.5 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} />
            <span>{currentUser.credits}</span>
          </div>
        </div>

        {/* Action Buttons: Edit Profile & Log Out */}
        <div className="flex items-center gap-2">
          {onOpenEditProfile && (
            <button
              onClick={onOpenEditProfile}
              className="flex-1 py-2 px-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
              title="Edit Profile & Skills"
            >
              <Settings className="h-3.5 w-3.5 text-slate-400" />
              <span>Edit</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="flex-1 py-2 px-2.5 bg-red-950/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 border border-red-500/25 hover:border-red-500/50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
            title="Log Out of Session"
          >
            <LogOut className="h-3.5 w-3.5 text-red-400" />
            <span>Log Out</span>
          </button>
        </div>

      </div>

    </aside>
  );
}
