'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/context';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  ShieldCheck,
  Download,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  meta?: {
    model?: string;
    latencyMs?: number;
  };
}

interface AgentChatInterfaceProps {
  agentType: 'literature' | 'methodology' | 'proposal' | 'thesis' | 'custom';
  agentId?: string;
  agentNameAr: string;
  agentNameEn: string;
  agentRoleAr: string;
  agentRoleEn: string;
  initialGreetingAr: string;
  initialGreetingEn: string;
  suggestedPromptsAr?: string[];
  suggestedPromptsEn?: string[];
  currentContext?: string;
  accentColor?: 'emerald' | 'indigo' | 'purple' | 'amber';
}

export default function AgentChatInterface({
  agentType,
  agentId,
  agentNameAr,
  agentNameEn,
  agentRoleAr,
  agentRoleEn,
  initialGreetingAr,
  initialGreetingEn,
  suggestedPromptsAr = [],
  suggestedPromptsEn = [],
  currentContext = '',
  accentColor = 'emerald',
}: AgentChatInterfaceProps) {
  const { language } = useI18n();
  const isArabic = language === 'ar';

  const agentName = isArabic ? agentNameAr : agentNameEn;
  const agentRole = isArabic ? agentRoleAr : agentRoleEn;
  const initialGreeting = isArabic ? initialGreetingAr : initialGreetingEn;
  const defaultPrompts = isArabic ? suggestedPromptsAr : suggestedPromptsEn;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      meta: {
        model: 'Fanar-C-2-27B',
        latencyMs: 120,
      },
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType,
          agentId,
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          language: isArabic ? 'ar' : 'en',
          context: currentContext,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          meta: {
            model: data.model || 'Fanar-C-2-27B',
            latencyMs: data.latencyMs || 250,
          },
        };
        setMessages([...updatedMessages, assistantMsg]);
      } else {
        const errMsg: ChatMessage = {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          content: isArabic
            ? 'تعذر معالجة الطلب في الوقت الحالي. يرجى إعادة المحاولة.'
            : 'Unable to process the request at this time. Please retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...updatedMessages, errMsg]);
      }
    } catch (err) {
      const errMsg: ChatMessage = {
        id: `asst-err-${Date.now()}`,
        role: 'assistant',
        content: isArabic
          ? 'حدث خطأ في الاتصال بنموذج الفنار الأكاديمي.'
          : 'Connection error to Fanar AI model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...updatedMessages, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    if (confirm(isArabic ? 'هل تريد بدء جلسة محادثة جديدة وتفريغ السجل؟' : 'Reset chat session?')) {
      setMessages([
        {
          id: `init-${Date.now()}`,
          role: 'assistant',
          content: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          meta: {
            model: 'Fanar-C-2-27B',
            latencyMs: 120,
          },
        },
      ]);
    }
  };

  const handleExport = () => {
    const textContent = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.role === 'user' ? 'Maryam Al-Mazrouei' : agentName}:\n${m.content}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([textContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AlWaha_${agentType}_Chat_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-[750px] overflow-hidden">
      {/* Chat Interface Header */}
      <div className="p-4 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{agentName}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                <Sparkles className="w-3 h-3" />
                Fanar-C-2-27B
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{agentRole}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
            title={isArabic ? 'تصدير سجل المحادثة (Markdown)' : 'Export Chat transcript'}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isArabic ? 'تصدير السجل' : 'Export'}</span>
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
            title={isArabic ? 'بدء محادثة جديدة' : 'New Chat Session'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isArabic ? 'جلسة جديدة' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Starter Prompts Banner */}
      {messages.length <= 1 && defaultPrompts.length > 0 && (
        <div className="p-3 px-6 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isArabic ? 'استفسارات ومحاور مقترحة للبدء:' : 'Suggested starter prompts:'}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {defaultPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-start px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-400 text-xs text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 shadow-xs transition-all hover:scale-[1.01]"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[88%] ${isUser ? 'ms-auto flex-row-reverse' : 'me-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs ${
                  isUser
                    ? 'bg-slate-800 dark:bg-slate-700'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1 group">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-600/10'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80 shadow-xs'
                  }`}
                >
                  {m.content}
                </div>

                {/* Footer Metadata & Actions */}
                <div
                  className={`flex items-center gap-2 px-1 text-[11px] text-slate-400 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {m.timestamp}
                  </span>
                  {m.meta?.latencyMs && (
                    <span>
                      · {m.meta.model} ({m.meta.latencyMs}ms)
                    </span>
                  )}
                  <button
                    onClick={() => handleCopy(m.id, m.content)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-slate-600 dark:hover:text-slate-200"
                    title={isArabic ? 'نسخ النص' : 'Copy text'}
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 max-w-[80%] me-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm flex items-center gap-2 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 ms-1">
                {isArabic
                  ? 'جاري التحليل الأكاديمي وصياغة الاستجابة عبر نموذج Fanar...'
                  : 'Analyzing academic inquiry via Fanar AI...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800/70 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
            placeholder={
              isArabic
                ? `اكتب استفسارك أو مسودة النص لـ ${agentName}... (Enter للإرسال)`
                : `Type your question or draft for ${agentName}... (Enter to send)`
            }
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none resize-none max-h-32 min-h-[40px]"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 shrink-0"
            title={isArabic ? 'إرسال' : 'Send'}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 mt-2 px-1">
          <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isArabic
              ? 'محادثة أكاديمية مؤمنة ضمن سحابة جامعة الواحة'
              : 'Secure Academic Session under Al-Waha Governance'}
          </span>
          <span className="font-mono">Shift + Enter {isArabic ? 'لسطر جديد' : 'for new line'}</span>
        </div>
      </div>
    </div>
  );
}
