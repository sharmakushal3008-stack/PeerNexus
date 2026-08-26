import React, { useState, useRef } from 'react';
import { 
  User, 
  Award, 
  Coins, 
  Star, 
  CheckCircle, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  ShieldCheck,
  TrendingUp,
  Layers,
  Edit3,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  Inbox,
  Send,
  UserCheck,
  UserX,
  Video,
  MessageSquare,
  Globe,
  Copy
} from 'lucide-react';
import { storageService } from '../services/storageService';

export default function ProfileDashboard({ 
  currentUser, 
  tradeRequests, 
  userProjects, 
  onEditProfile,
  onResetData,
  onAcceptTradeRequest,
  onDeclineTradeRequest,
  onCompleteTrade,
  onOpenSessionRoom,
  onOpenChat
}) {
  const fileInputRef = useRef(null);
  const [ratingModalTrade, setRatingModalTrade] = useState(null);
  const [givenRating, setGivenRating] = useState(5);
  const [copiedSyncToken, setCopiedSyncToken] = useState(false);

  // Separate incoming vs outgoing trade requests
  const incomingRequests = tradeRequests.filter(t => t.receiverId === currentUser.id);
  const outgoingRequests = tradeRequests.filter(t => t.senderId === currentUser.id);

  const handleConfirmCompletion = () => {
    if (!ratingModalTrade) return;
    onCompleteTrade(ratingModalTrade, givenRating);
    setRatingModalTrade(null);
  };

  const handleCopySyncToken = () => {
    const token = storageService.exportSyncToken();
    navigator.clipboard.writeText(token);
    setCopiedSyncToken(true);
    setTimeout(() => setCopiedSyncToken(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Student Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-20 w-20 rounded-2xl border-2 border-indigo-500/50 object-cover shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{currentUser.name}</h1>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  {currentUser.rollNo}
                </span>
                <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-mono">
                  ID: {currentUser.id}
                </span>
                <button
                  onClick={onEditProfile}
                  className="p-1 text-slate-400 hover:text-indigo-300 transition"
                  title="Edit Profile"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.branch} • {currentUser.year}</p>
              <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">{currentUser.bio}</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <div>
              <div className="text-xs text-slate-400 font-semibold">Credits</div>
              <div className="text-lg font-black text-amber-400">{currentUser.credits}</div>
            </div>
            <div className="border-x border-slate-800 px-3">
              <div className="text-xs text-slate-400 font-semibold">Reputation</div>
              <div className="text-lg font-black text-emerald-400">{currentUser.reputation}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold">Trades</div>
              <div className="text-lg font-black text-cyan-400">{currentUser.completedTrades || 0}</div>
            </div>
          </div>

        </div>

        {/* Badges & Sync Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium mr-2">Verified Badges:</span>
            {currentUser.badges.map(badge => (
              <span key={badge} className="inline-flex items-center gap-1.5 text-xs bg-purple-500/10 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-lg font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                {badge}
              </span>
            ))}
          </div>

          {/* Device Sync & Reset Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySyncToken}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow"
              title="Copy Device Sync Token"
            >
              {copiedSyncToken ? <CheckCircle2 className="h-3.5 w-3.5 text-white" /> : <Globe className="h-3.5 w-3.5" />}
              {copiedSyncToken ? 'Sync Token Copied!' : 'Copy Device Sync Token'}
            </button>

            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-xs font-semibold text-red-300 border border-red-500/30"
            >
              <RefreshCw className="h-3.5 w-3.5 text-red-400" />
              Reset Database
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Incoming Requests vs Outgoing Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* INCOMING REQUESTS (Received from Peers) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Inbox className="h-4 w-4 text-emerald-400" />
            Incoming Trade Requests ({incomingRequests.length})
          </h2>

          {incomingRequests.length === 0 ? (
            <div className="text-center py-8 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500">
              No incoming trade requests from peers yet.
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-100">{req.senderName} requested:</div>
                      <div className="text-emerald-400 font-semibold">{req.skillOffered}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Status: <span className="text-amber-300 font-bold">{req.status}</span></div>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded font-bold">
                      {req.creditsRequired} Cr
                    </span>
                  </div>

                  {req.status === 'Pending Escrow' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onAcceptTradeRequest(req.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold flex items-center justify-center gap-1"
                      >
                        <UserCheck className="h-3.5 w-3.5" /> Accept Request
                      </button>
                      <button
                        onClick={() => onDeclineTradeRequest(req.id)}
                        className="py-1.5 px-3 bg-red-950 text-red-300 border border-red-500/30 rounded font-bold"
                      >
                        <UserX className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {req.status === 'Accepted' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onOpenSessionRoom(req)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Video className="h-4 w-4" /> Enter Live Trade Room & Chat
                      </button>
                      <button
                        onClick={() => setRatingModalTrade(req)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold"
                        title="Complete & Rate"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* OUTGOING REQUESTS (Sent by Current User) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Send className="h-4 w-4 text-indigo-400" />
            Outgoing Trade Requests Sent ({outgoingRequests.length})
          </h2>

          {outgoingRequests.length === 0 ? (
            <div className="text-center py-8 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500">
              You haven't sent any trade requests yet. Browse the marketplace to request one!
            </div>
          ) : (
            <div className="space-y-3">
              {outgoingRequests.map((req) => (
                <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-100">{req.skillOffered}</div>
                      <div className="text-slate-400">Recipient ID: {req.receiverId}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded font-bold text-[11px] ${
                      req.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  {req.status === 'Accepted' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onOpenSessionRoom(req)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold flex items-center justify-center gap-1.5"
                      >
                        <Video className="h-3.5 w-3.5" /> Enter Live Trade Room
                      </button>
                      <button
                        onClick={() => setRatingModalTrade(req)}
                        className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Rate Peer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Rating & Escrow Completion Modal */}
      {ratingModalTrade && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              Rate Peer & Confirm Completion
            </h3>

            <p className="text-xs text-slate-300">
              Confirm completion of session for <strong className="text-emerald-400">{ratingModalTrade.skillOffered}</strong>.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Mentor / Peer Rating</label>
              <div className="flex items-center justify-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setGivenRating(star)}
                    className="p-1"
                  >
                    <Star className={`h-6 w-6 ${star <= givenRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setRatingModalTrade(null)}
                className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCompletion}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
              >
                Release Escrow & Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
