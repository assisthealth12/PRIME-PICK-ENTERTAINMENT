"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // AuthProvider will automatically redirect to /admin upon successful login
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-body relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "url('/footer.png')", backgroundSize: "cover", backgroundPosition: "center" }}></div>
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="w-full max-w-md p-8 bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl text-white font-bold tracking-widest uppercase mb-2">Prime Pick</h1>
          <p className="text-xs text-accent uppercase tracking-widest">Admin Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#222222] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
              placeholder="admin@primepick.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#222222] border border-[#333333] rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-black font-bold uppercase tracking-widest text-sm py-4 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
           <a href="/" className="text-xs text-gray-500 hover:text-white transition-colors">← Return to Public Site</a>
        </div>
      </div>
    </div>
  );
}
