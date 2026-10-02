import React from 'react';
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
  LogOut
} from 'lucide-react';

export default function SidebarNav({ activeTab, setActiveTab, currentUser, onOpenAIAdvisor, onLogout }) {
  const navItems = [
    { id: 'skills', label: 'Skill Exchange', icon: Repeat, desc: 'Peer-to-peer barter' },
    { id: 'projects', label: 'Project Collaborator', icon: Users, desc: 'Capstones & Hackathons' },
    { id: 'matching', label: 'Algorithm Inspector', icon: Cpu, desc: 'CS Viva visualizer', badge: 'CS Viva' },
    { id: 'resources', label: 'Lab & Room Booking', icon: Calendar, desc: 'GPU workstations' },
    { id: 'profile', label: 'Student Portfolio', icon: User, desc: 'Reputation & Inbox' }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/90 flex flex-col justify-between hidden md:flex shrink-0 h-screen sticky top-0">
      
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  PeerNexus
                </span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart Campus Platform</p>
            </div>
          </div>
        </div>

        {/* AI Assistant Banner Pill */}
        <div className="p-4">
          <button
            onClick={onOpenAIAdvisor}
            className="w-full p-3 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-left hover:border-cyan-500/60 transition group flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-indigo-600/30 flex items-center justify-center border border-indigo-500/40">
                <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300">AI Capstone Mentor</div>
                <div className="text-[10px] text-slate-400">Ideas & Code Review</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="px-3 space-y-1">
          <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">Navigation Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <div>{item.label}</div>
                    <div className={`text-[10px] font-normal ${isActive ? 'text-cyan-100' : 'text-slate-500'}`}>{item.desc}</div>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Footer Profile & Log Out */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 space-y-2">
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-800/70 transition"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt=""
              className="h-9 w-9 rounded-full border border-cyan-500/50 object-cover"
            />
            <div>
              <div className="text-xs font-bold text-slate-100">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">ID: {currentUser.id}</div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md text-[11px] font-extrabold text-amber-300">
            <Coins className="h-3.5 w-3.5 text-amber-400" />
            <span>{currentUser.credits}</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-2 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          Log Out
        </button>
      </div>

    </aside>
  );
}
