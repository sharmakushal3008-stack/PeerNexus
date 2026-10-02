import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Users, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Crown, 
  User, 
  Briefcase, 
  Sparkles, 
  CheckCircle2,
  Calendar,
  Layers,
  Smile
} from 'lucide-react';
import { storageService } from '../services/storageService';
import GboardEmojiPicker from './GboardEmojiPicker';

export default function ProjectTeamRoomModal({
  isOpen,
  onClose,
  project,
  currentUser,
  onOpenDirectChat,
  onSendMessage,
  allMessages = []
}) {
  const [teamMessageInput, setTeamMessageInput] = useState('');
  const [selectedTag, setSelectedTag] = useState('General');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatBottomRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleAddEmoji = (emoji) => {
    setTeamMessageInput(prev => prev + emoji);
  };

  const [localMessages, setLocalMessages] = useState(() => storageService.getMessages());

  useEffect(() => {
    const unsub = storageService.subscribeSync(() => {
      setLocalMessages(storageService.getMessages());
    });
    return unsub;
  }, []);

  // Filter messages for this project team room from all available sources
  const teamRoomId = project ? `proj_team_${project.id}` : '';
  
  const effectiveMessages = React.useMemo(() => {
    const msgMap = new Map();
    [...allMessages, ...localMessages].forEach(m => {
      if (m && m.id) msgMap.set(m.id, m);
    });
    return Array.from(msgMap.values());
  }, [allMessages, localMessages]);

  const teamMessages = (isOpen && project) ? effectiveMessages.filter(
    m => (m.teamRoomId && String(m.teamRoomId) === String(teamRoomId)) || 
         (m.projectId && String(m.projectId) === String(project.id) && !m.receiverId) ||
         (m.teamRoomId && m.teamRoomId.includes(String(project.id)))
  ) : [];

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [teamMessages.length, isOpen]);

  if (!isOpen || !project) return null;

  // Derive Team Members: Lead + all accepted teammates
  const rawLeadName = project.leadName || 'Project Lead';
  const leadMember = {
    id: project.leadId || 'lead-id',
    name: rawLeadName.replace(/\s*\(You\)/, ''),
    role: 'Project Lead',
    avatar: project.leadAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rawLeadName)}`,
    isLead: true
  };

  // Accepted members from roles or explicit members array
  const acceptedRoleMembers = (project.rolesNeeded || [])
    .filter(r => r.status === 'Filled')
    .map((r, idx) => ({
      id: r.studentId || `member-${idx}`,
      name: r.filledBy || 'Teammate',
      role: r.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.filledBy || 'member')}`,
      isLead: false
    }));

  const explicitMembers = (project.members || []).filter(m => m.id !== leadMember.id);
  
  // Combine unique teammates
  const teammatesMap = {};
  [...acceptedRoleMembers, ...explicitMembers].forEach(m => {
    teammatesMap[m.name] = m;
  });
  const allTeammates = Object.values(teammatesMap);
  const fullRoster = [leadMember, ...allTeammates];

  const totalCapacity = project.targetTeamSize || ((project.rolesNeeded?.length || 0) + 1);
  const currentCount = fullRoster.length;

  const handleSendTeamMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanText = teamMessageInput.trim();
    if (!cleanText) return;

    const formattedText = selectedTag !== 'General' 
      ? `[${selectedTag}] ${cleanText}` 
      : cleanText;

    const senderRole = (currentUser && (currentUser.id === leadMember.id || project.leadName?.includes(currentUser.name))) 
      ? 'Project Lead' 
      : 'Team Member';

    const newMsg = {
      id: `team-msg-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      teamRoomId: teamRoomId,
      projectId: project.id,
      projectTitle: project.title,
      senderId: currentUser?.id || 'usr-me',
      senderName: currentUser?.name || 'You',
      senderAvatar: currentUser?.avatar || '',
      senderRole: senderRole,
      text: formattedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (onSendMessage) {
      onSendMessage(newMsg);
    } else {
      const currentMsgs = storageService.getMessages();
      await storageService.saveMessages([...currentMsgs, newMsg]);
    }
    setTeamMessageInput('');
    setShowEmojiPicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full h-[90vh] max-h-[820px] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Top Header */}
        <div className="p-4 sm:px-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white truncate">{project.title}</h2>
                <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  {project.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                Team Workspace • <strong className="text-purple-300">{currentCount} / {totalCapacity} Members Joined</strong> • Target: {project.deadline}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition shrink-0"
            title="Close Workspace"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace Body: Split View (Team Roster on Left + Group Chat on Right) */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          
          {/* Left Panel: Team Members Roster & 1-on-1 DM Triggers */}
          <div className="w-full md:w-80 bg-slate-950/50 p-4 flex flex-col space-y-4 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-purple-400" />
                  Project Team Roster
                </span>
                <span className="text-[10px] text-purple-300 font-mono bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                  {currentCount}/{totalCapacity} Members
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal mb-3">
                Click <strong className="text-cyan-300">1-on-1 Chat</strong> to privately coordinate specific tasks with any teammate.
              </p>
            </div>

            {/* Members List */}
            <div className="space-y-2.5 flex-1">
              {fullRoster.map((member, idx) => {
                const isMe = member.id === currentUser.id || member.name.toLowerCase() === currentUser.name.toLowerCase();
                
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border transition-all ${
                      isMe 
                        ? 'bg-purple-950/20 border-purple-500/30' 
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="h-8 w-8 rounded-full border border-purple-500/30 object-cover shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-100 truncate">{member.name}</span>
                            {isMe && (
                              <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-bold shrink-0">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                            {member.isLead ? (
                              <span className="text-amber-300 font-semibold flex items-center gap-1">
                                <Crown className="h-3 w-3" /> Project Lead
                              </span>
                            ) : (
                              <span className="text-purple-300">{member.role}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 1-on-1 Direct Chat Action (If not oneself) */}
                    {!isMe ? (
                      <button
                        onClick={() => {
                          if (onOpenDirectChat) {
                            onOpenDirectChat({
                              id: member.id,
                              name: member.name,
                              avatar: member.avatar,
                              role: member.role,
                              year: `Team Member on ${project.title}`
                            });
                          }
                        }}
                        className="w-full mt-1 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                        title={`Send private message to ${member.name}`}
                      >
                        <MessageSquare className="h-3 w-3 text-cyan-400" />
                        <span>1-on-1 Task Chat</span>
                      </button>
                    ) : (
                      <div className="text-[10px] text-slate-500 text-center py-0.5">
                        Your Active Profile
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Vacancy Notice */}
            {currentCount < totalCapacity && (
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-1">
                <span className="text-xs font-bold text-slate-300">
                  {totalCapacity - currentCount} Role Vacanc{totalCapacity - currentCount > 1 ? 'ies' : 'y'} Remaining
                </span>
                <p className="text-[10px] text-slate-500">
                  New applicants accepted by the Lead will appear here automatically.
                </p>
              </div>
            )}
          </div>

          {/* Right Panel: Shared Team Discussion Channel */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
            
            {/* Channel Banner */}
            <div className="p-3 px-4 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="font-bold">Team Broadcast Channel</span>
                <span className="text-[10px] text-slate-500">• Visible to all project teammates</span>
              </div>
              <div className="text-[10px] text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/30">
                #general-team-chat
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {teamMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-purple-400">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="max-w-xs space-y-1">
                    <h4 className="text-xs font-bold text-slate-200">Welcome to {project.title} Team Room!</h4>
                    <p className="text-[11px] text-slate-400">
                      Post updates, share GitHub repos, schedule syncs, or coordinate deliverables with your team.
                    </p>
                  </div>
                </div>
              ) : (
                teamMessages.map((msg) => {
                  const isMine = (msg.senderId && currentUser?.id && msg.senderId === currentUser.id) ||
                    (msg.senderName && currentUser?.name && msg.senderName.toLowerCase() === currentUser.name.toLowerCase()) ||
                    (msg.senderName === 'You');

                  const senderAvatar = isMine 
                    ? (currentUser?.avatar || msg.senderAvatar)
                    : (msg.senderAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(msg.senderName || 'user')}`);

                  // Helper to parse tags like [Task Update]
                  const tagMatch = msg.text?.match(/^\[(.*?)\]\s*(.*)$/s);
                  const tag = tagMatch ? tagMatch[1] : null;
                  const bodyText = tagMatch ? tagMatch[2] : msg.text;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMine && (
                        <img
                          src={senderAvatar}
                          alt={msg.senderName || 'Teammate'}
                          className="h-8 w-8 rounded-full border border-slate-700 object-cover shrink-0 mt-0.5 shadow-sm"
                        />
                      )}

                      <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        {/* Meta Header */}
                        <div className="flex items-center gap-2 text-[11px] mb-1 px-1">
                          {isMine ? (
                            <>
                              <span className="text-slate-400 font-mono text-[10px]">{msg.timestamp}</span>
                              <span className="text-purple-300 font-semibold bg-purple-950/70 px-1.5 py-0.5 rounded border border-purple-500/30 text-[9px]">
                                {msg.senderRole || 'Member'}
                              </span>
                              <span className="font-bold text-purple-200">You</span>
                            </>
                          ) : (
                            <>
                              <span className="font-bold text-slate-200">{msg.senderName}</span>
                              <span className="text-purple-300 font-semibold bg-purple-950/70 px-1.5 py-0.5 rounded border border-purple-500/30 text-[9px]">
                                {msg.senderRole || 'Member'}
                              </span>
                              <span className="text-slate-400 font-mono text-[10px]">{msg.timestamp}</span>
                            </>
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`w-fit px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md text-left ${
                            isMine
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-xs font-medium'
                              : 'bg-slate-950 text-slate-100 border border-slate-800 rounded-tl-xs'
                          }`}
                        >
                          {tag && (
                            <div className="mb-1">
                              <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                isMine 
                                  ? 'bg-black/25 text-purple-100 border border-white/20' 
                                  : 'bg-purple-950 text-purple-300 border border-purple-500/30'
                              }`}>
                                #{tag}
                              </span>
                            </div>
                          )}
                          <div className="whitespace-pre-wrap break-words">{bodyText}</div>
                        </div>
                      </div>

                      {isMine && (
                        <img
                          src={senderAvatar}
                          alt="You"
                          className="h-8 w-8 rounded-full border border-purple-500/50 object-cover shrink-0 mt-0.5 shadow-sm"
                        />
                      )}
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSendTeamMessage} className="p-3 bg-slate-950 border-t border-slate-800 space-y-2 relative">
              
              {/* Google Keyboard Emoji Picker Popover */}
              {showEmojiPicker && (
                <div 
                  ref={emojiPickerRef}
                  className="absolute bottom-full mb-2 right-2 sm:right-4 z-40"
                >
                  <GboardEmojiPicker
                    onSelectEmoji={(emoji) => handleAddEmoji(emoji)}
                    onClose={() => setShowEmojiPicker(false)}
                    themeColor="purple"
                  />
                </div>
              )}

              {/* Quick Tags & Quick Emojis Row */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-[10px]">
                {/* Tags */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold mr-0.5">Tag:</span>
                  {['General', 'Task Update', 'Code Review', 'Meeting', 'Milestone'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2 py-0.5 rounded-md font-semibold transition whitespace-nowrap ${
                        selectedTag === tag 
                          ? 'bg-purple-600 text-white shadow' 
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Quick Emoji Strip */}
                <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-xl border border-slate-800 shrink-0">
                  {['👍', '🚀', '🔥', '👏', '✅', '💡', '🎉'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleAddEmoji(emoji)}
                      className="hover:scale-125 transition-transform px-0.5"
                      title={`Insert ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2.5 rounded-xl border transition ${
                    showEmojiPicker 
                      ? 'bg-purple-600/30 border-purple-500 text-purple-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                  title="Google Keyboard Emojis"
                >
                  <Smile className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Broadcast message to ${project.title} team...`}
                  value={teamMessageInput}
                  onChange={(e) => setTeamMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendTeamMessage(e);
                    }
                  }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                />

                <button
                  type="submit"
                  disabled={!teamMessageInput.trim()}
                  className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl transition shadow-md shrink-0"
                  title="Send Team Message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
