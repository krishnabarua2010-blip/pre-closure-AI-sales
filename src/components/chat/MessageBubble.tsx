type Props = {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

export default function MessageBubble({ role, content, timestamp }: Props) {
  const isUser = role === "user";
  return (
    <div
      className={`mb-3 flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
      style={{alignItems:'flex-end'}}
      aria-label={isUser ? "Your message" : "Assistant message"}
    >
      {!isUser && (
        <div
          className="glass"
          style={{height:32,width:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,background:'var(--accent-2)',color:'#fff'}}
          aria-hidden="true"
        >
          AC
        </div>
      )}
      <div style={{maxWidth:'80vw',minWidth:0,display:'flex',flexDirection:'column',alignItems:isUser?'flex-end':'flex-start'}}>
        <div
          className={`msg ${isUser ? 'user' : 'assistant'}`}
          style={{fontSize:15,wordBreak:'break-word'}}
        >
          {content}
        </div>
        {timestamp && (
          <div className="muted" style={{fontSize:12,marginTop:2}}>{timestamp}</div>
        )}
      </div>
    </div>
  );
}
