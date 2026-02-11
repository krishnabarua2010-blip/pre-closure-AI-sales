"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const res = await apiRequest(
      "/auth/login",
      "POST",
      { email, password },
      false
    );

    if (res?.ok && res?.data) {
      const token = res.data.token || res.data.authToken || res.data.access_token;
      if (token) {
        localStorage.setItem("token", token);
        router.push("/dashboard");
      } else {
        alert("Login failed: No token in response");
        console.log(res);
      }
    } else {
      alert("Login failed");
      console.log(res);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card max-w-md w-full p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn-primary w-full">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
