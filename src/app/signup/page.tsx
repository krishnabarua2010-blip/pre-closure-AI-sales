export default function Signup() {
  return (
    <section className="container">
      <h2 className="title">Create your assistant</h2>
      <p className="sub">Set up Auto Closure AI in minutes</p>

      <div className="grid">
        <div className="card">
          <input placeholder="Business Name" />
          <input placeholder="Email" />
          <input placeholder="Password" type="password" />
          <a className="btn primary">Get Started</a>
        </div>
      </div>
    </section>
  );
}
