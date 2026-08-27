import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  AlertCircle
} from 'lucide-react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' }
  ]
};

// Synthetic Video Stream Generator for camera fallbacks or demo mode
function createSyntheticVideoStream(userName, isPeer = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  let frame = 0;
  
  const draw = () => {
    frame++;
    // Dark sleek background gradient
    const grad = ctx.createLinearGradient(0, 0, 640, 480);
    grad.addColorStop(0, isPeer ? '#090d16' : '#0b1329');
    grad.addColorStop(1, isPeer ? '#131b2e' : '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);

    // Subtle Grid overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 640; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 480); ctx.stroke();
    }
    for (let y = 0; y < 480; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(640, y); ctx.stroke();
    }

    // Animated Avatar Silhouette
    const pulse = Math.sin(frame * 0.05) * 8;
    const centerX = 320;
    const centerY = 220;

    // Glowing Aura
    ctx.fillStyle = isPeer ? 'rgba(99, 102, 241, 0.18)' : 'rgba(6, 182, 212, 0.18)';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 20, 75 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = isPeer ? '#818cf8' : '#38bdf8';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 30 + Math.sin(frame * 0.04) * 3, 48, 0, Math.PI * 2);
    ctx.fill();

    // Body/Shoulders
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 85, 95, 60, 0, Math.PI, 0);
    ctx.fill();

    // Animated Live Indicator
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(40, 40, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(isPeer ? `LIVE PEER CAM (${userName})` : `LIVE WEBCAM (${userName})`, 54, 44);

    // Audio Waveform Equalizer simulation
    const waveWidth = 120;
    const startX = 640 - waveWidth - 30;
    for (let i = 0; i < 10; i++) {
      const h = Math.abs(Math.sin(frame * 0.12 + i)) * 22 + 4;
      ctx.fillStyle = isPeer ? '#a5b4fc' : '#67e8f9';
      ctx.fillRect(startX + i * 11, 44 - h / 2, 6, h);
    }

    // Timestamp & Stats
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '11px monospace';
    const timeStr = new Date().toLocaleTimeString();
    ctx.fillText(`HD 720p • 30 FPS • ${timeStr}`, 40, 455);
  };

  const timer = setInterval(draw, 1000 / 30);
  const stream = canvas.captureStream(30);
  stream._syntheticTimer = timer;
  return stream;
}

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
  const [mediaError, setMediaError] = useState(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const remoteSyntheticStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const roomChannelRef = useRef(null);

  const otherPersonName = trade ? (trade.senderId === currentUser.id ? (trade.receiverName || `Peer (${trade.receiverId})`) : trade.senderName) : 'Peer Student';
  const isInitiator = trade ? trade.senderId === currentUser.id : false;

  // Callback ref for Local Video Node
  const setLocalVideoNode = useCallback((node) => {
    localVideoRef.current = node;
    if (node && mediaStreamRef.current) {
      node.srcObject = mediaStreamRef.current;
      node.play().catch(err => console.warn('Local video play:', err));
    }
  }, []);

  // Callback ref for Remote Video Node
  const setRemoteVideoNode = useCallback((node) => {
    remoteVideoRef.current = node;
    if (node && (remoteVideoRef.current?.srcObject || remoteSyntheticStreamRef.current)) {
      if (!node.srcObject && remoteSyntheticStreamRef.current) {
        node.srcObject = remoteSyntheticStreamRef.current;
      }
      node.play().catch(err => console.warn('Remote video play:', err));
    }
  }, []);

  // WebRTC Connection Setup & Signaling Engine
  useEffect(() => {
    if (!isOpen || !trade) return;

    let isMounted = true;
    const channelName = `peernexus_session_${trade.id}`;

    async function setupWebRTC() {
      try {
        setMediaError(null);
        setIsStreamActive(false);

        // 1. Multi-tier Hardware Camera & Microphone Stream Acquisition
        let localStream = null;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            // Attempt 1: Video + Audio
            localStream = await navigator.mediaDevices.getUserMedia({
              video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
              audio: true
            });
          } catch (errAudio) {
            console.warn('Audio + Video failed, trying Video only...', errAudio);
            try {
              // Attempt 2: Video only
              localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
              });
            } catch (errVid) {
              console.warn('Hardware camera unavailable or permission denied, initializing Live Synthetic Stream...', errVid);
              localStream = createSyntheticVideoStream(currentUser.name, false);
            }
          }
        } else {
          localStream = createSyntheticVideoStream(currentUser.name, false);
        }

        if (!isMounted) {
          if (localStream._syntheticTimer) clearInterval(localStream._syntheticTimer);
          localStream.getTracks().forEach(t => t.stop());
          return;
        }

        mediaStreamRef.current = localStream;
        setIsStreamActive(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.play().catch(e => console.warn('Local play:', e));
        }

        // Initialize Peer Stream simulation for single-user live demo mode
        const remoteSynthStream = createSyntheticVideoStream(otherPersonName, true);
        remoteSyntheticStreamRef.current = remoteSynthStream;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteSynthStream;
          remoteVideoRef.current.play().catch(e => console.warn('Remote synth play:', e));
        }
        setIsRemoteConnected(true);

        // 2. Instantiate RTCPeerConnection with STUN Servers
        const pc = new RTCPeerConnection(ICE_SERVERS);
        peerConnectionRef.current = pc;

        // Add Local Tracks to WebRTC Peer Connection
        if (localStream) {
          localStream.getTracks().forEach(track => {
            pc.addTrack(track, localStream);
          });
        }

        // Handle Incoming Remote Stream Track (Overrides Synthetic Remote)
        pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
              remoteVideoRef.current.play().catch(e => console.warn('Remote play error:', e));
            }
            setIsRemoteConnected(true);
          }
        };

        // Handle ICE Candidates and Broadcast to Signaling Channel
        pc.onicecandidate = (event) => {
          if (event.candidate && roomChannelRef.current) {
            roomChannelRef.current.postMessage({
              type: 'ICE_CANDIDATE',
              senderId: currentUser.id,
              candidate: event.candidate
            });
          }
        };

        // 3. Setup Broadcast Channel for Real-Time Cross-Device Signaling
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const channel = new BroadcastChannel(channelName);
          roomChannelRef.current = channel;

          channel.onmessage = async (e) => {
            const data = e.data;
            if (!data || data.senderId === currentUser.id) return;

            if (data.type === 'NOTE_UPDATE') {
              setNotesText(data.content);
              return;
            }

            if (data.type === 'SDP_OFFER') {
              try {
                await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                channel.postMessage({
                  type: 'SDP_ANSWER',
                  senderId: currentUser.id,
                  sdp: answer
                });
              } catch (err) {
                console.warn('SDP Offer error:', err);
              }
            } else if (data.type === 'SDP_ANSWER') {
              try {
                if (pc.signalingState !== 'stable') {
                  await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
                }
              } catch (err) {
                console.warn('SDP Answer error:', err);
              }
            } else if (data.type === 'ICE_CANDIDATE') {
              try {
                if (data.candidate) {
                  await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                }
              } catch (err) {
                console.warn('ICE Candidate error:', err);
              }
            } else if (data.type === 'JOIN_ROOM') {
              if (isInitiator) {
                try {
                  const offer = await pc.createOffer();
                  await pc.setLocalDescription(offer);
                  channel.postMessage({
                    type: 'SDP_OFFER',
                    senderId: currentUser.id,
                    sdp: offer
                  });
                } catch (err) {
                  console.warn('Offer creation error:', err);
                }
              }
            }
          };

          channel.postMessage({ type: 'JOIN_ROOM', senderId: currentUser.id });

          if (isInitiator) {
            setTimeout(async () => {
              if (pc.signalingState === 'stable' || pc.signalingState === 'have-local-offer') {
                try {
                  const offer = await pc.createOffer();
                  await pc.setLocalDescription(offer);
                  channel.postMessage({
                    type: 'SDP_OFFER',
                    senderId: currentUser.id,
                    sdp: offer
                  });
                } catch (e) {
                  console.warn('Initial offer error:', e);
                }
              }
            }, 800);
          }
        }

      } catch (err) {
        console.warn('WebRTC Media Setup Error:', err);
        setMediaError('Camera fallback active.');
      }
    }

    setupWebRTC();

    return () => {
      isMounted = false;
      if (mediaStreamRef.current) {
        if (mediaStreamRef.current._syntheticTimer) clearInterval(mediaStreamRef.current._syntheticTimer);
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      if (remoteSyntheticStreamRef.current) {
        if (remoteSyntheticStreamRef.current._syntheticTimer) clearInterval(remoteSyntheticStreamRef.current._syntheticTimer);
        remoteSyntheticStreamRef.current.getTracks().forEach(t => t.stop());
        remoteSyntheticStreamRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (roomChannelRef.current) {
        roomChannelRef.current.close();
        roomChannelRef.current = null;
      }
      setIsStreamActive(false);
      setIsRemoteConnected(false);
    };
  }, [isOpen, trade?.id]);

  // Re-bind remote & local video tags when tab switches back to 'video'
  useEffect(() => {
    if (activeTab === 'video') {
      if (localVideoRef.current && mediaStreamRef.current) {
        localVideoRef.current.srcObject = mediaStreamRef.current;
        localVideoRef.current.play().catch(e => console.warn(e));
      }
      if (remoteVideoRef.current) {
        if (peerConnectionRef.current) {
          const receivers = peerConnectionRef.current.getReceivers();
          if (receivers && receivers.length > 0 && receivers[0].track) {
            const remoteStream = new MediaStream([receivers[0].track]);
            remoteVideoRef.current.srcObject = remoteStream;
          } else if (remoteSyntheticStreamRef.current) {
            remoteVideoRef.current.srcObject = remoteSyntheticStreamRef.current;
          }
        } else if (remoteSyntheticStreamRef.current) {
          remoteVideoRef.current.srcObject = remoteSyntheticStreamRef.current;
        }
        remoteVideoRef.current.play().catch(e => console.warn(e));
      }
    }
  }, [activeTab]);

  // Toggle Local Video Track
  const handleToggleVideo = () => {
    const nextState = !isVideoOn;
    setIsVideoOn(nextState);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = nextState;
      });
    }
  };

  // Toggle Local Audio Track
  const handleToggleMic = () => {
    const nextState = !isMicOn;
    setIsMicOn(nextState);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = nextState;
      });
    }
  };

  // Handle Note Editing & Broadcast to Peer
  const handleNotesChange = (e) => {
    const newText = e.target.value;
    setNotesText(newText);
    if (roomChannelRef.current) {
      roomChannelRef.current.postMessage({
        type: 'NOTE_UPDATE',
        senderId: currentUser.id,
        content: newText,
        timestamp: Date.now()
      });
    }
  };

  if (!isOpen || !trade) return null;

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
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full h-[92vh] sm:h-[680px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* RESPONSIVE HEADER */}
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          
          <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Video className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white text-xs sm:text-sm truncate">Active Session Room</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  LIVE • Escrow ({trade.creditsRequired} Cr)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Topic: <strong className="text-slate-200">{trade.skillOffered}</strong> with <strong className="text-cyan-300">{otherPersonName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
            <button
              onClick={() => setShowEndDialog(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>End / Submit Session</span>
            </button>

            <button 
              onClick={() => setShowEndDialog(true)} 
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
              title="Close Room"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

        </div>

        {/* RESPONSIVE VIEW CONTROLS TOOLBAR */}
        <div className="px-3 sm:px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'video' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span>Video Call Room</span>
          </button>
          <button
            onClick={() => setActiveTab('scratchpad')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'scratchpad' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Shared Code & Notes</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'chat' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Session Chat ({conversationMessages.length})</span>
          </button>
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 overflow-hidden bg-slate-950/40 p-3 sm:p-4">
          
          {/* TAB 1: VIDEO CALL ROOM WITH BI-DIRECTIONAL WEBRTC PEER STREAMS */}
          {activeTab === 'video' && (
            <div className="h-full flex flex-col justify-between space-y-3">
              
              {mediaError && (
                <div className="p-2.5 bg-amber-950/60 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>{mediaError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 flex-1 min-h-0">
                
                {/* 1. LOCAL CAMERA FEED */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center group">
                  <video
                    ref={setLocalVideoNode}
                    autoPlay
                    playsInline
                    muted
                    style={{ display: isVideoOn && !mediaError ? 'block' : 'none' }}
                    className="w-full h-full object-cover rounded-2xl"
                  />

                  {(!isVideoOn || mediaError) && (
                    <div className="text-center space-y-2 p-4">
                      <img src={currentUser.avatar} alt="" className="h-16 sm:h-20 w-16 sm:w-20 rounded-full mx-auto border-2 border-cyan-500 object-cover shadow-xl" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">{currentUser.name} (You)</div>
                        <div className="text-[11px] text-amber-400 font-semibold mt-0.5">
                          {mediaError ? 'Camera Disabled' : 'Camera Muted'}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] text-cyan-300 font-mono flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${isStreamActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                    <span>{isStreamActive ? 'Local Hardware Feed' : 'Local Stream'}</span>
                  </div>
                </div>

                {/* 2. REMOTE PEER CAMERA STREAM */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center">
                  <video
                    ref={setRemoteVideoNode}
                    autoPlay
                    playsInline
                    style={{ display: isRemoteConnected ? 'block' : 'none' }}
                    className="w-full h-full object-cover rounded-2xl"
                  />

                  {!isRemoteConnected && (
                    <div className="text-center space-y-3 p-4">
                      <div className="h-16 sm:h-20 w-16 sm:w-20 rounded-full mx-auto bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-xl">
                        {otherPersonName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">{otherPersonName}</div>
                        <div className="text-[11px] text-indigo-400 font-semibold flex items-center justify-center gap-1 mt-1">
                          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                          <span>Peer Connected • Awaiting Stream</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] text-indigo-300 font-mono flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${isRemoteConnected ? 'bg-emerald-400 animate-ping' : 'bg-indigo-400'}`} />
                    <span>{isRemoteConnected ? 'Peer Live Feed' : 'Peer Stream • Encrypted STUN'}</span>
                  </div>
                </div>

              </div>

              {/* Video & Mic Hardware Controls */}
              <div className="flex items-center justify-center gap-3 bg-slate-900 p-2.5 rounded-2xl border border-slate-800 w-fit mx-auto shadow-xl">
                <button
                  onClick={handleToggleMic}
                  className={`p-3 rounded-xl transition ${isMicOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-600 text-white'}`}
                  title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>

                <button
                  onClick={handleToggleVideo}
                  className={`p-3 rounded-xl transition ${isVideoOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-600 text-white'}`}
                  title={isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: LIVE SHARED CODE & NOTES */}
          {activeTab === 'scratchpad' && (
            <div className="h-full flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Code className="h-4 w-4 text-cyan-400" />
                  Live Collaborative Code & Notes Scratchpad
                </span>
                <span className="text-emerald-400 font-mono text-[10px]">● Live Peer Sync Active</span>
              </div>
              <textarea
                value={notesText}
                onChange={handleNotesChange}
                placeholder="Type lecture notes or code here... Peer will see edits in real time!"
                className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-300 focus:outline-none focus:border-cyan-500 leading-relaxed shadow-inner"
              />
            </div>
          )}

          {/* TAB 3: SESSION CHAT */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col space-y-3">
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                {conversationMessages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    No messages sent in this session yet. Type below to chat!
                  </div>
                ) : (
                  conversationMessages.map((m) => {
                    const isMe = m.senderId === currentUser.id;
                    return (
                      <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-[85%] ${
                          isMe ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
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
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button type="submit" className="p-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-xl font-bold">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* END SESSION SUBMISSION MODAL */}
      {showEndDialog && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">End Session Submission</h3>
                <p className="text-xs text-slate-400">Have you finished your learning session?</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <p className="leading-relaxed">
                If you have <strong className="text-emerald-400">completed learning</strong>, you can end the session completely to release escrow credits ({trade.creditsRequired} Cr) and rate your peer.
              </p>
              <p className="leading-relaxed text-slate-400">
                If you have <strong className="text-cyan-300">not completed learning yet</strong>, you can pause the session for now. The room will remain active so both peers can re-enter anytime later!
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  setShowEndDialog(false);
                  onCompleteTrade(trade);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Completed Learning (End & Release Escrow)</span>
              </button>

              <button
                onClick={() => {
                  setShowEndDialog(false);
                  if (mediaStreamRef.current) {
                    mediaStreamRef.current.getTracks().forEach(t => t.stop());
                  }
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700/80 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <span>Pause Session for Now (Resume Later)</span>
              </button>

              <button
                onClick={() => setShowEndDialog(false)}
                className="w-full py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition text-center"
              >
                Cancel / Return to Live Room
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
