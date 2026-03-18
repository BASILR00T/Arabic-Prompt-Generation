import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Zap, Sparkles, Languages, ChevronRight, Copy, Check,
  RefreshCcw, Terminal, Cpu, Layers, ShieldCheck,
  Layout, Target, Github, Monitor, Box, Search,
  ArrowUpRight, List, Grid, Smartphone, Laptop,
  Code, Eye, Send, Command, AlertCircle
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';

import developmentDoc from '../docs/DEVELOPMENT.md?raw';
import geminiContractDoc from '../docs/GEMINI_PROMPT_CONTRACT.md?raw';
import troubleshootingDoc from '../docs/TROUBLESHOOTING.md?raw';
import uxGuideDoc from '../docs/UX_GUIDE.md?raw';
import vibeCodingProDoc from '../docs/VIBE_CODING_PRO.md?raw';
import contributingDoc from '../docs/CONTRIBUTING.md?raw';

import vibeModeConfig from './config/vibeModeConfig.json';

// Workaround for ESLint `no-unused-vars` not recognizing `<motion.*>` JSX usage.
void motion;

/**
 * PROMPT ENGINEERING CONFIG
 */

// Quick templates moved to `src/config/vibeModeConfig.json`.

const fetchEnhancedPrompt = async (input, type, options) => {
  const trimmed = String(input || "").trim();
  if (!trimmed) throw new Error("Input is empty.");

  // Secure path: always call our serverless proxy so Gemini API key never reaches the browser.
  try {
    const resp = await fetch("/api/vibe/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: trimmed,
        promptType: type,
        options
      })
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.error || resp.statusText);

    if (
      !data ||
      typeof data.englishPrompt !== "string" ||
      typeof data.arabicSummary !== "string"
    ) {
      throw new Error("Invalid response contract from /api/vibe/generate");
    }

    return data;
  } catch (err) {
    throw new Error(
      "Failed to call /api/vibe/generate. For local testing, run the serverless endpoints (e.g. `vercel dev`) or deploy the API."
    );
  }
};

/**
 * UI COMPONENTS
 */

const GlassCard = ({ children, className = "" }) => (
  <div className={`glass rounded-[2rem] p-8 ${className}`}>
    {children}
  </div>
);

const MacHeader = ({ title }) => (
  <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.05] bg-white/[0.02]">
    <div className="flex gap-2">
      <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
      <div className="w-3 h-3 rounded-full bg-[#FEB12F]"></div>
      <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
    </div>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
    <div className="w-10"></div>
  </div>
);

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    type="button"
    onClick={onClick}
    data-ux-role="tab"
    className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-lg scale-102' : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'
      }`}
  >
    {Icon && <Icon size={14} />}
    {children}
  </button>
);

var CustomSelectDuplicate1 = ({ value, onChange, options, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4 relative" ref={containerRef} data-ux-role="tech-select">
      <label className="text-[10px] font-black text-slate-600 flex items-center gap-2 uppercase tracking-widest leading-none">
        {Icon && <Icon size={14} className="text-indigo-500" />} {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl text-xs text-slate-300 outline-none flex items-center justify-between cursor-pointer hover:border-white/[0.2] transition-all"
      >
        <span>{value}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronRight size={14} className="rotate-90" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#0C0C0D] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <div
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`px-5 py-4 text-xs cursor-pointer transition-colors hover:bg-white/[0.05] ${value === opt ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

var ProcessingOverlayDuplicate1 = () => (
  <div className="absolute inset-0 z-50 bg-[#040404]/80 backdrop-blur-md flex flex-col items-center justify-center p-8">
    <div className="relative w-32 h-32 mb-12">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-[3px] border-indigo-500/10 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 border-[3px] border-indigo-500/40 border-t-indigo-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.3)]"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-12 bg-white rounded-full flex items-center justify-center shadow-2xl"
      >
        <Zap size={20} className="text-black fill-current" />
      </motion.div>
    </div>
    <div className="text-center space-y-4">
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-black tracking-tighter uppercase"
      >
        Neural Synthesis
      </motion.h3>
      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] animate-pulse">
           جاري معالجة البيانات...
        </p>
        <p className="text-[8px] text-slate-500 uppercase tracking-widest max-w-[200px] leading-loose">
          Translating intent into optimized technical architecture via Gemini 2.5 Flash Lite
        </p>
      </div>
    </div>
  </div>
);

var CustomSelectDuplicate2 = ({ value, onChange, options, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4 relative" ref={containerRef}>
      <label className="text-[10px] font-black text-slate-600 flex items-center gap-2 uppercase tracking-widest leading-none">
        {Icon && <Icon size={14} className="text-indigo-500" />} {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl text-xs text-slate-300 outline-none flex items-center justify-between cursor-pointer hover:border-white/[0.2] transition-all"
      >
        <span>{value}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronRight size={14} className="rotate-90" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#0C0C0D] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <div
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`px-5 py-4 text-xs cursor-pointer transition-colors hover:bg-white/[0.05] ${value === opt ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

var ProcessingOverlayDuplicate2 = () => (
  <div className="absolute inset-0 z-50 bg-[#040404]/80 backdrop-blur-md flex flex-col items-center justify-center p-8">
    <div className="relative w-32 h-32 mb-12">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-[3px] border-indigo-500/10 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 border-[3px] border-indigo-500/40 border-t-indigo-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.3)]"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-12 bg-white rounded-full flex items-center justify-center shadow-2xl"
      >
        <Zap size={20} className="text-black fill-current" />
      </motion.div>
    </div>
    <div className="text-center space-y-4">
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-black tracking-tighter uppercase"
      >
        Neural Synthesis
      </motion.h3>
      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] animate-pulse">
           جاري معالجة البيانات...
        </p>
        <p className="text-[8px] text-slate-500 uppercase tracking-widest max-w-[200px] leading-loose">
          Translating intent into optimized technical architecture via Gemini 2.5 Flash Lite
        </p>
      </div>
    </div>
  </div>
);

var CustomSelect = ({ value, onChange, options, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4 relative" ref={containerRef} data-ux-role="tech-select">
      <label className="text-[10px] font-black text-slate-600 flex items-center gap-2 uppercase tracking-widest leading-none">
        {Icon && <Icon size={14} className="text-indigo-500" />} {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/[0.03] border border-white/[0.08] p-3 sm:p-4 rounded-2xl text-[10px] sm:text-xs text-slate-300 outline-none flex items-center justify-between cursor-pointer hover:border-white/[0.2] transition-all"
      >
        <span className="truncate text-right max-w-[190px]">{value}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronRight size={14} className="rotate-90" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#0C0C0D] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <div
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`px-5 py-4 text-xs cursor-pointer transition-colors hover:bg-white/[0.05] ${value === opt ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-400'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

var ProcessingOverlay = () => (
  <div className="absolute inset-0 z-50 bg-[#040404]/80 backdrop-blur-md flex flex-col items-center justify-center p-8">
    <div className="relative w-32 h-32 mb-12">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-[3px] border-indigo-500/10 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 border-[3px] border-indigo-500/40 border-t-indigo-500 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.3)]"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-12 bg-white rounded-full flex items-center justify-center shadow-2xl"
      >
        <Zap size={20} className="text-black fill-current" />
      </motion.div>
    </div>
    <div className="text-center space-y-4">
      <motion.h3 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-black tracking-tighter uppercase"
      >
        Neural Synthesis
      </motion.h3>
      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] animate-pulse">
           جاري معالجة البيانات...
        </p>
        <p className="text-[8px] text-slate-500 uppercase tracking-widest max-w-[200px] leading-loose">
          Translating intent into optimized technical architecture via Gemini 2.5 Flash Lite
        </p>
      </div>
    </div>
  </div>
);

/**
 * MAIN APP
 */

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const isSmallScreen =
    typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;

  const [view, setView] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/mobile")) {
        return "mobile_app";
      }
    } catch {
      // ignore
    }
    return "landing";
  });

  const isMobileRoutePath =
    typeof window !== "undefined" && window.location.pathname.startsWith("/mobile");
  const goWorkspace = () => {
    setWorkspacePanel("input");
    setView(isMobileRoutePath ? "mobile_app" : "app");
  };

  const [docsSelectedId, setDocsSelectedId] = useState('DEVELOPMENT');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [promptType, setPromptType] = useState('coding');
  const [workspacePanel, setWorkspacePanel] = useState("input"); // "input" | "output"
  const [integrationIde, setIntegrationIde] = useState("cursor");
  const [options, setOptions] = useState({
    ...vibeModeConfig.defaultsByMode.coding
  });
  const focusIconById = {
    Logic: <Cpu size={14} />,
    UI: <Layout size={14} />,
    Security: <ShieldCheck size={14} />,
    Optimization: <RefreshCcw size={14} />,
    Testing: <Check size={14} />,
    Architecture: <Box size={14} />,

    Style: <Sparkles size={14} />,
    Composition: <Layout size={14} />,
    Lighting: <Target size={14} />,
    Realism: <Eye size={14} />,
    Typography: <Code size={14} />,
    Branding: <Box size={14} />,

    Tone: <Sparkles size={14} />,
    Structure: <Layout size={14} />,
    Audience: <Target size={14} />,
    Clarity: <Check size={14} />,
    Creativity: <Eye size={14} />,

    Strategy: <Target size={14} />,
    Planning: <Grid size={14} />,
    Diagnostics: <Search size={14} />,
    Safety: <ShieldCheck size={14} />,
    Quality: <Check size={14} />,
    Communication: <List size={14} />
  };

  const goalOptions = vibeModeConfig.goalsByMode[promptType] || [];
  const focusOptions = (vibeModeConfig.focusByMode[promptType] || []).map((f) => ({
    ...f,
    icon: focusIconById[f.id] || <Box size={14} />
  }));

  const techStacks = vibeModeConfig.techStacksByMode[promptType] || [];
  const visibleQuickTemplates = (vibeModeConfig.quickTemplates || []).filter((t) =>
    Array.isArray(t.promptTypes) ? t.promptTypes.includes(promptType) : true
  );

  // Local “Evolution Log” so Coding (Pro) can improve over repeated runs.
  const EVOLUTION_LOG_KEY = "arabic_prompt_pro_evolution_log_v1";
  const EVOLUTION_CONTEXT_LAST_N = 5;
  const EVOLUTION_LOG_MAX_ENTRIES = 10;

  // Persist last output so Integration remains usable after refresh.
  const LAST_OUTPUT_STORAGE_KEY = "arabic_prompt_pro_last_output_v1";

  const [evolutionFeedback, setEvolutionFeedback] = useState("");
  const [evolutionLog, setEvolutionLog] = useState([]);

  useEffect(() => {
    // Load stored evolution history (best-effort; never block UI on storage errors).
    try {
      const raw = localStorage.getItem(EVOLUTION_LOG_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setEvolutionLog(parsed);
    } catch (e) {
      console.warn("Failed to load Evolution Log from localStorage:", e);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_OUTPUT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // Keep it strict: only restore if englishPrompt exists.
      if (typeof parsed?.englishPrompt === "string") {
        setOutput(parsed);
      }
    } catch (e) {
      console.warn("Failed to load last output from localStorage:", e);
    }
  }, []);

  useEffect(() => {
    // When switching mode tabs, reset Goal/Focus to mode defaults and clear output to avoid confusion.
    setWorkspacePanel("input");
    setOutput(null);
    setError(null);
    setCopied(false);
    setOptions((prev) => ({
      ...prev,
      ...(vibeModeConfig.defaultsByMode[promptType] || {})
    }));
  }, [promptType]);

  const revealVariants = prefersReducedMotion || isSmallScreen
    ? {
        hidden: { opacity: 0, y: 0 },
        show: () => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0 },
        }),
      }
    : {
        hidden: { opacity: 0, y: 18 },
        show: (i) => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" },
        }),
      };

  const handleGenerate = async (templatePrompt = null) => {
    const rawInput = templatePrompt || input;
    if (!rawInput.trim() || loading) return;

    // Inject Evolution Context only for Coding (Pro).
    const evolutionContext =
      promptType === "coding"
        ? (() => {
            const recent = (evolutionLog || []).slice(0, EVOLUTION_CONTEXT_LAST_N);
            const notes = evolutionFeedback.trim();
            if (recent.length === 0 && !notes) return null;

            const recentBlock = recent
              .map((e, idx) => {
                const ts = e?.ts ? String(e.ts) : "";
                const focus = e?.focus ? String(e.focus) : "";
                const goal = e?.goal ? String(e.goal) : "";
                const lesson = e?.arabicSummary ? String(e.arabicSummary) : "";
                return `${idx + 1}) ${ts} | Focus=${focus} | Goal=${goal}\n   - Lesson: ${lesson}`;
              })
              .join("\n");

            const notesLine = notes ? notes : "لا توجد ملاحظات إضافية.";

            return `[EVOLUTION_CONTEXT]\n${recentBlock ? `Recent Evolution Log:\n${recentBlock}\n` : ""}Current Evolution Notes:\n${notesLine}\n[/EVOLUTION_CONTEXT]`;
          })()
        : null;

    const finalInput = evolutionContext ? `${rawInput}\n\n${evolutionContext}` : rawInput;

    setLoading(true);
    setError(null);
    goWorkspace();
    try {
      const result = await fetchEnhancedPrompt(finalInput, promptType, options);
      setOutput(result);
      setWorkspacePanel("output");
      // Persist last output for IDE integration.
      try {
        localStorage.setItem(
          LAST_OUTPUT_STORAGE_KEY,
          JSON.stringify({ ...result, savedAt: new Date().toISOString() })
        );
      } catch (e) {
        console.warn("Failed to persist last output:", e);
      }

      if (promptType === "coding") {
        const usedFeedback = evolutionFeedback.trim();
        const entry = {
          id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
          ts: new Date().toISOString(),
          focus: options.focus,
          goal: options.goal,
          arabicSummary: result?.arabicSummary || "",
          evolutionFeedback: usedFeedback || null
        };

        setEvolutionLog((prev) => {
          const next = [entry, ...(prev || [])].slice(0, EVOLUTION_LOG_MAX_ENTRIES);
          try {
            localStorage.setItem(EVOLUTION_LOG_KEY, JSON.stringify(next));
          } catch (e) {
            console.warn("Failed to persist Evolution Log:", e);
          }
          return next;
        });

        // Prevent the same notes from being re-injected repeatedly.
        setEvolutionFeedback("");
      }
    } catch (err) {
      setError(err.message);
      setWorkspacePanel("output");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!output?.englishPrompt) return;
    navigator.clipboard.writeText(output.englishPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const landingPage = (
    <div className="relative pt-20 pb-40" dir="rtl">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-5 py-2 glass rounded-full flex items-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]"
        >
          <Sparkles size={14} />
          بوابة هندسة الأوامر الذكية
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-7xl md:text-9xl font-black tracking-tight leading-[0.9] mb-12"
        >
          <span className="text-white">حوّل فكرتك</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-800 tracking-[-0.05em]">
            إلى برومبت برمجي احترافي
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 text-xl max-w-2xl leading-relaxed mb-16 font-medium selection:bg-indigo-500/30"
        >
          حوّل أفكارك بالعربية إلى برومبتات هندسية دقيقة ومهيكلة—جاهزة لأي وكيل برمجي للتنفيذ بسرعة وثقة.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 mb-32"
        >
          <button
            type="button"
            onClick={goWorkspace}
            className="px-12 py-6 bg-white text-black rounded-3xl font-black uppercase text-[11px] tracking-widest flex items-center gap-4 hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.3)] transition-all animate-float"
          >
            ابدأ مشروعك الآن
            <ArrowUpRight size={18} />
          </button>
          <button
            type="button"
            onClick={() => setView("docs")}
            className="px-12 py-6 glass text-white rounded-3xl font-black uppercase text-[11px] tracking-widest hover:bg-white/[0.05] transition-all"
          >
            توثيق المنصة
          </button>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: ShieldCheck, title: "مستوى المؤسسات", desc: "أوامر برمجية تتبع أدق معايير الأمان العالمية وهيكلية الكود النظيف." },
          { icon: Cpu, title: "منطق فورتكس", desc: "محرك معالجة سياقي يفهم الأدوات والتقنيات الحديثة بعمق تقني يفوق التوقعات." },
          { icon: Target, title: "دقة استثنائية", desc: "ضبط دقيق لكل مخرج بناءً على لغة البرمجة أو الهدف التقني المحدد للمشروع." }
        ].map((f, i) => (
          <GlassCard key={i} className="group hover:border-indigo-500/30 transition-all cursor-default">
            <div className="p-4 bg-indigo-500/10 rounded-2xl w-fit mb-8 text-indigo-400 group-hover:scale-110 transition-transform">
              <f.icon size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
          </GlassCard>
        ))}
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-8 mt-24">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <div className="px-5 py-2 glass rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
            كيف تعمل المنصة
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            خطوة بخطوة من الفكرة إلى برومبت جاهز
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-3xl leading-relaxed">
            اكتب مطلبك بالعربية، اختر وضعك وهدفك، ثم استلم برومبت إنجليزي مُهيكل يساعد أي وكيل برمجي على التنفيذ بثقة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              title: "1) اكتب بالعربية",
              desc: "حوّل فكرتك إلى متطلبات واضحة بدون تعقيد."
            },
            {
              title: "2) اختر الوضع والهدف",
              desc: "Coding (Pro) أو توليد الصور أو كتابة إبداعية أو عام."
            },
            {
              title: "3) توليد برومبت مُهيكل",
              desc: "صياغة دقيقة مع تركيز على المنطق/الأمان/الأداء."
            },
            {
              title: "4) نفّذ مع أي وكيل",
              desc: "Claude Code، Gemini، أو أي نموذج برمجي آخر."
            }
          ].map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="glass rounded-[2.2rem] p-7 border border-white/[0.05] bg-white/[0.01]"
            >
              <div className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.25em] mb-4">
                {step.title}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Value */}
      <section className="max-w-7xl mx-auto px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7">
            <GlassCard className="p-10">
              <h3 className="text-2xl md:text-3xl font-black mb-6">
                مصمم لتجربة عربية من البداية للنهاية
              </h3>
              <div className="space-y-4">
                {[
                  "واجهة RTL كاملة للقراءة والكتابة المريحة.",
                  "وضع Coding (Pro) مع Evolution Log لتحسين الجولات لاحقًا.",
                  "خروج برومبت إنجليزي جاهز للنسخ والاستخدام فورًا."
                ].map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/70 mt-2" />
                    <p className="text-slate-300 text-sm leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <GlassCard className="p-10 flex-1">
              <h3 className="text-2xl font-black mb-6">وضعيات جاهزة</h3>
              <div className="space-y-4">
                {[
                  { label: "Coding (Pro)", desc: "برومبت برمجي مُهيكل لوكيل مستقل." },
                  { label: "توليد الصور", desc: "مواصفات واضحة للستايل والتكوين والإعدادات." },
                  { label: "كتابة إبداعية", desc: "نبرة وهيكلة وتسليم نص نهائي." },
                  { label: "عام", desc: "خطة + تحقق + أسئلة عند الحاجة." }
                ].map((x) => (
                  <div key={x.label} className="p-4 rounded-2xl border border-white/[0.05] bg-white/[0.01]">
                    <div className="text-sm font-black text-white mb-1">{x.label}</div>
                    <div className="text-slate-500 text-xs leading-relaxed">{x.desc}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="glass rounded-[2.5rem] p-8 border border-white/[0.05] bg-white/[0.01] flex flex-col gap-5">
              <div>
                <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.35em] mb-3">
                  جاهز للبدء؟
                </div>
                <div className="text-2xl font-black">ابدأ مشروعك خلال دقيقة</div>
              </div>
              <button
                type="button"
                onClick={goWorkspace}
                className="w-full py-5 rounded-3xl font-black transition-all bg-white text-black hover:bg-slate-200 active:scale-[0.98] shadow-2xl"
              >
                ابدأ مشروعك الآن
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  const toolWorkspace = (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4 sm:pt-8 sm:pb-4 h-[calc(100dvh-5rem)] overflow-hidden flex flex-col"
      dir="rtl"
    >
      {/* Top Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-8">
        <div className="flex items-center gap-2 glass p-1.5 rounded-full" data-ux-role="workspace-tabs">
          <TabButton active={promptType === 'coding'} onClick={() => setPromptType('coding')} icon={Code}>البرمجة (Pro)</TabButton>
          <TabButton active={promptType === 'image'} onClick={() => setPromptType('image')} icon={Eye}>توليد الصور</TabButton>
          <TabButton active={promptType === 'writing'} onClick={() => setPromptType('writing')} icon={Sparkles}>كتابة إبداعية</TabButton>
          <TabButton active={promptType === 'general'} onClick={() => setPromptType('general')} icon={Languages}>عام</TabButton>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> المحرك نشط</span>
            <span className="opacity-20">/</span>
            <span>Gemini 2.0 Flash-Lite</span>
          </div>
          <p className="text-[9px] text-indigo-300/80 leading-relaxed text-right">
            ملاحظة: النسخة العامة تستخدم Gemini API بالمستوى المجاني/المحدود وقد تصل لحد الاستخدام.
            عند النشر استخدم مفتاحك الخاص عبر السيرفر لتفادي القيود.
          </p>
        </div>
      </div>

      {/* Panel Toggle (Input vs Output) */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 glass p-1.5 rounded-full" data-ux-role="workspace-panels">
          <button
            type="button"
            onClick={() => setWorkspacePanel("input")}
            data-ux-role="panel-input"
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              workspacePanel === "input"
                ? "bg-white text-black shadow-lg"
                : "text-slate-500 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            الإدخال
          </button>
          <button
            type="button"
            onClick={() => setWorkspacePanel("output")}
            disabled={!output && !loading && !error}
            data-ux-role="panel-output"
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              workspacePanel === "output"
                ? "bg-white text-black shadow-lg"
                : "text-slate-500 hover:text-white hover:bg-white/[0.05]"
            } ${
              !output && !loading && !error
                ? "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-500"
                : ""
            }`}
          >
            الإخراج
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative overflow-hidden">
        {/* Input Pane */}
        {workspacePanel === "input" && (
        <motion.div
          className="lg:col-span-12 h-full min-h-0 space-y-3 sm:space-y-5 relative"
          variants={revealVariants}
          initial="hidden"
          animate="show"
          custom={0}
        >
          <div className="bg-[#080808] rounded-[2.5rem] border border-white/[0.05] shadow-2xl overflow-hidden glass transition-all flex flex-col h-full">
            <MacHeader title="Requirements Input / مدخلات المشروع" />
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
              <AnimatePresence>
                {loading && <ProcessingOverlay />}
              </AnimatePresence>
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                dir="rtl"
                placeholder="صف طلبك التقني بالتفصيل... (مثال: أحتاج تطبيق لإدارة المهام باستخدام React و PostGres مع التركيز على الأداء العالي)"
                className="w-full h-28 sm:h-36 md:h-40 lg:h-44 bg-transparent text-base sm:text-xl leading-relaxed text-slate-200 outline-none resize-none placeholder:text-slate-800 font-medium font-arabic transition-all"
              />

              {/* Quick Templates (compact row) */}
              <div className="space-y-3" data-ux-role="quick-templates">
                <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">مكتبة الأوامر السريعة</h4>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                  {visibleQuickTemplates.map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => {
                        setInput(t.prompt);
                        handleGenerate(t.prompt);
                      }}
                      data-ux-role="quick-template"
                      className="snap-start shrink-0 min-w-[200px] max-w-[200px] p-3 sm:p-4 glass rounded-2xl text-right border-white/[0.03] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <ArrowUpRight
                          size={14}
                          className="text-slate-800 group-hover:text-indigo-400 transition-colors"
                        />
                        <span className="text-[11px] font-bold text-slate-300">{t.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-600">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 border-t border-white/[0.03] space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                  <CustomSelect 
                    label="التقنيات المستخدمة (Tech Stack)"
                    icon={Laptop}
                    value={options.language}
                    onChange={(val) => setOptions({ ...options, language: val })}
                    options={techStacks}
                  />
                  
                  <div className="space-y-3 text-right">
                    <label className="text-[10px] font-black text-slate-600 flex items-center justify-end gap-2 uppercase tracking-widest leading-none">
                      الهدف من العملية <Target size={14} className="text-indigo-500" />
                    </label>
                  <div className="flex glass p-1 rounded-2xl">
                      {goalOptions.map(g => (
                        <button type="button"
                          key={g.id}
                          onClick={() => setOptions({ ...options, goal: g.id })}
                          data-ux-role="goal-option"
                          className={`flex-1 py-2.5 sm:py-3 rounded-xl text-[10px] font-black uppercase transition-all ${options.goal === g.id ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          {g.ar}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.div
                  className="space-y-5 text-right"
                  variants={revealVariants}
                  initial="hidden"
                  animate="show"
                  custom={2}
                >
                  <label className="text-[10px] font-black text-slate-600 flex items-center justify-end gap-2 uppercase tracking-widest">
                    شبكة الدقة - التركيز الأساسي (Focus Area) <Grid size={14} className="text-indigo-500" />
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3" dir="rtl">
                    {focusOptions.map((f) => (
                      <button type="button"
                        key={f.id}
                        onClick={() => setOptions({ ...options, focus: f.id })}
                        data-ux-role="focus-option"
                        className={`flex items-center gap-2 px-3 sm:px-5 py-3 sm:py-4 rounded-2xl border text-[9px] sm:text-[10px] font-bold transition-all ${options.focus === f.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl scale-102' : 'bg-white/[0.01] border-white/[0.04] text-slate-500 hover:text-white'
                          }`}
                      >
                        {f.icon}
                            <span className="truncate">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                <button type="button"
                  onClick={() => handleGenerate()}
                  disabled={loading || !input.trim()}
                  data-ux-role="generate"
                  className={`w-full py-3 sm:py-5 rounded-3xl font-black transition-all flex items-center justify-center gap-4 ${loading || !input.trim() ? 'bg-white/[0.02] text-slate-800' : 'bg-white text-black hover:bg-slate-200 active:scale-[0.98] shadow-2xl shadow-white/10'
                    }`}
                >
                  <span className="text-xs uppercase tracking-[0.2em]">{loading ? 'Synthesizing...' : 'إصدار الأمر البرمجي المعزز'}</span>
                  {loading ? <RefreshCcw className="animate-spin" size={18} /> : <Send size={18} />}
                </button>

                {promptType === "coding" && (
                  <div className="pt-6 sm:pt-8 border-t border-white/[0.03] space-y-4 sm:space-y-6 text-right">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-600 flex items-center justify-end gap-2 uppercase tracking-widest">
                        Evolution Notes
                      </label>
                      <textarea
                        value={evolutionFeedback}
                        onChange={(e) => setEvolutionFeedback(e.target.value)}
                        dir="rtl"
                        placeholder="اكتب ملاحظة قصيرة لتحسين المخرجات في الجولات القادمة (اختياري)."
                        disabled={loading}
                        className="w-full min-h-[80px] bg-transparent text-base leading-relaxed text-slate-200 outline-none resize-none placeholder:text-slate-800 font-medium font-arabic transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-600 flex items-center justify-end gap-2 uppercase tracking-widest">
                        Evolution Log (آخر السجلات)
                      </label>
                      <div className="max-h-36 overflow-y-auto custom-scrollbar rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4">
                        {(evolutionLog || []).length === 0 ? (
                          <p className="text-[10px] text-slate-600 leading-relaxed">
                            لا توجد سجلات بعد. بعد أول تشغيل للبرمجة (Pro)، سيتم حفظ الملاحظات هنا.
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {(evolutionLog || []).slice(0, EVOLUTION_CONTEXT_LAST_N).map((e) => (
                              <div key={e?.id || e?.ts} className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest">
                                    Focus: {e?.focus || "-"}
                                  </span>
                                  <span className="text-[8px] text-slate-500 uppercase tracking-widest">
                                    Goal: {e?.goal || "-"}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-600 leading-relaxed overflow-hidden max-h-[3.5em]">
                                  {e?.arabicSummary || ""}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setEvolutionLog([]);
                            setEvolutionFeedback("");
                            try {
                              localStorage.setItem(EVOLUTION_LOG_KEY, JSON.stringify([]));
                            } catch (e) {
                              console.warn("Failed to clear Evolution Log:", e);
                            }
                          }}
                          disabled={loading}
                          className="px-5 py-2 bg-white/[0.03] border border-white/[0.08] text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-white/[0.2] hover:bg-white/[0.05] transition-all"
                        >
                          Clear Evolution Log
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
        </motion.div>
        )}

        {/* Output Pane */}
        {workspacePanel === "output" && (
        <motion.div
          className="lg:col-span-12 h-full min-h-0 flex flex-col"
          variants={revealVariants}
          initial="hidden"
          animate="show"
          custom={1}
        >
          <div className="flex-1 bg-[#0A0A0B] rounded-[2.5rem] border border-white/[0.05] shadow-2xl overflow-hidden flex flex-col glass terminal-glow">
            <MacHeader title="Final Infrastructure Code" />
            <div className="flex-1 p-4 sm:p-6 lg:p-8 font-mono text-[13px] overflow-y-auto overflow-x-hidden custom-scrollbar leading-relaxed" dir="ltr">
              {error ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-red-500/5">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tighter">System Malfunction</h3>
                  <p className="text-slate-500 text-[10px] max-w-xs uppercase tracking-widest leading-loose">{error}</p>
                  <button type="button"
                    onClick={() => handleGenerate()}
                    className="mt-8 px-10 py-4 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-500/10"
                  >
                    Reinitialize Engine
                  </button>
                </div>
              ) : loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase animate-pulse">Processing Neural Engine</p>
                    <p className="text-[8px] text-slate-700">Translating intent to architecture...</p>
                  </div>
                </div>
              ) : output ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                      <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-md text-[8px] font-black uppercase tracking-widest">Valid</div>
                      <div className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-md text-[8px] font-black uppercase tracking-widest">Optimized</div>
                    </div>
                    <button type="button"
                      onClick={copyToClipboard}
                      className="p-3 bg-white text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="text-slate-200 whitespace-pre-wrap selection:bg-indigo-500/30">
                    {output.englishPrompt}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-900/40">
                  <Terminal size={100} strokeWidth={0.5} />
                  <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em]">Waiting for execution</p>
                </div>
              )}
            </div>

            {/* Logic Wrap Summary */}
            <AnimatePresence>
              {output?.arabicSummary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-8 bg-indigo-600/5 border-t border-white/[0.05]"
                >
                  <div className="flex items-center gap-3 mb-4 text-indigo-400 text-[10px] font-black uppercase tracking-widest" dir="rtl">
                    <Target size={14} /> فحص جودة المخرجات
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed text-right" dir="rtl">
                    {output.arabicSummary}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4" dir="rtl">
                    {output.suggestedTools?.map(tool => (
                      <span key={tool} className="px-3 py-1 bg-white/[0.02] border border-white/[0.05] rounded-lg text-[8px] text-slate-600 font-bold uppercase">{tool}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );

  const docsPage = (
    <div className="max-w-7xl mx-auto px-8 py-12" dir="rtl">
      {(() => {
        const docsItems = [
          { id: "DEVELOPMENT", label: "التطوير", content: developmentDoc },
          { id: "CONTRIBUTING", label: "المساهمة والدعم", content: contributingDoc },
          { id: "GEMINI_PROMPT_CONTRACT", label: "عقد JSON لمخرجات Gemini", content: geminiContractDoc },
          { id: "TROUBLESHOOTING", label: "حل المشاكل", content: troubleshootingDoc },
          { id: "UX_GUIDE", label: "دليل الاستخدام", content: uxGuideDoc },
          { id: "VIBE_CODING_PRO", label: "Vibe Coding Pro", content: vibeCodingProDoc }
        ];

        const selectedDoc =
          docsItems.find((d) => d.id === docsSelectedId) || docsItems[0];

        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                  توثيق المنصة
                </h2>
                <p className="text-slate-500 text-base sm:text-lg mt-3 leading-relaxed">
                  شغّل المشروع محليًا، افهم عقد المخرجات، ثم شارك في التحسين بأمان عبر وثائق واضحة واتجاه نص مناسب.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setView("landing")}
                className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-200 active:scale-95 transition-all"
              >
                رجوع
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-3 space-y-4">
                <div className="glass rounded-[2.5rem] p-6 border border-white/[0.05]">
                  <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.35em] mb-4">
                    اختر القسم
                  </div>
                  <div className="space-y-2">
                    {docsItems.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDocsSelectedId(d.id)}
                        className={`w-full text-right px-4 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                          docsSelectedId === d.id
                            ? "bg-white text-black border-white/10 shadow-lg"
                            : "bg-white/[0.01] border-white/[0.04] text-slate-500 hover:text-white hover:bg-white/[0.03]"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-9">
                <div className="glass rounded-[2.5rem] p-8 border border-white/[0.05]">
                  <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.35em] mb-4">
                    {selectedDoc.label}
                  </div>

                  <div
                    className="text-slate-200 text-sm leading-relaxed overflow-hidden custom-scrollbar max-h-[70vh] overflow-y-auto"
                    dir="auto"
                  >
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-black mt-6 mb-4">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-black mt-6 mb-3">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-black mt-5 mb-3">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="my-3 text-start">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pr-5 my-3 text-start">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pr-5 my-3 text-start">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="my-1 text-start">{children}</li>
                        ),
                        pre: ({ children }) => (
                          <pre
                            dir="ltr"
                            className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 overflow-x-auto my-4 text-left"
                          >
                            {children}
                          </pre>
                        ),
                        code: ({ inline, children }) => {
                          if (inline) {
                            return (
                              <code
                                dir="ltr"
                                className="px-2 py-0.5 rounded-xl bg-white/[0.02] border border-white/[0.05] font-mono text-[12px] text-left"
                              >
                                {children}
                              </code>
                            );
                          }
                          return (
                            <code
                              dir="ltr"
                              className="font-mono text-[12px] text-slate-200 text-left"
                            >
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {selectedDoc.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );

  const integrationPage = (
    <div className="max-w-7xl mx-auto px-8 py-12" dir="rtl">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            التكامل مع بيئة التطوير
          </h2>
          <p className="text-slate-500 text-base sm:text-lg mt-3 leading-relaxed">
            انسخ التعليمات الجاهزة والصقها داخل وكيل/محادثة IDE مثل Cursor أو Claude Code أو VS Code (Continue).
          </p>
        </div>

        <div className="flex items-center gap-3 glass p-2 rounded-full">
          {[
            { id: "cursor", label: "Cursor" },
            { id: "claude_code", label: "Claude Code" },
            { id: "vscode_continue", label: "VS Code" },
            { id: "generic", label: "عام" }
          ].map((ide) => (
            <button
              key={ide.id}
              type="button"
              onClick={() => setIntegrationIde(ide.id)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                integrationIde === ide.id
                  ? "bg-white text-black shadow-lg scale-105"
                  : "text-slate-500 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              {ide.label}
            </button>
          ))}
        </div>
      </div>

      {!output?.englishPrompt ? (
        <GlassCard className="p-10 text-center">
          <h3 className="text-2xl font-black mb-3">لا يوجد مخرجات للتكامل بعد</h3>
          <p className="text-slate-500 leading-relaxed">
            قم بتوليد البرومبت أولاً من Workspace، ثم عد إلى قسم التكامل لنسخ تعليمات IDE الجاهزة.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={goWorkspace}
              className="px-10 py-4 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              اذهب إلى Workspace
            </button>
          </div>
        </GlassCard>
      ) : (
        (() => {
          const masterPrompt = output.englishPrompt || "";

          const wrapper = (() => {
            switch (integrationIde) {
              case "cursor":
                return `Cursor Integration Instructions (English content):
Role: You are a coding agent inside Cursor. Work inside this repository.
Rules:
1) Use the master prompt below as the controlling instruction.
2) Follow the Vibe Coding Pro 4-phase workflow: Read → Plan → Ask (Clarify & Stop if needed) → Meta-Prompt Engineering + Execute.
3) If you ask clarifying questions, ask first and do not start implementation until the user answers.
4) After applying changes, run the verification commands/tests listed in the master prompt.
5) Do NOT force Arabic UI/localization unless it is explicitly requested by the user.

MASTER PROMPT:
"""
${masterPrompt}
"""`;

              case "claude_code":
                return `Claude Code Integration Instructions:
Role: You are Claude Code acting as an independent engineering agent.
Rules:
1) Treat the master prompt below as system-level control.
2) If critical details are missing, ask clarifying questions and STOP until answered.
3) Implement with minimal non-regressive changes.
4) Run the verification commands/tests listed in the master prompt.

MASTER PROMPT:
"""
${masterPrompt}
"""`;

              case "vscode_continue":
                return `VS Code (Continue) Integration Instructions:
Role: You are an AI coding assistant in VS Code using Continue.
Rules:
1) Use the master prompt below as the controlling instruction (do not deviate from the required workflow).
2) Ask clarifying questions and STOP when needed.
3) Propose and apply code changes, then verify using the commands/tests in the master prompt.

MASTER PROMPT:
"""
${masterPrompt}
"""`;

              default:
                return masterPrompt;
            }
          })();

          const copyIntegrationPrompt = () => {
            navigator.clipboard.writeText(wrapper);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          };

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7 space-y-6">
                <GlassCard className="p-8">
                  <div className="flex items-center justify-between gap-5 mb-5">
                    <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.35em]">
                      نص التكامل الجاهز
                    </div>
                    <button
                      type="button"
                      onClick={copyIntegrationPrompt}
                      className="p-3 bg-white text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div
                    className="font-mono text-[12px] text-slate-200 whitespace-pre-wrap leading-relaxed"
                    dir="ltr"
                  >
                    {wrapper}
                  </div>
                </GlassCard>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <GlassCard className="p-8">
                  <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.35em] mb-4">
                    ملاحظة سريعة
                  </div>
                  <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                    <p>
                      الأفضل نسخ النص كاملًا كما هو.
                    </p>
                    <p>
                      إذا طلب الوكيل أسئلة توضيح، أجب ثم تابع.
                    </p>
                    <p>
                      بعد تنفيذ التعديلات، نفّذ اختبارات/تحقق المذكورة داخل البرومبت.
                    </p>
                  </div>
                </GlassCard>

                <GlassCard className="p-8">
                  <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.35em] mb-4">
                    برومبت الأصل (Master)
                  </div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="text-slate-400 text-xs">englishPrompt</div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(masterPrompt);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all"
                    >
                      نسخ
                    </button>
                  </div>
                  <div className="font-mono text-[12px] text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto custom-scrollbar" dir="ltr">
                    {masterPrompt}
                  </div>
                </GlassCard>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#040404] text-slate-100 font-sans selection:bg-indigo-500/50 relative overflow-x-hidden">
      {/* Mesh Background */}
      <div className="fixed inset-0 -z-10 bg-[#040404]">
        <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-purple-600/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-100 h-20 border-b border-white/[0.04] bg-[#040404]/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-black fill-current" />
            </div>
            <h1 className="text-lg font-black tracking-tighter hidden sm:block">ARABIC PROMPT <span className="text-indigo-500 opacity-50 ml-1">PRO</span></h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
              <button type="button" onClick={() => setView('landing')} className={`hover:text-white transition-colors ${view === 'landing' ? 'text-white' : ''}`}>Discovery</button>
              <button
                type="button"
                onClick={goWorkspace}
                className={`hover:text-white transition-colors ${view === 'app' || view === 'mobile_app' ? 'text-white' : ''}`}
              >
                Workspace
              </button>
              <button
                type="button"
                onClick={() => setView('integration')}
                className={`hover:text-white transition-colors ${view === 'integration' ? 'text-white' : ''}`}
              >
                Integration
              </button>
            </div>

            {/* Mobile nav: allow switching between sections/views */}
            <div className="flex lg:hidden items-center gap-2 text-slate-600">
              <button
                type="button"
                aria-label="Discovery"
                onClick={() => setView("landing")}
                className={`w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-all ${
                  view === "landing" ? "text-white" : "text-slate-400"
                }`}
              >
                <Search size={16} />
              </button>
              <button
                type="button"
                aria-label="Workspace"
                onClick={goWorkspace}
                className={`w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-all ${
                  view === "app" || view === "mobile_app" ? "text-white" : "text-slate-400"
                }`}
              >
                <Laptop size={16} />
              </button>
              <button
                type="button"
                aria-label="Integration"
                onClick={() => setView("integration")}
                className={`w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-all ${
                  view === "integration" ? "text-white" : "text-slate-400"
                }`}
              >
                <Monitor size={16} />
              </button>
            </div>

            <div className="w-[1px] h-6 bg-white/10 hidden sm:block"></div>

            <button
              type="button"
              aria-label="GitHub"
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center hover:bg-white/[0.08] transition-all"
              onClick={() => window.open("https://github.com/BASILR00T/Arabic-Prompt-Generation", "_blank", "noopener,noreferrer")}
            >
              <Github size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: prefersReducedMotion ? 0 : isSmallScreen ? 0.22 : 0.3 }}
          >
            {view === "landing"
              ? landingPage
              : view === "docs"
                ? docsPage
                : view === "integration"
                  ? integrationPage
                  : view === "mobile_app"
                    ? <div className="mobile-ux">{toolWorkspace}</div>
                    : toolWorkspace}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer (hide on Workspace to prevent page scroll) */}
      {view !== "app" && view !== "mobile_app" && (
        <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-white/[0.03] mt-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">
              <button type="button" onClick={(e) => e.preventDefault()} className="hover:text-slate-400 transition-colors">
                Privacy
              </button>
              <button type="button" onClick={(e) => e.preventDefault()} className="hover:text-slate-400 transition-colors">
                Terms
              </button>
              <button type="button" onClick={(e) => e.preventDefault()} className="hover:text-slate-400 transition-colors">
                Security
              </button>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-800">
              © 2026 ARABIC PROMPT PRO ENGINE. ALL RIGHTS RESERVED.
            </p>
          </div>
        </footer>
      )}

      <style>{`
        .glass {
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.07); border-radius: 10px; }
        .terminal-glow { box-shadow: 0 0 50px -10px rgba(99, 102, 241, 0.15); }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
