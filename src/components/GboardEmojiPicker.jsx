import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Sparkles, Smile } from 'lucide-react';
import { GBOARD_EMOJI_CATEGORIES } from '../utils/emojiData';

export default function GboardEmojiPicker({ onSelectEmoji, onClose, themeColor = 'purple' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(GBOARD_EMOJI_CATEGORIES[0].id);
  const searchInputRef = useRef(null);

  // Auto-focus search input on open
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Filter emojis based on search query or active category
  const displayedEmojis = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) {
      const cat = GBOARD_EMOJI_CATEGORIES.find(c => c.id === activeCategory);
      return cat ? cat.emojis : [];
    }

    const matched = [];
    const seen = new Set();

    GBOARD_EMOJI_CATEGORIES.forEach(cat => {
      cat.emojis.forEach(item => {
        if (!seen.has(item.char) && (item.name.includes(cleanQuery) || item.char.includes(cleanQuery))) {
          seen.add(item.char);
          matched.push(item);
        }
      });
    });

    return matched;
  }, [searchQuery, activeCategory]);

  const isPurple = themeColor === 'purple';
  const activeTabClass = isPurple 
    ? 'bg-purple-600 text-white shadow-sm' 
    : 'bg-indigo-600 text-white shadow-sm';
  const tagBorderClass = isPurple ? 'border-purple-500/40' : 'border-indigo-500/40';

  return (
    <div className="w-80 sm:w-96 bg-slate-900/98 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 text-slate-200 animate-fade-in select-none">
      
      {/* Top Header: Search Bar & Close */}
      <div className="p-3 pb-2 border-b border-slate-800 flex items-center gap-2">
        <div className="flex-1 relative flex items-center">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search Google Keyboard emojis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-slate-400 hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Close Emojis"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Icons Tabs (Only shown when not searching) */}
      {!searchQuery && (
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto no-scrollbar">
          {GBOARD_EMOJI_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`p-1.5 rounded-xl text-sm transition-all flex items-center justify-center shrink-0 ${
                  isActive 
                    ? `${activeTabClass} scale-105` 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={cat.name}
              >
                <span>{cat.icon}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Category Title / Result Count */}
      <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/50 border-b border-slate-800/40">
        <span className="font-semibold text-slate-300">
          {searchQuery 
            ? `Found ${displayedEmojis.length} matching emojis` 
            : GBOARD_EMOJI_CATEGORIES.find(c => c.id === activeCategory)?.name
          }
        </span>
        <span className="text-[10px] text-slate-500">Gboard Unicode</span>
      </div>

      {/* Emojis Grid Feed */}
      <div className="p-2 grid grid-cols-7 sm:grid-cols-8 gap-1 max-h-52 overflow-y-auto overscroll-contain">
        {displayedEmojis.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-slate-500">
            No emojis found for "{searchQuery}". Try another keyword!
          </div>
        ) : (
          displayedEmojis.map((item, idx) => (
            <button
              key={`${item.char}-${idx}`}
              type="button"
              onClick={() => onSelectEmoji(item.char)}
              title={item.name}
              className="h-9 w-9 rounded-xl hover:bg-slate-800/90 active:bg-purple-600/30 flex items-center justify-center text-xl hover:scale-125 active:scale-95 transition-transform cursor-pointer"
            >
              {item.char}
            </button>
          ))
        )}
      </div>

      {/* Bottom Quick Bar */}
      <div className="p-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span className="text-slate-500">Quick React:</span>
        <div className="flex items-center gap-1.5">
          {['👍', '🚀', '🔥', '👏', '💡', '❤️', '🎉', '✅', '💯'].map(em => (
            <button
              key={em}
              type="button"
              onClick={() => onSelectEmoji(em)}
              className="hover:scale-125 transition-transform text-xs cursor-pointer px-0.5"
            >
              {em}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
