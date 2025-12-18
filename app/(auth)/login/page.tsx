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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;

    try {
      await login(email, password);

      // ✅ REDIRECT HERE
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>

      {error && <p>{error}</p>}
    </form>
  );
}

      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#141414]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center hidden md:block opacity-40"
        style={{
          backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-9a10-07d3f044733e/web/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[450px] bg-black/80 p-12 rounded-md text-white border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter italic text-[#E50914]">
          WatchWave
        </h1>
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 bg-red-500/10 border border-red-500/50 px-4 py-3 rounded mb-6 text-center font-medium">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-neutral-800 rounded focus:ring-2 focus:ring-[#E50914] outline-none text-sm transition"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-neutral-800 rounded focus:ring-2 focus:ring-[#E50914] outline-none text-sm transition"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E50914] hover:bg-[#b20710] disabled:bg-gray-600 disabled:cursor-not-allowed py-4 rounded font-bold transition uppercase tracking-widest shadow-lg shadow-red-900/20 text-lg"
          >
            {isLoading ? "Signing In..." : "Log In"}
          </button>
        </form>

        <p className="mt-12 text-center text-neutral-500 text-sm">
          New to WatchWave?{" "}
          <Link href="/register" className="text-white hover:underline font-bold">
            Sign up now.
          </Link>
        </p>
      </div>
    </div>
  );
}