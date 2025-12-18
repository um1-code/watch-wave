// app/(auth)/login/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Set cookie and localStorage
    document.cookie = "isLoggedIn=true; path=/; max-age=86400";
    localStorage.setItem("isLoggedIn", "true");
    // Update context
    login({ name: "User" });
    // Redirect
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#141414]">
      <div
        className="absolute inset-0 bg-cover bg-center hidden md:block opacity-40"
        style={{
          backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-9a10-07d3f044733e/web/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 w-full max-w-[450px] bg-black/80 p-12 rounded-md text-white border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter italic text-[#E50914]">TAMO</h1>
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-neutral-800 rounded focus:ring-2 focus:ring-[#E50914] outline-none text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-neutral-800 rounded focus:ring-2 focus:ring-[#E50914] outline-none text-sm"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#E50914] hover:bg-[#b20710] py-3 rounded font-bold mt-4 transition uppercase tracking-widest shadow-lg shadow-red-900/20"
          >
            Log In
          </button>
        </form>
        <p className="mt-12 text-neutral-500 text-sm">
          New to TAMO? <Link href="/register" className="text-white hover:underline font-bold">Sign up now.</Link>
        </p>
      </div>
    </div>
  );
}