"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Send, Bot, User, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PublicChatPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [chatState, setChatState] = useState<{
    conversation_id: string;
    public_token: string;
    assistant_name: string;
  } | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [bookingLink, setBookingLink] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (!slug) return;

    const initializeChat = async () => {
      try {
        const cacheKey = `chat_session_${slug}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          const parsed = JSON.parse(cached);
          setChatState(parsed);
          
          // Load history
          try {
            const hist = await api.get(`/conversation_messages`, {
              params: { conversation_id: parsed.conversation_id, public_token: parsed.public_token }
            });
            if (hist.data && Array.isArray(hist.data.messages)) {
              setMessages(hist.data.messages.map((m: any) => ({
                role: m.role || (m.sender === 'user' ? 'user' : 'assistant'),
                content: m.content || m.message || ''
              })));
            }
          } catch (e) {
            // History load failed, clear cache and re-init
            localStorage.removeItem(cacheKey);
            await initNewConversation();
            return;
          }
        } else {
          await initNewConversation();
        }
      } catch (err: any) {
        setError('Failed to initialize conversation. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    const initNewConversation = async () => {
      const { data } = await api.post('/init_public_conversation', { slug });
      const newState = {
        conversation_id: data.conversation_id,
        public_token: data.public_token,
        assistant_name: data.assistant_name || 'AI Assistant'
      };
      setChatState(newState);
      localStorage.setItem(`chat_session_${slug}`, JSON.stringify(newState));
      setMessages([{ role: 'assistant', content: `Hi there! I'm ${newState.assistant_name}. How can I help you today?` }]);
    };

    initializeChat();
  }, [slug]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || !chatState || sending) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setSending(true);

    try {
      const { data } = await api.post('/ai_message', {
        conversation_id: chatState.conversation_id,
        public_token: chatState.public_token,
        message: userMessage
      });

      const reply = data.assistant_reply || data.reply || "I didn't quite catch that.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      // Check Auto Booking Threshold
      const rps = data.revenue_probability_score || 0;
      if (rps >= 80 && !bookingLink) {
        // Trigger auto booking
        try {
          const bookingRes = await api.post('/auto_call_booking', {
            conversation_id: chatState.conversation_id,
            public_token: chatState.public_token
          });
          if (bookingRes.data?.booking_link) {
            setBookingLink(bookingRes.data.booking_link);
          }
        } catch (bookingErr) {
          console.error("Auto booking failed", bookingErr);
        }
      }

    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue... Please try resending that.' }]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse flex space-x-2">
           <div className="w-3 h-3 bg-primary/40 rounded-full"></div>
           <div className="w-3 h-3 bg-primary/60 rounded-full animation-delay-200"></div>
           <div className="w-3 h-3 bg-primary rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  if (error && !chatState) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-white p-4">
        <div className="bg-card border border-border p-6 rounded-xl max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Unavailable</h2>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <header className="flex-none bg-card/80 backdrop-blur-lg border-b border-border p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 relative">
             <Bot className="text-primary w-5 h-5" />
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
          </div>
          <div>
            <h1 className="font-semibold text-white tracking-tight leading-tight">{chatState?.assistant_name || 'Sales Agent'}</h1>
            <p className="text-xs text-gray-400">Powered by Pre-Closer AI</p>
          </div>
        </div>
        {bookingLink && (
           <a href={bookingLink} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors">
              <Calendar size={14} /> Book Strategic Call
           </a>
        )}
      </header>

      {/* Booking Banner Mobile */}
      {bookingLink && (
         <div className="md:hidden flex-none bg-primary text-white p-3 flex justify-between items-center z-10">
            <span className="text-xs font-medium flex items-center gap-2"><Sparkles size={14} /> Ready to scale?</span>
            <a href={bookingLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-white text-primary px-3 py-1.5 rounded-md font-bold hover:bg-white/90 transition-colors">Book Call</a>
         </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6 flex flex-col pt-4">
          <p className="text-center text-xs text-gray-500 font-medium tracking-wider uppercase mb-4">Conversation Started</p>
          
          {messages.map((m, i) => (
            <div key={i} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1 outline outline-1 outline-border/50 ${m.role === 'user' ? 'bg-background' : 'bg-primary/10'}`}>
                  {m.role === 'user' ? <User size={14} className="text-gray-400" /> : <Bot size={14} className="text-primary" />}
                </div>

                <div className={`px-5 py-3.5 text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-sm rounded-br-2xl shadow-primary/20 shadow-lg' 
                    : 'bg-card border border-border text-gray-200 rounded-tl-sm shadow-sm'
                }`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>

              </div>
            </div>
          ))}

          {sending && (
             <div className="flex w-full justify-start mt-2">
               <div className="max-w-[85%] flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 shrink-0 flex items-center justify-center outline outline-1 outline-border/50">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="px-5 py-4 bg-card border border-border rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                  </div>
               </div>
             </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none bg-background border-t border-border p-4 md:p-6 pb-6 md:pb-8 z-10 w-full flex justify-center">
        <div className="w-full max-w-3xl">
          <form onSubmit={handleSend} className="relative flex items-end">
            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="w-full bg-card border border-border focus:border-primary/50 text-white rounded-2xl px-5 py-4 pr-16 resize-none focus:outline-none focus:ring-1 focus:ring-primary shadow-sm min-h-[56px] max-h-32 text-sm leading-relaxed transition-all"
              rows={1}
            />
            <button
              type="submit"
              disabled={sending || !inputValue.trim()}
              className="absolute right-2 bottom-2 p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:bg-card disabled:text-gray-500 transition-all shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center mt-3">
             <Link href="/" className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-gray-400 font-semibold transition-colors">Powered by Pre-Closer AI</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
