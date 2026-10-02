import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  User, 
  Video, 
  CheckCheck, 
  Sparkles,
  Smile
} from 'lucide-react';
import { storageService } from '../services/storageService';
import GboardEmojiPicker from './GboardEmojiPicker';

export default function DirectChatDrawer({ 
  isOpen, 
  onClose, 
  currentUser, 
  recipient, 
  allMessages = [], 
  onSendMessage 
}) {
  const [inputMsg, setInputMsg] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [localMessages, setLocalMessages] = useState(() => storageService.getMessages());
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const unsub = storageService.subscribeSync(() => {
      setLocalMessages(storageService.getMessages());
    });
    return unsub;
  }, []);

  // Close emoji picker on click outside
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

  const recipientId = recipient ? (recipient.id || recipient.authorId) : null;
  const recipientName = recipient ? (recipient.name || recipient.authorName) : '';
  const recipientAvatar = recipient ? (recipient.avatar || recipient.authorAvatar) : '';

  const effectiveMessages = useMemo(() => {
    const msgMap = new Map();
    const safeAll = Array.isArray(allMessages) ? allMessages : [];
    const safeLocal = Array.isArray(localMessages) ? localMessages : [];
    [...safeAll, ...safeLocal].forEach(m => {
      if (m && m.id) msgMap.set(m.id, m);
    });
    return Array.from(msgMap.values());
  }, [allMessages, localMessages]);

  const myId = currentUser?.id;

  // Filter conversation messages between currentUser and recipient
  const activeConversation = (isOpen && recipient && myId) ? effectiveMessages.filter(m => 
    (m.senderId === myId && m.receiverId === recipientId) ||
    (m.senderId === recipientId && m.receiverId === myId)
  ) : [];

  if (!isOpen || !recipient) return null;

  const handleAddEmoji = (emoji) => {
    setInputMsg(prev => prev + emoji);
  };

  const handleSend = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanText = inputMsg.trim();
    if (!cleanText || !currentUser) return;

    onSendMessage({
      id: `msg-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      senderId: currentUser.id,
      receiverId: recipientId,
      senderName: currentUser.name,
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setInputMsg('');
    setShowEmojiPicker(false);
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
            const isMe = currentUser && (
              m.senderId === currentUser.id || 
              (m.senderName && currentUser.name && m.senderName.toLowerCase() === currentUser.name.toLowerCase())
            );
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

      {/* Input Form with Emoji Picker */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 space-y-2 relative">
        
        {/* Google Keyboard Emoji Picker Popover */}
        {showEmojiPicker && (
          <div 
            ref={emojiPickerRef}
            className="absolute bottom-full mb-2 right-2 sm:right-4 z-40"
          >
            <GboardEmojiPicker
              onSelectEmoji={(emoji) => handleAddEmoji(emoji)}
              onClose={() => setShowEmojiPicker(false)}
              themeColor="indigo"
            />
          </div>
        )}

        {/* Quick Emoji Reaction Strip */}
        <div className="flex items-center justify-between px-1 text-[10px]">
          <span className="text-slate-500 font-semibold">Quick Reaction:</span>
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-0.5 rounded-xl border border-slate-800">
            {['👍', '🔥', '🚀', '👏', '💡', '❤️', '✅', '🎉'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleAddEmoji(emoji)}
                className="hover:scale-125 transition-transform px-0.5 cursor-pointer"
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
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="Google Keyboard Emojis"
          >
            <Smile className="h-4 w-4" />
          </button>

          <input
            type="text"
            placeholder={`Type a message to ${recipientName}...`}
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <button 
            type="submit" 
            disabled={!inputMsg.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl shadow-md transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

    </div>
  );
}
