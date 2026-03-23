"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";

interface ChatMessage {
  role: "user" | "advisor";
  content: string;
}

export function AiChatSidebar() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "advisor", content: "Hi! I'm your AI Sales Advisor. How can I help you optimize your funnel today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      // In advanced implementation, this hits POST /advisor/chat
      const { data } = await api.post("/advisor/chat", { message: userMsg, context: "dashboard" });
      setMessages(prev => [...prev, { role: "advisor", content: data.reply || "I've analyzed that request." }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "advisor", content: "I'm having trouble connecting to the intelligence engine right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 h-screen bg-[#0B0F19] border-r border-[#1F2937] flex flex-col shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-[#1F2937] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <span className="text-sm">🧠</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">AI Advisor</h2>
            <p className="text-[10px] text-[#10b981] flex items-center gap-1.5 font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              Online & Monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
              msg.role === "user" 
                ? "bg-[#6366F1] text-white rounded-br-sm" 
                : "bg-[#111827] text-gray-300 border border-[#1F2937] rounded-bl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl rounded-bl-sm p-4 flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#1F2937] bg-[#0d1117]">
        <form onSubmit={sendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your leads..."
            className="w-full bg-[#111827] border border-[#1F2937] text-white text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-[#6366F1] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 bottom-2 w-8 flex items-center justify-center rounded-lg bg-[#6366F1] text-white disabled:opacity-50 hover:bg-[#5558e3] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </form>
        <div className="mt-3 flex gap-2 flex-wrap">
          <button onClick={() => setInput("Why are conversions low?")} className="text-[10px] bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white px-2 py-1.5 rounded-md transition-colors whitespace-nowrap">Why are conversions low?</button>
          <button onClick={() => setInput("Which leads are high intent?")} className="text-[10px] bg-[#111827] border border-[#1F2937] text-gray-400 hover:text-white px-2 py-1.5 rounded-md transition-colors whitespace-nowrap">High intent leads?</button>
        </div>
      </div>
    </div>
  );
}
