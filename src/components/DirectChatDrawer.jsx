import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  User, 
  Video, 
  CheckCheck, 
  Sparkles
} from 'lucide-react';

export default function DirectChatDrawer({ 
  isOpen, 
  onClose, 
  currentUser, 
  recipient, 
  allMessages, 
  onSendMessage 
}) {
  const [inputMsg, setInputMsg] = useState('');

  if (!isOpen || !recipient) return null;

  const recipientId = recipient.id || recipient.authorId;
  const recipientName = recipient.name || recipient.authorName;
  const recipientAvatar = recipient.avatar || recipient.authorAvatar;

  // Filter conversation messages between currentUser and recipient
  const activeConversation = allMessages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === recipientId) ||
    (m.senderId === recipientId && m.receiverId === currentUser.id)
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    onSendMessage({
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: recipientId,
      senderName: currentUser.name,
      text: inputMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setInputMsg('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={recipientAvatar} alt="" className="h-10 w-10 rounded-full object-cover border border-indigo-500/40" />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">{recipientName}</h3>
            <p className="text-xs text-slate-400">ID: {recipientId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => alert(`Starting video room call with ${recipientName}...`)}
            className="p-2 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/40"
            title="Start Video Room"
          >
            <Video className="h-4 w-4" />
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40 text-xs">
        {activeConversation.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No messages yet. Send a message to start conversation!
          </div>
        ) : (
          activeConversation.map((m) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] ${
                  isMe 
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none' 
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                  {m.timestamp} {isMe && <CheckCheck className="h-3 w-3 text-indigo-400" />}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          placeholder={`Type a message to ${recipientName}...`}
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
        />
        <button type="submit" className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md">
          <Send className="h-4 w-4" />
        </button>
      </form>

    </div>
  );
}
