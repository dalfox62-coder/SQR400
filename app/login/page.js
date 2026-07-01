"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear errors when toggling tabs
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [isSignUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (isSignUp) {
        setSuccess("Account registered successfully! You can now sign in.");
        setIsSignUp(false);
        setPassword("");
      } else {
        // Sign In success
        localStorage.setItem("sqr400_session", JSON.stringify(data.user));
        
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Auth Card */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Glow Accent Line */}
        <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        {/* Shield Icon / Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-4 relative group shadow-inner">
            {/* Pulsing indicator */}
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full" />
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white uppercase text-center">
            SQR400 <span className="text-blue-500">GATEWAY</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-1">
            Secure Cryptographic SWIFT Interface
          </p>
        </div>

        {/* Switch Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-850">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${
              !isSignUp
                ? "bg-slate-905 text-white shadow-md border border-slate-800"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${
              isSignUp
                ? "bg-slate-905 text-white shadow-md border border-slate-800"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-950/40 border border-red-900/50 text-red-200 text-xs rounded-xl flex items-center gap-2 font-medium">
            <span className="text-sm">⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="mb-5 p-3.5 bg-emerald-950/40 border border-emerald-900/50 text-emerald-200 text-xs rounded-xl flex items-center gap-2 font-medium">
            <span className="text-sm">✅</span> {success}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Username
            </label>
            <input
              type="text"
              autoComplete="off"
              className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-850 focus:border-blue-500 rounded-xl text-sm text-slate-100 placeholder-slate-650 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-900/20"
              placeholder="Enter account username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Secret Passcode
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-850 focus:border-blue-500 rounded-xl text-sm text-slate-100 placeholder-slate-650 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-900/20"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 active:scale-98"
          >
            {loading ? "Decrypting credentials..." : isSignUp ? "Establish Account" : "Access Terminal"}
          </button>
        </form>
      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-[9px] font-mono text-slate-650 tracking-wider relative z-10">
        SQR400 WIRE TRANSFER SYSTEM • ALL CONNECTIONS ENCRYPTED
      </div>
    </main>
  );
}
