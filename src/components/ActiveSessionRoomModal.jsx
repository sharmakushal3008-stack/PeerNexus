import React, { useState } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  MessageSquare, 
  Send, 
  Code, 
  CheckCircle2, 
  X, 
  Sparkles,
  FileText,
  UserCheck,
  ShieldCheck,
  Coins
} from 'lucide-react';

export default function ActiveSessionRoomModal({ 
  isOpen, 
  onClose, 
  trade, 
  currentUser, 
  messages, 
  onSendMessage, 
  onCompleteTrade 
}) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'scratchpad' | 'chat'
  const [notesText, setNotesText] = useState(`// Peer Session Notes & Code Scratchpad\n// Topic: ${trade?.skillOffered || 'Skill Barter'}\n\nfunction calculateMatrix() {\n  console.log("Collaborative code editing during mentoring...");\n}`);
  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen || !trade) return null;

  const otherPersonName = trade.senderId === currentUser.id ? (trade.receiverName || `Peer (${trade.receiverId})`) : trade.senderName;
  const isHost = trade.senderId === currentUser.id;

  const conversationMessages = messages.filter(m => 
    (m.senderId === currentUser.id && (m.receiverId === trade.receiverId || m.receiverId === trade.senderId)) ||
    (m.senderId === (trade.senderId === currentUser.id ? trade.receiverId : trade.senderId) && m.receiverId === currentUser.id)
  );

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    onSendMessage({
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: trade.senderId === currentUser.id ? trade.receiverId : trade.senderId,
      senderName: currentUser.name,
      text: inputMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setInputMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full h-[650px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Video className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">Active Trade Session Room</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  LIVE • Escrow Locked ({trade.creditsRequired} Cr)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mentoring Topic: <strong className="text-slate-200">{trade.skillOffered}</strong> with <strong className="text-indigo-300">{otherPersonName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCompleteTrade(trade)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              Complete Session & Release Escrow
            </button>

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View Controls Toolbar */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'video' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            Video Call Room
          </button>
          <button
            onClick={() => setActiveTab('scratchpad')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'scratchpad' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            Shared Code & Notes
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Session Direct Chat ({conversationMessages.length})
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-hidden bg-slate-950/40 p-4">
          
          {/* TAB 1: VIDEO CALL ROOM */}
          {activeTab === 'video' && (
            <div className="h-full flex flex-col justify-between space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Main Peer Feed */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center">
                  <div className="text-center space-y-3">
                    <img src={currentUser.avatar} alt="" className="h-20 w-20 rounded-full mx-auto border-2 border-indigo-500 object-cover shadow-xl" />
                    <div>
                      <div className="text-sm font-bold text-white">{currentUser.name} (You)</div>
                      <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1 mt-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        Connected • HD Video
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded text-[10px] text-slate-300 font-mono">
                    Local Camera Stream
                  </div>
                </div>

                {/* Remote Peer Feed */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="h-20 w-20 rounded-full mx-auto bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-xl">
                      {otherPersonName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{otherPersonName}</div>
                      <div className="text-xs text-indigo-400 font-semibold flex items-center justify-center gap-1 mt-1">
                        <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                        Peer Joined Room
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2.5 py-1 rounded text-[10px] text-slate-300 font-mono">
                    Peer Stream • Encrypted WebRTC
                  </div>
                </div>
              </div>

              {/* Video Call Controls */}
              <div className="flex items-center justify-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 w-fit mx-auto">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-xl transition ${isMicOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-600 text-white'}`}
                >
                  {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-xl transition ${isVideoOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-600 text-white'}`}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SHARED SCRATCHPAD */}
          {activeTab === 'scratchpad' && (
            <div className="h-full flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Collaborative Code & Lecture Scratchpad</span>
                <span>Auto-saved to session</span>
              </div>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>
          )}

          {/* TAB 3: SESSION CHAT */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col space-y-3">
              <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                {conversationMessages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    No messages sent in this session yet. Type below to chat!
                  </div>
                ) : (
                  conversationMessages.map((m) => {
                    const isMe = m.senderId === currentUser.id;
                    return (
                      <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-[80%] ${
                          isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1">{m.timestamp}</span>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendChat} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500"
                />
                <button type="submit" className="p-2.5 bg-indigo-600 text-white rounded-xl">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
