"use client";

import { useAuth } from "@/components/admin/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import Link from "next/link";
import { Film, Users, LogOut, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <div className="max-w-5xl mx-auto text-black">
      <div className="flex justify-between items-end mb-12 border-b border-black pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-widest mb-2">Overview</h1>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            Welcome back, {user?.email}
          </p>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Films Card */}
        <div className="group border-2 border-black p-8 hover:bg-black transition-colors duration-300">
          <div className="flex items-center justify-between mb-8 group-hover:text-white transition-colors duration-300">
            <Film size={32} strokeWidth={1.5} />
            <ArrowRight size={24} strokeWidth={1.5} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-4 group-hover:text-white transition-colors duration-300">Manage Films</h2>
          <p className="text-sm text-gray-600 font-medium group-hover:text-gray-400 transition-colors duration-300 mb-8">
            Upload new movies, update synopses, and manage posters and YouTube links that appear on the public site.
          </p>
          <Link 
            href="/admin/films"
            className="inline-block bg-black text-white group-hover:bg-white group-hover:text-black text-xs font-bold uppercase tracking-widest px-6 py-3 transition-colors duration-300"
          >
            Go to Films
          </Link>
        </div>

        {/* Directors Card */}
        <div className="group border-2 border-black p-8 hover:bg-black transition-colors duration-300">
          <div className="flex items-center justify-between mb-8 group-hover:text-white transition-colors duration-300">
            <Users size={32} strokeWidth={1.5} />
            <ArrowRight size={24} strokeWidth={1.5} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-4 group-hover:text-white transition-colors duration-300">Manage Directors</h2>
          <p className="text-sm text-gray-600 font-medium group-hover:text-gray-400 transition-colors duration-300 mb-8">
            Add new directors, upload their headshots, and update their biographies and notable works.
          </p>
          <Link 
            href="/admin/directors"
            className="inline-block bg-black text-white group-hover:bg-white group-hover:text-black text-xs font-bold uppercase tracking-widest px-6 py-3 transition-colors duration-300"
          >
            Go to Directors
          </Link>
        </div>
      </div>
    </div>
  );
}
