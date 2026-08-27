import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Zap, 
  Code2, 
  BookOpen, 
  CheckCircle2, 
  Globe,
  Coins,
  Search,
  MessageSquare,
  Video,
  Terminal,
  Sparkles
} from 'lucide-react';
import InteractiveMouseCanvas from './InteractiveMouseCanvas';

export default function LandingPage({ onGetStarted, onOpenLogin }) {
  const [activePreviewTab, setActivePreviewTab] = useState('skills');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Subtle Cursor Spotlight Glow */}
      <InteractiveMouseCanvas className="z-0" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-20 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">PeerNexus</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                v2.0
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md flex items-center gap-1.5 transition active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 text-center space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium shadow-sm mx-auto"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Peer-to-Peer Campus Skill Barter & Project Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
        >
          Trade Skills. Assemble Teams.{' '}
          <span className="text-cyan-400">Build Capstones.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto"
        >
          PeerNexus enables university students to exchange technical mentoring, form balanced capstone teams, and reserve campus hardware labs with automated credit escrow.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-3 justify-center"
        >
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
          >
            <span>Create Free Account</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition"
          >
            <span>Log In to Account</span>
          </button>
        </motion.div>

        {/* Trust Highlights */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Escrow Protection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Skill Match Engine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-cyan-400" />
            <span>Cross-Device Sync</span>
          </div>
        </motion.div>

      </section>

      {/* REAL INTERACTIVE PRODUCT DEMO PREVIEW MOCKUP */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Top Bar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-slate-500 font-mono text-[11px] ml-2">peernexus.app/workspace</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActivePreviewTab('skills')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition ${activePreviewTab === 'skills' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Skill Barter
              </button>
              <button 
                onClick={() => setActivePreviewTab('capstone')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition ${activePreviewTab === 'capstone' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Capstone Teams
              </button>
              <button 
                onClick={() => setActivePreviewTab('session')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition ${activePreviewTab === 'session' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Live Room
              </button>
            </div>
          </div>

          {/* Interactive Preview Body */}
          <div className="p-6 bg-slate-950/60 min-h-[280px]">
            {activePreviewTab === 'skills' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                        JS
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Alex Chen</div>
                        <div className="text-[10px] text-slate-400">CS 3rd Year</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                      40 Credits
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg text-xs space-y-1">
                    <div className="text-emerald-400 font-semibold">Teaches: React & TypeScript</div>
                    <div className="text-cyan-400 font-semibold">Wants: PyTorch & Machine Learning</div>
                  </div>
                  <button onClick={onGetStarted} className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition">
                    Request Session
                  </button>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                        SK
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Sarah Kumar</div>
                        <div className="text-[10px] text-slate-400">ECE 4th Year</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                      50 Credits
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg text-xs space-y-1">
                    <div className="text-emerald-400 font-semibold">Teaches: Embedded Systems & CAD</div>
                    <div className="text-cyan-400 font-semibold">Wants: Full-Stack Web Development</div>
                  </div>
                  <button onClick={onGetStarted} className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition">
                    Request Session
                  </button>
                </div>
              </div>
            )}

            {activePreviewTab === 'capstone' && (
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Autonomous Drone Navigation Capstone</h4>
                    <p className="text-xs text-slate-400">Lead: Computer Vision & Robotics Lab</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-semibold">
                    1 Role Open
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-md text-slate-300">Open: ROS2 Specialist</span>
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-md text-slate-400">Filled: Control Systems</span>
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-md text-slate-400">Filled: Hardware PCB</span>
                </div>
              </div>
            )}

            {activePreviewTab === 'session' && (
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Video className="h-4 w-4 text-emerald-400" />
                    <span>Live Session Room • Escrow Locked</span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded font-mono">
                    LIVE
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-emerald-300">
                  // Real-time collaborative scratchpad & WebRTC peer video stream
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Platform Capabilities
          </h2>
          <p className="text-slate-400 text-xs">
            Built for peer skill barter, capstone team formation, and campus hardware lab allocation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition space-y-3">
            <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
              <Coins className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Escrow Credit System</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Credits are safely held in escrow during sessions and released upon verified completion.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition space-y-3">
            <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Capstone Team Match</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Post project vacancies or apply for specialized engineering and software capstone roles.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition space-y-3">
            <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-purple-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Skill Compatibility Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Algorithm analyzes skill overlap and academic background to find compatible project partners.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition space-y-3">
            <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Hardware Lab Booking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Check real-time availability for GPU compute nodes and hardware prototyping benches.
            </p>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">PeerNexus</span>
            <span>— Campus Skill Exchange & Capstone Platform</span>
          </div>
          <p className="text-slate-500">© 2026 PeerNexus</p>
        </div>
      </footer>

    </div>
  );
}
