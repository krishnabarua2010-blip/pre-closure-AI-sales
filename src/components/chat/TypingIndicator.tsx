export default function TypingIndicator() {
  return (
    <div className="mb-3 flex gap-2" style={{alignItems:'flex-end'}} aria-live="polite" aria-label="Assistant is typing">
      <div
        className="glass"
        style={{height:32,width:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,background:'var(--accent-2)',color:'#fff'}}
        aria-hidden="true"
      >
        AC
      </div>
      <div className="msg assistant" style={{fontSize:15,opacity:0.8}}>Typing…</div>
    </div>
  );
}
