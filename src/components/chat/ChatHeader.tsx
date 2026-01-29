export default function ChatHeader({ title }: { title: string }) {
  return (
    <header className="glass" style={{padding:'14px 18px',display:'flex',flexDirection:'column',gap:4}} aria-label="Chat header">
      <div style={{fontSize:16,fontWeight:700,color:'var(--text)'}}>{title}</div>
      <div style={{fontSize:13,color:'#7ee7c7',display:'flex',alignItems:'center',gap:6}}>
        <span aria-hidden="true" style={{fontSize:18,lineHeight:1}}>●</span>
        <span>Online</span>
        <span className="muted" style={{marginLeft:8}}>Replies instantly</span>
      </div>
    </header>
  );
}

