import React from 'react';
import { Sparkles, Command } from 'lucide-react';

export default function Header({ onHome }) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 px-8 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/[0.01] border border-white/[0.04] backdrop-blur-2xl px-10 py-6 rounded-[30px] shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <button 
          onClick={onHome}
          className="flex items-center gap-5 relative z-10 transition-transform active:scale-95"
        >
          <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] group/logo overflow-hidden relative">
            <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover/logo:translate-y-0 transition-transform duration-500"></div>
            <Command size={28} className="relative z-10 group-hover/logo:text-white transition-colors duration-500" />
          </div>
          <div className="text-right">
            <h1 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
              نـيـورال <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Neural Prompt Engine</p>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-12 relative z-10">
          {['القدرات', 'الأسعار', 'التوثيق'].map((item, i) => (
            <button key={i} className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-indigo-400 transition-all">
              {item}
            </button>
          ))}
          <div className="w-[1px] h-4 bg-white/[0.08] mx-2"></div>
          <button className="flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all transform active:scale-95">
            <Sparkles size={14} />
            النسخة الاحترافية
          </button>
        </nav>
      </div>
    </header>
  );
}
