import React from 'react';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <Activity className="w-5 h-5 text-teal-400" />
          <span className="font-bold text-slate-300">AetherMed 3D Clinical RAG Engine</span>
          <span className="font-mono text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-teal-400">
            Enterprise Edition
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-400 bg-amber-950/20 border border-amber-500/20 px-3 py-1.5 rounded-xl">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Clinical Decision Support System Demo • Peer-Reviewed RAG Architecture</span>
        </div>

        <div className="font-mono text-[11px]">
          Powered by <span className="text-teal-400 font-bold">Three.js</span>, <span className="text-teal-400 font-bold">Framer Motion</span> & <span className="text-teal-400 font-bold">Gemini RAG</span>
        </div>

      </div>
    </footer>
  );
}
