export default function WelcomeState() {
  return (
    <div className="glass" style={{margin:'32px auto',maxWidth:420,padding:'24px 18px',textAlign:'center'}}>
      <div style={{margin:'0 auto 12px',height:40,width:40,borderRadius:'50%',background:'var(--accent-2)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:16}} aria-hidden="true">AC</div>
      <h2 className="hero-title" style={{fontSize:20,margin:0}}>Welcome to Auto Closure</h2>
      <p className="muted" style={{marginTop:8}}>I’m your assistant. I can help with pricing, features, onboarding, and more.</p>
      <div style={{marginTop:18,display:'flex',flexDirection:'column',gap:8}}>
        <button className="btn btn-ghost" style={{width:'100%'}} aria-label="How does this work?">💬 How does this work?</button>
        <button className="btn btn-ghost" style={{width:'100%'}} aria-label="What are the pricing plans?">💰 What are the pricing plans?</button>
        <button className="btn btn-ghost" style={{width:'100%'}} aria-label="How do I get started?">🚀 How do I get started?</button>
      </div>
    </div>
  );
}
