import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, 
  UserPlus, 
  GraduationCap, 
  Lock, 
  Mail, 
  AlertCircle, 
  ShieldCheck, 
  Globe, 
  ArrowLeft,
  Loader2
} from 'lucide-react';
import InteractiveMouseCanvas from './InteractiveMouseCanvas';
import { storageService } from '../services/storageService';

export default function AuthView({ onLoginSuccess, onRegisterSuccess, onBackToLanding }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'sync'
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [syncTokenInput, setSyncTokenInput] = useState('');

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form (Start completely blank for real user input)
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    customId: '',
    rollNo: '',
    branch: '',
    year: '',
    skillsOffered: '',
    skillsWanted: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await onLoginSuccess(loginIdentifier, loginPassword);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!regForm.email || !regForm.password || !regForm.name) {
      setError('Please fill in all required fields!');
      return;
    }

    setIsLoading(true);
    try {
      await onRegisterSuccess({
        uniqueId: regForm.customId,
        name: regForm.name,
        email: regForm.email,
        password: regForm.password,
        rollNo: regForm.rollNo,
        branch: regForm.branch,
        year: regForm.year,
        skillsOffered: regForm.skillsOffered ? regForm.skillsOffered.split(',').map(s => s.trim()).filter(Boolean) : [],
        skillsWanted: regForm.skillsWanted ? regForm.skillsWanted.split(',').map(s => s.trim()).filter(Boolean) : []
      });
    } catch (err) {
      setError(err.message || 'Registration failed!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportSync = (e) => {
    e.preventDefault();
    setError(null);
    if (!syncTokenInput.trim()) return;

    try {
      storageService.importSyncToken(syncTokenInput);
      setMode('login');
      alert('Device database synced successfully! You can now log in with your credentials.');
    } catch (err) {
      setError('Invalid Device Sync Token. Please check the token string!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 md:p-8 overflow-y-auto selection:bg-cyan-500 selection:text-slate-950">
      <InteractiveMouseCanvas className="z-0" />

      {/* Main Container */}
      <div className="max-w-5xl w-full flex flex-col space-y-4 z-10">
        
        {/* Top Header Row with Landing Page Navigation */}
        <div className="flex items-center justify-between px-2">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Landing Page</span>
            </button>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Encrypted Supabase Cloud Auth</span>
          </div>
        </div>

        {/* Main Split-Screen Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-slate-900/90 border border-slate-800/90 rounded-3xl max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          
          {/* LEFT COLUMN: 3D INTERACTIVE CANVAS & FEATURE BANNER */}
          <div className="hidden lg:flex flex-col justify-between p-6 bg-slate-950/70 border-r border-slate-800/80 relative">
            
            {/* Top Brand Logo */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">PeerNexus</span>
                <p className="text-[11px] text-slate-400 font-medium">Smart Campus Platform</p>
              </div>
            </div>

            <div className="my-auto py-8 space-y-4">
              <h2 className="text-xl font-bold text-white leading-tight">
                Empowering Students to Trade Skills & Build Capstones Together
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with students and teachers for capstone projects, trade technical skills via escrow credits, and sync your account across all mobile and desktop devices.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: AUTHENTICATION FORM */}
          <div className="p-6 md:p-8 flex flex-col justify-center space-y-6">
            
            {/* Mobile Header Brand */}
            <div className="lg:hidden text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/25">
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
                  mode === 'login' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => { setMode('register'); setError(null); }}
                className={`py-2 rounded-xl transition ${
                  mode === 'register' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => { setMode('sync'); setError(null); }}
                className={`py-2 rounded-xl transition ${
                  mode === 'sync' ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
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
                    <label className="block text-slate-300 font-semibold mb-1">Email or Unique ID</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your email or Unique ID"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
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
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </>
                    )}
                  </motion.button>
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
                  className="space-y-3 text-xs max-h-[420px] overflow-y-auto pr-1"
                >
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Create a password"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Department / Branch</label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science / Physics"
                        value={regForm.branch}
                        onChange={(e) => setRegForm({ ...regForm, branch: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Role / Year</label>
                      <input
                        type="text"
                        placeholder="e.g. Student 3rd Year / Faculty"
                        value={regForm.year}
                        onChange={(e) => setRegForm({ ...regForm, year: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Custom Unique ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="Leave blank to auto-generate"
                      value={regForm.customId}
                      onChange={(e) => setRegForm({ ...regForm, customId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 font-mono text-[11px]"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition mt-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>Register Account</span>
                      </>
                    )}
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
                      Generate a Sync Token on your primary device (from Portfolio settings) and paste it here to sync accounts and trade history!
                    </p>
                    <textarea
                      rows={4}
                      required
                      placeholder="Paste base64 Device Sync Token here..."
                      value={syncTokenInput}
                      onChange={(e) => setSyncTokenInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono text-[10px] focus:border-cyan-500"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
                  >
                    <Globe className="h-4 w-4" />
                    Sync Database to This Device
                  </motion.button>
                </motion.form>
              )}

            </AnimatePresence>

          </div>

        </motion.div>

      </div>

    </div>
  );
}
