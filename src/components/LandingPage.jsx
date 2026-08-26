import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Torus, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Zap, 
  Code2, 
  Cpu, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  TrendingUp,
  Award,
  Globe
} from 'lucide-react';

function Landing3DScene() {
  const coreRef = useRef();
  const ringRef = useRef();
  const outerRingRef = useRef();

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.rotation.x += delta * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.3;
      ringRef.current.rotation.y += delta * 0.2;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.2;
      outerRingRef.current.rotation.z += delta * 0.15;
    }
  });

  // Floating skill node positions around the core
  const nodes = [
    { pos: [2.2, 1.2, 0.5], color: '#06b6d4' },
    { pos: [-2.4, -1.0, 0.8], color: '#a855f7' },
    { pos: [1.5, -2.0, -1.2], color: '#6366f1' },
    { pos: [-1.8, 1.8, -0.6], color: '#10b981' },
    { pos: [0, 2.5, 1.2], color: '#ec4899' },
    { pos: [0, -2.5, -1.5], color: '#3b82f6' }
  ];

  return (
    <group>
      {/* Central Interactive Core Sphere */}
      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.8}>
        <mesh ref={coreRef} scale={1.7}>
          <icosahedronGeometry args={[1, 12]} />
          <MeshDistortMaterial
            color="#6366f1"
            attach="material"
            distort={0.45}
            speed={2.2}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>
      </Float>

      {/* Orbiting Tech Rings */}
      <mesh ref={ringRef} scale={2.8}>
        <torusGeometry args={[1, 0.02, 16, 100]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.6} wireframe />
      </mesh>

      <mesh ref={outerRingRef} scale={3.4} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1, 0.015, 16, 100]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.8} />
      </mesh>

      {/* Interconnected Skill Nodes */}
      {nodes.map((node, i) => (
        <Float key={i} speed={3 + i * 0.5} floatIntensity={1.5}>
          <mesh position={node.pos}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial 
              color={node.color} 
              emissive={node.color} 
              emissiveIntensity={0.8} 
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* Connecting Laser Energy Lines */}
      {nodes.map((node, i) => (
        <Line
          key={`line-${i}`}
          points={[[0, 0, 0], node.pos]}
          color={node.color}
          lineWidth={1.5}
          transparent
          opacity={0.4}
        />
      ))}
    </group>
  );
}

export default function LandingPage({ onGetStarted, onOpenLogin }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Background Animated Gradient Lights */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-10 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none animate-pulse" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-20 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                PeerNexus
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300">
                  v2.0
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Smart Campus Skill Barter & Project Platform</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition transform active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </nav>

      {/* HERO SECTION WITH 3D CANVAS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Text Banner */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-medium shadow-inner"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
            <span>Next-Gen Campus Skill & Capstone Collaboration Engine</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]"
          >
            Trade Skills. Build Capstones.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Empower Students.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0"
          >
            PeerNexus connects university students to barter specialized skills, form balanced hackathon and capstone project teams using AI matching, and reserve campus hardware labs with automated credit escrow.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Create Free Account</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 font-extrabold text-sm flex items-center justify-center gap-2 backdrop-blur-md transition"
            >
              <span>Log In to Platform</span>
            </button>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Smart Escrow Lock</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Jaccard Match AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>Cross-Device Sync</span>
            </div>
          </motion.div>

        </div>

        {/* Right 3D Interactive Model Canvas */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 h-[420px] sm:h-[480px] w-full relative rounded-3xl bg-slate-900/60 border border-slate-800/80 p-2 backdrop-blur-2xl shadow-2xl overflow-hidden group"
        >
          {/* Canvas Wrapper */}
          <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-950 relative">
            <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[10, 10, 5]} intensity={1.8} color="#06b6d4" />
              <pointLight position={[-10, -10, -5]} intensity={1.5} color="#a855f7" />
              
              <Landing3DScene />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
            </Canvas>

            {/* Glassmorphism Floating Cards */}
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md text-xs space-y-1 shadow-lg pointer-events-none">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                <span>Skill Exchange Engine</span>
              </div>
              <p className="text-[10px] text-slate-400">Barter React, PyTorch & CAD lessons</p>
            </div>

            <div className="absolute bottom-4 right-4 p-3 rounded-2xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-md text-xs space-y-1 shadow-lg pointer-events-none">
              <div className="font-bold text-purple-300 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-purple-400" />
                <span>Smart Hardware Booking</span>
              </div>
              <p className="text-[10px] text-slate-400">GPU Labs & IoT Workbench slots</p>
            </div>
          </div>
        </motion.div>

      </section>

      {/* FEATURES GRID SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Built Specially for <span className="text-cyan-400">Student Success</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to exchange knowledge, build portfolio project capstones, and access specialized hardware without spending money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/50 backdrop-blur-xl transition hover:-translate-y-1 space-y-4 group">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Credit Barter System</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn peer credits by teaching what you know. Use earned credits to request peer lessons in topics you want to master.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/50 backdrop-blur-xl transition hover:-translate-y-1 space-y-4 group">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Capstone Team Finder</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Post project vacancies or apply for specialized roles in machine learning, full-stack web, or embedded systems capstones.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/50 backdrop-blur-xl transition hover:-translate-y-1 space-y-4 group">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Jaccard AI Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent recommendation algorithm analyzes skill overlap and academic background to find compatible project partners.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/50 backdrop-blur-xl transition hover:-translate-y-1 space-y-4 group">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Campus Lab Booking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly check real-time availability for GPU compute clusters, discussion rooms, and hardware prototyping benches.
            </p>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-cyan-400" />
            <span className="font-bold text-slate-200">PeerNexus</span>
            <span>— University Peer Skill Exchange Platform</span>
          </div>
          <p className="text-slate-400">© 2026 PeerNexus. Ready for live testing.</p>
        </div>
      </footer>

    </div>
  );
}
