
"use client";

import { useState } from "react";
import { sendMessageToAssistant } from "@/lib/chatApi";

export default function ChatPage({ params }: { params: { slug: string } }) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((m) => [...m, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const data = await sendMessageToAssistant({
        businessSlug: params.slug,
        message: userText,
      });

      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.reply },
      ]);

      console.log("LEAD STATUS:", data.lead_status);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="chat-shell">
      <div className="stage" aria-hidden />
      <div className="container" style={{paddingTop:20,paddingBottom:20}}>
        <div className="chat-card glass">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div className="kicker">Official Assistant</div>
              <div style={{fontWeight:700}}>Auto Closure — Team</div>
            </div>
            <div className="muted">You are chatting with the business team</div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:12}}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === 'user' ? 'user' : 'assistant'}`}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>{m.role === 'user' ? 'You' : 'Team'}</div>
                <div style={{fontSize:15}}>{m.text}</div>
              </div>
            ))}

            {loading && (
              <div className="msg assistant" style={{opacity:0.9}}>
                <div style={{fontSize:13,fontWeight:600}}>Team</div>
                <div style={{fontSize:15}}>Typing…</div>
              </div>
            )}
          </div>

          <div style={{marginTop:12,display:'flex',gap:10,alignItems:'center'}}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something…"
              className="glass"
              style={{flex:1,padding:12,borderRadius:10,border:'none',outline:'none'}}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            />
            <button onClick={send} className="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    </section>
  );
}
