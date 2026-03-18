import React, { useState } from 'react';
import { 
  Zap, 
  Copy, 
  Check, 
  RotateCcw, 
  Send, 
  Sparkles,
  Command,
  Layout,
  MessageSquare,
  Flame,
  Globe,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Workaround for ESLint `no-unused-vars` not recognizing `<motion.*>` JSX usage.
void motion;

const ENHANCEMENT_OPTIONS = [
  { id: 'creative', name: 'إبداعي', icon: Flame, color: 'text-orange-400' },
  { id: 'expert', name: 'خبير', icon: Star, color: 'text-yellow-400' },
  { id: 'roleplay', name: 'تمثيل أدوار', icon: MessageSquare, color: 'text-blue-400' },
  { id: 'structured', name: 'منظم', icon: Layout, color: 'text-green-400' },
];

export default function PromptGenerator() {
  const [inputText, setInputText] = useState('');
  const [outputPrompt, setOutputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('creative');

  const generatePrompt = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    
    // Simulate complex AI generation
    await new Promise(r => setTimeout(r, 1500));
    
    let result = '';
    if (mode === 'structured') {
      result = `تصرف كخبير في ${inputText}. اتبع الهيكل التالي:\n- المقدمة\n- الخطوات\n- الخلاصة\n\nتأكد من استخدام لغة واضحة ومهنية.`;
    } else if (mode === 'expert') {
      result = `بصفتك مختصاً رفيع المستوى بـ 20 عاماً من الخبرة في ${inputText}، قدم تحليلاً عميقاً وحلولاً غير تقليدية للمشكلة المطروحة، مع التركيز على الكفاءة والاستدامة.`;
    } else if (mode === 'roleplay') {
      result = `تقمص شخصية خبير استراتيجي يتحدث بلهجة ${inputText}. أريدك أن ترشدني خلال هذه المهمة كأنك معلم خاص لي.`;
    } else {
      result = `قم بإنشاء محتوى إبداعي ومتميز حول: ${inputText}. اجعل الأسلوب جذاباً وملهماً للقارئ، واستخدم استعارات لغوية قوية.`;
    }
    
    setOutputPrompt(result);
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInputText('');
    setOutputPrompt('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Modes Switcher */}
      <div className="flex flex-wrap justify-center gap-4 bg-white/[0.02] p-2 rounded-[24px] border border-white/[0.04]">
        {ENHANCEMENT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setMode(opt.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
              mode === opt.id 
              ? 'bg-white text-black shadow-xl scale-105' 
              : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <opt.icon size={16} className={mode === opt.id ? opt.color : ''} />
            {opt.name}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[35px] opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-[#0F0F12] border border-white/[0.08] rounded-[30px] p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6 border-b border-white/[0.04] pb-4">
            <Zap className="text-yellow-400" size={20} />
            <h3 className="text-lg font-black tracking-tight text-white uppercase italic">
              مـحـرك الـتـنـفـيـذ <span className="text-slate-600 font-medium">/ Execution</span>
            </h3>
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="أدخل فكرتك هنا (مثال: إنشاء خطة تسويقية لمطعم)"
            className="w-full h-48 bg-transparent text-xl font-medium text-white placeholder-slate-700 focus:outline-none resize-none custom-scrollbar leading-relaxed"
            dir="rtl"
          />

          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-5">
              <button 
                onClick={clear}
                className="p-4 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                title="تطهير"
              >
                <RotateCcw size={20} />
              </button>
              <div className="h-6 w-[1px] bg-white/[0.08]"></div>
              <span className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.2em]">
                {inputText.length} حرفاً
              </span>
            </div>
            
            <button
              onClick={generatePrompt}
              disabled={isLoading || !inputText.trim()}
              className={`flex items-center gap-4 bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all transform active:scale-95 ${
                isLoading ? 'opacity-50 cursor-wait' : 'hover:bg-indigo-600 hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.5)]'
              }`}
            >
              {isLoading ? (
                <Command className="animate-spin" size={18} />
              ) : (
                <Sparkles size={18} />
              )}
              {isLoading ? 'جاري المعالجة...' : 'تـحـسين الأمـر'}
            </button>
          </div>
        </div>
      </div>

      {/* Output Area */}
      <AnimatePresence>
        {outputPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <div className="absolute -inset-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent rounded-[30px]"></div>
            <div className="relative bg-[#0A0A0B] border border-emerald-500/20 rounded-[30px] p-10 overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <Layout className="text-emerald-500/20" size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Zap className="text-emerald-500" size={18} />
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-500">النتيجة النهائية</span>
                  </div>
                  
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-all border border-white/[0.04]"
                  >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{copied ? 'تـم النسـخ' : 'نسـخ النـص'}</span>
                  </button>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.04] p-8 rounded-2xl">
                  <p className="text-xl text-slate-300 leading-loose whitespace-pre-wrap" dir="rtl">
                    {outputPrompt}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
