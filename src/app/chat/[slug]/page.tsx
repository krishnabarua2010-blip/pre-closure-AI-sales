
"use client";

import { useState, useEffect } from "react";

export default function ChatPage({ params }: { params: { slug: string } }) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate business exists on mount
  useEffect(() => {
    async function validateBusiness() {
      if (!params.slug) {
        setError("Invalid or expired preview.");
        setValidating(false);
        return;
      }
      
      try {
        const { apiRequest } = await import("@/lib/api");
        const resp = await apiRequest(`/business/${params.slug}`, "GET");
        if (!resp) {
          setError("Business not found or access expired.");
        }
      } catch (err) {
        console.error("Validation error:", err);
        setError("Unable to verify access. Please try again.");
      } finally {
        setValidating(false);
      }
    }
    
    validateBusiness();
  }, [params.slug]);

  if (validating) {
    return (
      <section className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: "center" }}>
        <p style={{ fontSize: "1.1rem", color: "#d1d1d6" }}>Loading conversation…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: "center" }}>
        <div className="glass" style={{ maxWidth: 500, margin: "0 auto", padding: 40 }}>
          <h2 style={{ fontSize: "1.3rem", color: "#ff6b6b", marginBottom: 16 }}>
            {error}
          </h2>
          <p style={{ fontSize: "1rem", color: "#a0a0a6", marginBottom: 24 }}>
            This preview may have expired or been removed.
          </p>
          <a
            href="/pricing"
            style={{
              display: "inline-block",
              background: "#8b5cf6",
              color: "white",
              padding: "12px 32px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#a78bfa")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#8b5cf6")}
          >
            Try Preview Again
          </a>
        </div>
      </section>
    );
  }

  async function send() {
    if (!input.trim()) return;

    const userText = input;
    setInput("");

    setMessages((m) => [...m, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const { apiRequest } = await import("@/lib/api");
      const resp = await apiRequest("/generate_reply", "POST", { message: userText, businessSlug: params.slug }, true);
      console.log("generate_reply response:", resp);
      if (!resp) {
        setError("Failed to get response");
        setLoading(false);
        return;
      }
      if (resp.status === "LIMIT_REACHED") {
        setError("Your free preview has ended. Upgrade to continue.");
        setLoading(false);
        return;
      }

      setMessages((m) => [
        ...m,
        { role: "assistant", text: resp.reply || "Something went wrong." },
      ]);

      console.log("LEAD STATUS:", resp.lead_status);
    } catch (e) {
      console.error(e);
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
