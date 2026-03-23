"use client";
import { useState } from "react";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  }

  return (
    <form
      className="glass"
      style={{display:'flex',gap:8,padding:'10px 12px',alignItems:'center',marginTop:0}}
      onSubmit={e => {e.preventDefault();handleSubmit();}}
      aria-label="Chat input"
    >
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Type your message…"
        className="glass"
        style={{flex:1,padding:12,borderRadius:10,border:'none',fontSize:15}}
        aria-label="Type your message"
        autoComplete="off"
      />
      <button
        type="submit"
        className="btn btn-primary"
        aria-label="Send message"
        disabled={!value.trim()}
        style={{minWidth:64}}
      >
        Send
      </button>
    </form>
  );
}

