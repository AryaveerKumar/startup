"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    setMessage(response.ok ? "Account created. You can now log in." : data.error || "Signup failed");
  };

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input className="w-full rounded-md border border-slate-300 p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="w-full rounded-md border border-slate-300 p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-md border border-slate-300 p-2" placeholder="Password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full rounded-md bg-accent py-2 text-white">Sign up</button>
      </form>
      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
      <p className="mt-3 text-sm text-slate-600">Already have an account? <Link href="/login" className="underline">Log in</Link></p>
    </main>
  );
}
