import React, { useState } from 'react';
import { 
  User, 
  X, 
  Save, 
  Sparkles, 
  BookOpen, 
  GraduationCap,
  Dices,
  CheckCircle2,
  Image,
  Link,
  Camera
} from 'lucide-react';
import { AVATAR_COLLECTIONS, generateRandomAvatar } from '../utils/avatarPresets';

export default function EditProfileModal({ isOpen, onClose, currentUser, onSaveProfile }) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    branch: currentUser?.branch || '',
    year: currentUser?.year || '',
    bio: currentUser?.bio || '',
    skillsOffered: currentUser?.skillsOffered ? currentUser.skillsOffered.join(', ') : '',
    skillsWanted: currentUser?.skillsWanted ? currentUser.skillsWanted.join(', ') : ''
  });

  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser?.name || 'user')}`);
  const [activeAvatarTab, setActiveAvatarTab] = useState(AVATAR_COLLECTIONS[0].id);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleRandomizeAvatar = () => {
    const newAvatar = generateRandomAvatar();
    setSelectedAvatar(newAvatar);
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarUrl.trim()) {
      setSelectedAvatar(customAvatarUrl.trim());
      setShowCustomUrlInput(false);
      setCustomAvatarUrl('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile({
      ...currentUser,
      avatar: selectedAvatar,
      name: formData.name,
      branch: formData.branch,
      year: formData.year,
      bio: formData.bio,
      skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()).filter(Boolean),
      skillsWanted: formData.skillsWanted.split(',').map(s => s.trim()).filter(Boolean)
    });
    onClose();
  };

  const currentCategory = AVATAR_COLLECTIONS.find(c => c.id === activeAvatarTab) || AVATAR_COLLECTIONS[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-5 shadow-2xl animate-fade-in my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Edit Profile & Avatar Settings</h3>
              <p className="text-[11px] text-slate-400">Customize your student identity, avatar, and peer skills</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="space-y-5 overflow-y-auto pr-1 text-xs">
          
          {/* AVATAR CUSTOMIZER SECTION */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <img
                    src={selectedAvatar}
                    alt="Active Avatar"
                    className="h-16 w-16 rounded-2xl border-2 border-purple-500/60 object-cover shadow-lg bg-slate-900"
                  />
                  <div className="absolute inset-0 bg-purple-950/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                    <Sparkles className="h-5 w-5 text-purple-300 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-200 text-sm">Choose Your Avatar</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-semibold border border-purple-500/30">
                      Live Preview
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pick from curated sets, randomize, or paste custom URL</p>
                </div>
              </div>

              {/* Action Buttons: Randomize & Custom URL */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomizeAvatar}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-purple-200 border border-purple-500/40 text-xs font-semibold transition"
                  title="Generate Random Avatar"
                >
                  <Dices className="h-3.5 w-3.5" />
                  <span>Randomize</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomUrlInput(!showCustomUrlInput)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition"
                  title="Enter Image URL"
                >
                  <Link className="h-3.5 w-3.5" />
                  <span>Custom URL</span>
                </button>
              </div>
            </div>

            {/* Custom URL Input Accordion */}
            {showCustomUrlInput && (
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 animate-fade-in">
                <label className="block text-slate-300 font-semibold text-[11px]">Enter Image / SVG URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.png"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Avatar Collection Tabs */}
            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {AVATAR_COLLECTIONS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setActiveAvatarTab(col.id)}
                    className={`px-3 py-1 rounded-xl font-semibold transition whitespace-nowrap text-[11px] ${
                      activeAvatarTab === col.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
                    }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>

              {/* Avatar Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-1">
                {currentCategory.avatars.map((av) => {
                  const isSelected = selectedAvatar === av.url;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.url)}
                      className={`relative rounded-2xl p-1 transition-all group flex flex-col items-center gap-1 border ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-600/20 shadow-md shadow-purple-600/30 scale-105' 
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:scale-105'
                      }`}
                      title={`Select ${av.name}`}
                    >
                      <img
                        src={av.url}
                        alt={av.name}
                        className="h-11 w-11 rounded-xl object-cover bg-slate-950"
                      />
                      <span className={`text-[10px] truncate max-w-full font-semibold ${isSelected ? 'text-purple-300' : 'text-slate-400'}`}>
                        {av.name}
                      </span>
                      {isSelected && (
                        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px] shadow">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STUDENT DETAILS SECTION */}
          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Student Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Academic Branch</label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Year / Semester</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g. 3rd Year (B.Tech)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Student Bio & Capstone Focus</label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief summary of your academic interests, hackathons, and project goals..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Skills You Can Teach (comma separated)</label>
              <input
                type="text"
                value={formData.skillsOffered}
                onChange={(e) => setFormData({ ...formData, skillsOffered: e.target.value })}
                placeholder="e.g. React.js, Python, Fastify, UI/UX"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Skills You Want to Learn (comma separated)</label>
              <input
                type="text"
                value={formData.skillsWanted}
                onChange={(e) => setFormData({ ...formData, skillsWanted: e.target.value })}
                placeholder="e.g. Docker, WebSockets, PyTorch, Cloud Architecture"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

