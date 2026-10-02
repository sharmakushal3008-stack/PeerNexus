import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Send, 
  Lightbulb, 
  FileText, 
  X
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function AIAdvisorModal({ isOpen, onClose, currentUser }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${currentUser.name}! I am your PeerNexus AI Academic & Teammate Advisor powered by Google Gemini. Ask me for project ideation based on your tech stack, capstone proposal writing tips, or missing teammate role suggestions!`
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
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(
        `You are an expert Computer Science Professor and B.Tech Final Year Project Mentor. Answer concisely in clean markdown: ${textToSend}`
      );
      const responseText = result.response.text();
      setMessages([...newMessages, { role: 'assistant', content: responseText }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `⚠️ Error from Gemini AI: ${err.message || 'Failed to generate response. Please check network connection or API key validity.'}` }
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
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-[11px] text-emerald-400 font-medium">Active Gemini 1.5 Flash Connected</p>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => handleSend('Suggest 3 novel final year CS capstone project ideas using React and PyTorch')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-indigo-500 font-semibold border border-slate-700 whitespace-nowrap shadow-xs transition"
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            Suggest Project Ideas
          </button>

          <button
            onClick={() => handleSend('How can I structure my final year CS project report for maximum marks?')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-purple-500 font-semibold border border-slate-700 whitespace-nowrap shadow-xs transition"
          >
            <FileText className="h-3.5 w-3.5 text-purple-500" />
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
