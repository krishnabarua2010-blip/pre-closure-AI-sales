import Link from "next/link";

export default function Home() {
  return (
    <main className="stack" style={{minHeight: '100vh'}}>
      <div className="stage" aria-hidden />
      <section className="container" style={{paddingTop:48,paddingBottom:48}}>
        <div className="glass glass-strong" style={{padding:20,display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <p className="kicker">Auto Closure</p>
            <h1 className="hero-title">Auto Closure replies to your customers instantly — and tells you only when it matters.</h1>
            <p className="hero-sub">Every unanswered message is lost revenue. Auto Closure handles conversations for you, surfacing the hot leads so you close the deals that matter.</p>
            <div style={{display:'flex',gap:12,marginTop:6}}>
              <Link href="/signup" legacyBehavior><a className="btn btn-primary">Try Auto Closure — Start free</a></Link>
              <Link href="/pricing" legacyBehavior><a className="btn btn-ghost">See pricing</a></Link>
            </div>
          </div>

          <div className="muted-sep" />

          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <p className="kicker">How it feels</p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              <div className="glass" style={{padding:12,minWidth:180}}>
                <strong>Trained on your business</strong>
                <div className="muted" style={{fontSize:13}}>Matches tone & context.</div>
              </div>
              <div className="glass" style={{padding:12,minWidth:180}}>
                <strong>Handles routine replies</strong>
                <div className="muted" style={{fontSize:13}}>You only review hot leads.</div>
              </div>
              <div className="glass" style={{padding:12,minWidth:180}}>
                <strong>Silent & reliable</strong>
                <div className="muted" style={{fontSize:13}}>Works while you sleep.</div>
              </div>
            </div>
          </div>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:6}}>
            <div className="muted">Used by online sellers, gyms, coaches — handles hundreds of conversations daily.</div>
            <div className="muted">Most popular plan: <strong>$29/mo</strong></div>
          </div>
        </div>
      </section>
    </main>
  );
}
