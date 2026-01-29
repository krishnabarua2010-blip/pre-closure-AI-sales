export default function Login() {
  return (
    <section className="container">
      <h2 className="title">Welcome back</h2>
      <p className="sub">Log in to manage your assistant</p>

      <div className="grid">
        <div className="card">
          <input placeholder="Email" />
          <input placeholder="Password" type="password" />
          <a className="btn primary">Login</a>
        </div>
      </div>
    </section>
  );
}
