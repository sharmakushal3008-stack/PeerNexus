import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  Star, 
  ArrowRightLeft, 
  Coins, 
  BookOpen,
  MessageSquare
} from 'lucide-react';

export default function SkillExchange({ 
  skillOffers, 
  currentUser, 
  onTradeRequest, 
  onAddNewSkillOffer, 
  onOpenChat 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form state for new offer
  const [newOffer, setNewOffer] = useState({
    skillOffered: '',
    skillWanted: '',
    category: 'Machine Learning',
    description: '',
    experienceLevel: 'Intermediate',
    creditsRequired: 40
  });

  const categories = ['All', 'Machine Learning', 'DevOps & Cloud', 'Design & UX', 'Hardware & IoT', 'Core Computer Science'];

  const filteredOffers = skillOffers.filter(offer => {
    const isPeer = offer.authorId !== currentUser.id;
    const matchesSearch = offer.skillOffered.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.skillWanted.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          offer.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || offer.category === selectedCategory;
    return isPeer && matchesSearch && matchesCategory;
  });

  const handleSubmitNewOffer = (e) => {
    e.preventDefault();
    if (!newOffer.skillOffered || !newOffer.skillWanted) return;

    onAddNewSkillOffer({
      id: `sk-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorYear: currentUser.year,
      authorAvatar: currentUser.avatar,
      ...newOffer,
      rating: 5.0,
      sessionsCount: 0,
      availableDays: ['Mon', 'Wed', 'Fri'],
      status: 'Online'
    });

    setIsNewModalOpen(false);
    setNewOffer({
      skillOffered: '',
      skillWanted: '',
      category: 'Machine Learning',
      description: '',
      experienceLevel: 'Intermediate',
      creditsRequired: 40
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Hero / Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 p-6 md:p-8 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <ArrowRightLeft className="h-3.5 w-3.5 text-cyan-400" />
            Peer-to-Peer Barter Marketplace
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Exchange Technical Skills & Master New Concepts
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Create skill listings, connect with fellow university students, and execute skill barters backed by automated credit escrow.
          </p>
          
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="h-4 w-4" />
              Post a Skill Offer (+50 Cr Reward)
            </button>
          </div>
        </div>

        {/* Decorative background icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
          <BookOpen className="h-64 w-64 text-cyan-400" />
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills, topics, or peers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Skill Cards Grid */}
      {filteredOffers.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="h-16 w-16 rounded-2xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center text-cyan-400">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No Peer Skill Offers Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You are in a clean database! Post the very first skill offer using the button above or share your PeerNexus link with friends.
          </p>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg inline-flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create First Skill Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-5 shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Author Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={offer.authorAvatar}
                        alt={offer.authorName}
                        className="h-10 w-10 rounded-full border border-cyan-500/40 object-cover"
                      />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">{offer.authorName}</h3>
                      <p className="text-xs text-slate-400">ID: {offer.authorId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenChat({ id: offer.authorId, name: offer.authorName, avatar: offer.authorAvatar })}
                      className="p-1.5 bg-slate-950 hover:bg-slate-800 text-cyan-300 rounded-lg border border-slate-800"
                      title="Direct Message"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md text-xs font-semibold text-amber-300">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{offer.rating || 5.0}</span>
                    </div>
                  </div>
                </div>

                {/* Skills Barter Box */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Offers:</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {offer.skillOffered}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Wants:</span>
                    <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {offer.skillWanted}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                  {offer.description}
                </p>
              </div>

              {/* Bottom Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Coins className="h-4 w-4 text-amber-400" />
                  <span className="font-semibold text-amber-300">{offer.creditsRequired} Credits</span>
                </div>

                <button
                  onClick={() => setSelectedSkill(offer)}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition"
                >
                  Request Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Session Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-cyan-400" />
              Request Skill Exchange Session
            </h3>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <img src={selectedSkill.authorAvatar} alt="" className="h-10 w-10 rounded-full" />
                <div>
                  <div className="font-semibold text-slate-100">{selectedSkill.authorName}</div>
                  <div className="text-xs text-slate-400">Recipient ID: {selectedSkill.authorId}</div>
                </div>
              </div>

              <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 space-y-1">
                <div><strong className="text-emerald-400">You Learn:</strong> {selectedSkill.skillOffered}</div>
                <div><strong className="text-cyan-400">You Teach/Help:</strong> {selectedSkill.skillWanted}</div>
                <div><strong className="text-amber-400">Session Cost:</strong> {selectedSkill.creditsRequired} Credits</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedSkill(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onTradeRequest(selectedSkill);
                  setSelectedSkill(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post New Skill Offer Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSubmitNewOffer} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-cyan-400" />
              Post Your Skill Offer
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Skill You Can Teach</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React.js, FastAPI, OpenCV"
                  value={newOffer.skillOffered}
                  onChange={(e) => setNewOffer({ ...newOffer, skillOffered: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Skill You Want to Learn</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PyTorch, Docker, Flutter"
                  value={newOffer.skillWanted}
                  onChange={(e) => setNewOffer({ ...newOffer, skillWanted: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={newOffer.category}
                  onChange={(e) => setNewOffer({ ...newOffer, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description & Topic Outline</label>
                <textarea
                  rows={3}
                  placeholder="Explain what topics you can cover in your mentoring sessions..."
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md"
              >
                Publish Skill Offer
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
