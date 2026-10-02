import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Command, 
  Repeat, 
  Users, 
  Cpu, 
  Calendar, 
  User, 
  Sparkles, 
  PlusCircle, 
  MessageSquare, 
  LogOut, 
  ArrowRight,
  X,
  Keyboard,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function CommandPaletteModal({ 
  isOpen, 
  onClose, 
  setActiveTab, 
  onOpenAIAdvisor, 
  onOpenCreateProject,
  onOpenCreateSkill,
  onLogout,
  users = [],
  onOpenChat
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commandItems = [
    // Navigation
    { id: 'nav-skills', category: 'Navigation', title: 'Skill Exchange Hub', desc: 'Peer-to-peer barters and mentorship', icon: Repeat, action: () => { setActiveTab('skills'); onClose(); }, shortcut: '⌘1' },
    { id: 'nav-projects', category: 'Navigation', title: 'Capstone & Project Collaborator', desc: 'Recruit teammates, open team room workspaces', icon: Users, action: () => { setActiveTab('projects'); onClose(); }, shortcut: '⌘2' },
    { id: 'nav-matching', category: 'Navigation', title: 'Algorithm Inspector & Viva Simulator', desc: 'Vector cosine match & interactive CS visualizer', icon: Cpu, action: () => { setActiveTab('matching'); onClose(); }, shortcut: '⌘3' },
    { id: 'nav-resources', category: 'Navigation', title: 'Lab & GPU Workstations', desc: 'Book campus hardware & workshops', icon: Calendar, action: () => { setActiveTab('resources'); onClose(); }, shortcut: '⌘4' },
    { id: 'nav-profile', category: 'Navigation', title: 'Student Portfolio & Reputation', desc: 'View karma, trade requests, and edit profile', icon: User, action: () => { setActiveTab('profile'); onClose(); }, shortcut: '⌘5' },
    
    // Actions & Tools
    { id: 'act-ai', category: 'AI Tools', title: 'AI Capstone Mentor', desc: 'Ask architecture questions, code reviews & ideas', icon: Sparkles, action: () => { onOpenAIAdvisor?.(); onClose(); }, shortcut: 'AI' },
    { id: 'act-new-proj', category: 'Quick Actions', title: 'Create New Capstone Project', desc: 'Post project vacancies with custom team sizes', icon: PlusCircle, action: () => { setActiveTab('projects'); onOpenCreateProject?.(); onClose(); }, shortcut: 'NP' },
    { id: 'act-new-skill', category: 'Quick Actions', title: 'Offer a New Skill', desc: 'List your skills to earn +50 credits', icon: Zap, action: () => { setActiveTab('skills'); onOpenCreateSkill?.(); onClose(); }, shortcut: 'NS' },

    // Direct Messages with Peers
    ...users.slice(0, 6).map(u => ({
      id: `peer-${u.id}`,
      category: 'Direct Message Peer',
      title: `Chat with ${u.name}`,
      desc: `Send task message to ${u.skillsOffered?.slice(0, 2).join(', ') || 'Peer'}`,
      icon: MessageSquare,
      avatar: u.avatar,
      action: () => { onOpenChat?.(u); onClose(); }
    }))
  ];

  const filteredCommands = commandItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[560px] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="h-5 w-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, search projects, jump to rooms, or chat with peers..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700">ESC</span>
            <button 
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching commands or peers found for "{query}".
            </div>
          ) : (
            filteredCommands.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition ${
                    isSelected 
                      ? 'bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-transparent border border-indigo-500/40 text-white' 
                      : 'text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.avatar ? (
                      <img src={item.avatar} alt="" className="h-7 w-7 rounded-full border border-indigo-500/30 object-cover shrink-0" />
                    ) : (
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[9px] font-normal text-purple-300 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-500/20">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{item.desc}</p>
                    </div>
                  </div>

                  {item.shortcut && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                      {item.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 px-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">↑↓</span> to navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">↵</span> to select
            </span>
          </div>
          <span className="text-[10px] text-purple-300">PeerNexus Command Engine</span>
        </div>

      </div>
    </div>
  );
}
