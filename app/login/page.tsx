"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/dashboard" });
    if (response?.error) setError("Invalid credentials");
    if (response?.ok) window.location.href = "/dashboard";
  };

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input className="w-full rounded-md border border-slate-300 p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-md border border-slate-300 p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-md bg-accent py-2 text-white">Login</button>
      </form>
      <p className="mt-3 text-sm text-slate-600">No account? <Link href="/signup" className="underline">Sign up</Link></p>
    </main>
  );
}
