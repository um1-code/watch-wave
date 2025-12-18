// app/(auth)/register/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(formData.firstName, formData.lastName, formData.email, formData.password);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed. Try a different email.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center hidden md:block opacity-40"
        style={{
          backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-9a10-07d3f044733e/web/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 w-full max-w-[450px] bg-black/80 p-12 rounded-md text-white border border-white/5 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 uppercase tracking-tighter">Create Account</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-1/2 p-4 rounded bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition text-sm"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-1/2 p-4 rounded bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition text-sm"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 rounded bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition text-sm"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 rounded bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition text-sm"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#E50914] hover:bg-[#b20710] text-white font-bold py-4 rounded mt-4 transition duration-200 uppercase tracking-widest text-sm shadow-lg shadow-red-900/30"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-neutral-500 text-sm">
            Already a member? <Link href="/login" className="text-white hover:underline font-bold">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}