import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Send, 
  Key, 
  Lightbulb, 
  FileText, 
  Users, 
  X,
  CheckCircle2
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function AIAdvisorModal({ isOpen, onClose, currentUser }) {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${currentUser.name}! I am your CampusForge AI Academic & Teammate Advisor. Ask me for project ideation based on your tech stack, capstone proposal writing tips, or missing teammate role suggestions!`
    }
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    if (!customPrompt) setPrompt('');
    setLoading(true);

    try {
      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(
          `You are an expert Computer Science Professor and B.Tech Final Year Project Mentor. Answer concisely in clean markdown: ${textToSend}`
        );
        const responseText = result.response.text();
        setMessages([...newMessages, { role: 'assistant', content: responseText }]);
      } else {
        // Smart fallback response if API key is not present
        setTimeout(() => {
          let fallbackText = '';
          if (textToSend.toLowerCase().includes('idea')) {
            fallbackText = `💡 **Recommended 4th Year B.Tech Project Ideas:**\n1. **AI-Powered Code Security & OWASP Scanner**: React frontend + Node.js backend using AST parsing to flag code vulnerabilities.\n2. **Distributed Microservices Health Monitor**: Containerized Docker dashboard tracking RAM/CPU load across nodes.\n3. **Campus Resource Smart Booking**: Real-time room reservation system with conflict detection algorithms.`;
          } else if (textToSend.toLowerCase().includes('bio') || textToSend.toLowerCase().includes('profile')) {
            fallbackText = `✨ **Optimized Profile Bio Suggestion:**\n"Final-year CS undergrad specialized in ${currentUser.skillsOffered.slice(0, 3).join(', ')}. Currently building real-time full-stack tools and seeking collaborators proficient in ${currentUser.skillsWanted.join(' & ')}."`;
          } else {
            fallbackText = `🎯 **Academic Recommendation:** For a top grade in your 4th-year project viva, focus on demonstrating 3 key software engineering metrics: (1) Algorithmic complexity bounds, (2) Clean modular architecture, and (3) Concrete unit test coverage.`;
          }
          setMessages([...newMessages, { role: 'assistant', content: fallbackText }]);
          setLoading(false);
        }, 1000);
        return;
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `⚠️ Note: ${err.message || 'Could not fetch response'}. Enter a valid Gemini API Key above to activate full live AI responses!` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full h-[600px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Gemini AI Project & Teammate Advisor</h3>
              <p className="text-[11px] text-slate-400">Intelligent Capstone Mentor & Code Ideator</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* API Key Input Banner */}
        <div className="px-4 py-2 bg-purple-950/40 border-b border-purple-500/20 flex items-center gap-2 text-xs">
          <Key className="h-4 w-4 text-purple-400 shrink-0" />
          <input
            type="password"
            placeholder="Optional Gemini API Key (Leaves empty for offline demo mode)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-slate-950/80 border border-purple-500/30 rounded px-2 py-1 text-slate-200 focus:outline-none text-[11px]"
          />
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => handleSend('Suggest 3 novel final year CS capstone project ideas using React and PyTorch')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 whitespace-nowrap"
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            Suggest Project Ideas
          </button>

          <button
            onClick={() => handleSend('How can I structure my final year CS project report for maximum marks?')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 whitespace-nowrap"
          >
            <FileText className="h-3.5 w-3.5 text-purple-400" />
            Viva & Report Tips
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/50 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="h-7 w-7 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-purple-300" />
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl max-w-[80%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-slate-400 text-xs">
              <Sparkles className="h-4 w-4 animate-spin text-purple-400" />
              AI is thinking...
            </div>
          )}
        </div>

        {/* Footer Input */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI for project recommendations..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
