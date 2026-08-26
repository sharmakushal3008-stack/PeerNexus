import React, { useState } from 'react';
import { 
  Cpu, 
  Binary, 
  Sparkles, 
  CheckCircle2, 
  ArrowRightLeft, 
  Zap,
  BarChart2,
  Code2,
  GitCompare,
  HelpCircle,
  Network,
  Users
} from 'lucide-react';
import { 
  calculateJaccardSimilarity, 
  calculateComplementarityIndex, 
  calculateProjectCompatibility 
} from '../utils/matchingAlgorithm';
import { VIVA_QUESTIONS } from '../data/mockData';

export default function MatchingEngine({ currentUser, skillOffers = [] }) {
  const [targetStudentId, setTargetStudentId] = useState(skillOffers[0]?.id || '');
  const [activeTabMode, setActiveTabMode] = useState('algorithm'); // 'algorithm' | 'architecture' | 'viva'
  
  // Safe resolution for targetOffer
  const targetOffer = skillOffers.find(s => s.id === targetStudentId) || skillOffers[0] || {
    id: "sample-peer",
    authorName: "Priya Patel",
    authorYear: "4th Year CS",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    skillOffered: "PyTorch & Computer Vision",
    skillWanted: "React.js / Frontend Dev"
  };

  const targetStudent = {
    name: targetOffer.authorName || "Peer Student",
    skillsOffered: targetOffer.skillOffered ? [targetOffer.skillOffered, "Python", "Git"] : ["PyTorch", "Python", "Git"],
    skillsWanted: targetOffer.skillWanted ? [targetOffer.skillWanted, "Docker"] : ["React.js", "Docker"]
  };

  const complementarity = calculateComplementarityIndex(currentUser, targetStudent);
  const jaccardOffered = calculateJaccardSimilarity(currentUser.skillsOffered, targetStudent.skillsOffered);
  const jaccardWanted = calculateJaccardSimilarity(currentUser.skillsWanted, targetStudent.skillsWanted);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-2xl border border-emerald-500/30 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
          <Cpu className="h-4 w-4" />
          CS Project Viva Demonstration Module
        </div>
        <h1 className="text-2xl font-extrabold text-white">Algorithm & Compatibility Inspector</h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Visualizing the core CS matching algorithms: Jaccard Set Similarity, Complementarity Matrix, System Architecture, and Examiner Q&A Defense.
        </p>

        {/* View Switcher Pills */}
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => setActiveTabMode('algorithm')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTabMode === 'algorithm' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Binary className="h-3.5 w-3.5" />
            Matching Formula Inspector
          </button>
          <button
            onClick={() => setActiveTabMode('architecture')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTabMode === 'architecture' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            System Architecture Flow
          </button>
          <button
            onClick={() => setActiveTabMode('viva')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTabMode === 'viva' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Viva Defense Q&A Cheat Sheet
          </button>
        </div>
      </div>

      {activeTabMode === 'algorithm' && (
        <>
          {/* Selector Row */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select Candidate Peer for Comparison</label>
              <select
                value={targetStudentId || targetOffer.id}
                onChange={(e) => setTargetStudentId(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-100 text-sm font-semibold rounded-xl px-4 py-2.5 focus:border-indigo-500 min-w-[280px]"
              >
                {skillOffers.length === 0 ? (
                  <option value={targetOffer.id}>
                    {targetOffer.authorName} ({targetOffer.skillOffered}) [Sample]
                  </option>
                ) : (
                  skillOffers.map((offer) => (
                    <option key={offer.id} value={offer.id}>
                      {offer.authorName} ({offer.skillOffered})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 px-5 py-3 rounded-xl border border-slate-800/80">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Mutual Match Score</div>
                <div className="text-2xl font-black text-emerald-400">{complementarity.score}%</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Bi-Directional Barter</div>
                <div className="text-xs font-bold text-indigo-300 mt-1">
                  {complementarity.isBiDirectional ? 'YES (High Synergies)' : 'Partial Exchange'}
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Profile 1: Current User */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <img src={currentUser.avatar} alt="" className="h-10 w-10 rounded-full border border-indigo-500 object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-white">{currentUser.name} (You)</h3>
                  <p className="text-xs text-slate-400">{currentUser.branch} • {currentUser.year}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-400">Skills You Offer:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {currentUser.skillsOffered && currentUser.skillsOffered.length > 0 ? (
                    currentUser.skillsOffered.map(s => (
                      <span key={s} className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md font-medium">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No skills listed yet</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-cyan-400">Skills You Want:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {currentUser.skillsWanted && currentUser.skillsWanted.length > 0 ? (
                    currentUser.skillsWanted.map(s => (
                      <span key={s} className="text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-md font-medium">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No skills requested yet</span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile 2: Target Student */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <img src={targetOffer.authorAvatar} alt="" className="h-10 w-10 rounded-full border border-purple-500 object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-white">{targetStudent.name}</h3>
                  <p className="text-xs text-slate-400">{targetOffer.authorYear || "Campus Peer"}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-400">Skills Peer Offers:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {targetStudent.skillsOffered.map(s => (
                    <span key={s} className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-cyan-400">Skills Peer Wants:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {targetStudent.skillsWanted.map(s => (
                    <span key={s} className="text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-md font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CS Formula Visualizer Card */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="h-5 w-5 text-indigo-400" />
              Mathematical Formula & Execution Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Binary className="h-4 w-4" />
                  Jaccard Similarity Index
                </div>
                <div className="bg-slate-900 p-3 rounded text-center text-xs font-mono text-slate-200">
                  J(A, B) = |A ∩ B| / |A ∪ B|
                </div>
                <div className="text-xs text-slate-400 pt-1">
                  Offered Skills Similarity: <strong className="text-indigo-400">{jaccardOffered}</strong>
                  <br />
                  Wanted Skills Similarity: <strong className="text-indigo-400">{jaccardWanted}</strong>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <ArrowRightLeft className="h-4 w-4" />
                  Complementarity Barter Index
                </div>
                <div className="bg-slate-900 p-3 rounded text-center text-xs font-mono text-slate-200">
                  C(A, B) = (Offers_A ∩ Wants_B) + (Offers_B ∩ Wants_A)
                </div>
                <div className="text-xs text-slate-400 pt-1">
                  Calculated Synergy Score: <strong className="text-emerald-400">{complementarity.score}%</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Architecture Flow View */}
      {activeTabMode === 'architecture' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="h-5 w-5 text-emerald-400" />
            System Architecture & Data Pipeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-indigo-400">1. Client Layer</div>
              <p className="text-slate-400">React 19 Frontend + Tailwind v4 + State Management</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-cyan-400">2. Barter Engine</div>
              <p className="text-slate-400">Escrow Credit Ledger & Skill Matrix Ingestion</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-400">3. Matching Engine</div>
              <p className="text-slate-400">Jaccard Index & Complementarity Calculator</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-purple-400">4. Gemini AI Layer</div>
              <p className="text-slate-400">LLM Capstone Mentor & Proposal Generator</p>
            </div>
          </div>
        </div>
      )}

      {/* Viva Q&A Defense View */}
      {activeTabMode === 'viva' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-emerald-400" />
            Viva Voce Examiner Defense Cheat Sheet
          </h3>

          <div className="space-y-3">
            {VIVA_QUESTIONS.map((qa, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-emerald-300">Q: {qa.q}</div>
                <div className="text-slate-300 leading-relaxed pl-3 border-l-2 border-emerald-500/40">A: {qa.a}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
