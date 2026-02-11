"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { apiRequest } = await import("@/lib/api");
      const resp = await apiRequest("/auth/login", "POST", { email, password });
      console.log("login response:", resp);
      if (!resp.ok) throw new Error(resp.data?.message || `Login failed: ${resp.status}`);
      const token = resp.data?.token || resp.data?.access_token;
      if (token) localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  return (
    <section className="container">
      <h2 className="title">Welcome back</h2>
      <p className="sub">Log in to manage your assistant</p>

      <div className="grid">
        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <div style={{ color: "#ff6b6b" }}>{error}</div>}
            <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
