import React, { useState } from 'react';
import { 
  User, 
  X, 
  Save, 
  Sparkles, 
  BookOpen, 
  GraduationCap 
} from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, currentUser, onSaveProfile }) {
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    branch: currentUser.branch || '',
    year: currentUser.year || '',
    bio: currentUser.bio || '',
    skillsOffered: currentUser.skillsOffered ? currentUser.skillsOffered.join(', ') : '',
    skillsWanted: currentUser.skillsWanted ? currentUser.skillsWanted.join(', ') : ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile({
      ...currentUser,
      name: formData.name,
      branch: formData.branch,
      year: formData.year,
      bio: formData.bio,
      skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()).filter(Boolean),
      skillsWanted: formData.skillsWanted.split(',').map(s => s.trim()).filter(Boolean)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <User className="h-5 w-5 text-indigo-400" />
            Edit Student Profile Settings
          </h3>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Academic Branch</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Year / Semester</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Student Bio & Capstone Goals</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Skills You Can Teach (comma separated)</label>
            <input
              type="text"
              value={formData.skillsOffered}
              onChange={(e) => setFormData({ ...formData, skillsOffered: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Skills You Want to Learn (comma separated)</label>
            <input
              type="text"
              value={formData.skillsWanted}
              onChange={(e) => setFormData({ ...formData, skillsWanted: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
