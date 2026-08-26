import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, 
  UserPlus, 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Globe,
  CheckCircle2
} from 'lucide-react';
import Canvas3DPreview from './Canvas3DPreview';
import { storageService } from '../services/storageService';

export default function AuthView({ onLoginSuccess, onRegisterSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'sync'
  const [error, setError] = useState(null);
  const [syncTokenInput, setSyncTokenInput] = useState('');

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('aarav@campus.edu');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register Form
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    customId: '',
    rollNo: '',
    branch: 'Computer Science & Engineering',
    skillsOffered: '',
    skillsWanted: ''
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError(null);
    try {
      onLoginSuccess(loginIdentifier, loginPassword);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials!');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!regForm.email || !regForm.password || !regForm.name) {
      setError('Please fill in all required fields!');
      return;
    }

    try {
      onRegisterSuccess({
        uniqueId: regForm.customId,
        name: regForm.name,
        email: regForm.email,
        password: regForm.password,
        rollNo: regForm.rollNo,
        branch: regForm.branch,
        skillsOffered: regForm.skillsOffered.split(',').map(s => s.trim()).filter(Boolean),
        skillsWanted: regForm.skillsWanted.split(',').map(s => s.trim()).filter(Boolean)
      });
    } catch (err) {
      setError(err.message || 'Registration failed!');
    }
  };

  const handleImportSync = (e) => {
    e.preventDefault();
    setError(null);
    if (!syncTokenInput.trim()) return;

    try {
      storageService.importSyncToken(syncTokenInput);
      setMode('login');
      alert('Device database synced successfully! You can now log in with your Unique ID.');
    } catch (err) {
      setError('Invalid Device Sync Token. Please copy the token from your primary device!');
    }
  };

  const fillDemoCredentials = (email) => {
    setLoginIdentifier(email);
    setLoginPassword('password123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      
      {/* Background Animated Gradient Lights */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-pulse" />

      {/* Main Split-Screen Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-slate-900/90 border border-slate-800/90 rounded-3xl max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 shadow-2xl overflow-hidden backdrop-blur-xl z-10"
      >
        
        {/* LEFT COLUMN: 3D INTERACTIVE CANVAS & FEATURE BANNER */}
        <div className="hidden lg:flex flex-col justify-between p-6 bg-slate-950/60 border-r border-slate-800/80 relative">
          
          {/* Top Brand Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">PeerNexus</span>
              <p className="text-[11px] text-slate-400 font-medium">Smart Campus Exchange Platform</p>
            </div>
          </div>

          {/* 3D Canvas Preview */}
          <div className="my-4 h-[340px] w-full">
            <Canvas3DPreview />
          </div>

          {/* Bottom Caption */}
          <div className="text-xs text-slate-400 relative z-10">
            <p className="leading-relaxed">
              Connect with peers for capstone projects, trade technical skills via escrow credits, and showcase your portfolio.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: AUTHENTICATION FORM (MOTION ANIMATED) */}
        <div className="p-6 md:p-8 flex flex-col justify-center space-y-6">
          
          {/* Mobile Header Brand */}
          <div className="lg:hidden text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">PeerNexus Login</h1>
            <p className="text-xs text-slate-400">Universal Cross-Device Authentication & Unique ID System</p>
          </div>

          {/* Form Mode Selector Pills */}
          <div className="grid grid-cols-3 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`py-2 rounded-xl transition ${
                mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`py-2 rounded-xl transition ${
                mode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setMode('sync'); setError(null); }}
              className={`py-2 rounded-xl transition ${
                mode === 'sync' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Device Sync
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* ANIMATED FORM CONTAINER */}
          <AnimatePresence mode="wait">
            
            {/* MODE 1: LOG IN */}
            {mode === 'login' && (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleLoginSubmit} 
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Student Email or Unique ID</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. stu-101 or aarav@campus.edu"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In Across Devices
                </motion.button>

                {/* Quick Demo Credentials Assistant */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 block font-medium">Quick Demo Accounts (Click to Auto-fill):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('aarav@campus.edu')}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-[11px] transition"
                    >
                      <div className="font-bold text-slate-200">Aarav Sharma</div>
                      <div className="text-slate-400 font-mono text-[10px]">stu-101</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoCredentials('priya@campus.edu')}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-[11px] transition"
                    >
                      <div className="font-bold text-slate-200">Priya Patel</div>
                      <div className="text-slate-400 font-mono text-[10px]">stu-102</div>
                    </button>
                  </div>
                </div>

              </motion.form>
            )}

            {/* MODE 2: SIGN UP */}
            {mode === 'register' && (
              <motion.form 
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleRegisterSubmit} 
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Custom Unique ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. stu-8819 (Leave blank to auto-generate)"
                    value={regForm.customId}
                    onChange={(e) => setRegForm({ ...regForm, customId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-indigo-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Campus Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex@campus.edu"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Create a password"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-indigo-500"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition mt-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Generate Unique ID & Register Account
                </motion.button>
              </motion.form>
            )}

            {/* MODE 3: DEVICE SYNC */}
            {mode === 'sync' && (
              <motion.form 
                key="sync"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleImportSync} 
                className="space-y-4 text-xs"
              >
                <div className="space-y-2">
                  <label className="block text-slate-300 font-semibold">Paste Device Sync Token</label>
                  <p className="text-[11px] text-slate-400">
                    Generate a Sync Token on your primary device (from Portfolio settings) and paste it here to instantly sync all accounts and trade history!
                  </p>
                  <textarea
                    rows={4}
                    required
                    placeholder="Paste base64 Device Sync Token here..."
                    value={syncTokenInput}
                    onChange={(e) => setSyncTokenInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono text-[10px] focus:border-indigo-500"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
                >
                  <Globe className="h-4 w-4" />
                  Sync Accounts to This Device
                </motion.button>
              </motion.form>
            )}

          </AnimatePresence>

        </div>

      </motion.div>

    </div>
  );
}
