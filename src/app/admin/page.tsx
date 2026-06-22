"use client";

import { useAuth } from "@/components/admin/AuthProvider";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import Link from "next/link";
import { Film, Users, LogOut, ArrowRight, BookOpen, Trophy, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    films: 0,
    directors: 0,
    challenges: 0,
    journals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [filmsSnap, directorsSnap, challengesSnap, journalsSnap] = await Promise.all([
          getCountFromServer(collection(db, "films")),
          getCountFromServer(collection(db, "directors")),
          getCountFromServer(collection(db, "challenges")),
          getCountFromServer(collection(db, "journals")),
        ]);

        setCounts({
          films: filmsSnap.data().count,
          directors: directorsSnap.data().count,
          challenges: challengesSnap.data().count,
          journals: journalsSnap.data().count,
        });
      } catch (error) {
        console.error("Failed to fetch counts", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCounts();
  }, []);

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <div className="max-w-6xl mx-auto text-black pb-20">
      <div className="flex justify-between items-end mb-12 border-b border-black pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-widest mb-2">Overview</h1>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            Welcome back, {user?.email}
          </p>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors cursor-pointer"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-black" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Films Card */}
          <Link href="/admin/films" className="group border-2 border-black p-8 hover:bg-black transition-colors duration-300 flex flex-col h-64 cursor-pointer relative">
            <div className="flex justify-between items-start group-hover:text-white transition-colors duration-300">
              <h2 className="text-xl font-bold uppercase tracking-widest">Films</h2>
              <Film size={28} strokeWidth={1.5} />
            </div>
            <div className="mt-auto group-hover:text-white transition-colors duration-300">
              <div className="text-8xl font-black leading-none tracking-tighter mb-2">
                {counts.films}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                <span>Manage Movies</span>
                <ArrowRight size={16} strokeWidth={2} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </div>
          </Link>

          {/* Directors Card */}
          <Link href="/admin/directors" className="group border-2 border-black p-8 hover:bg-black transition-colors duration-300 flex flex-col h-64 cursor-pointer relative">
            <div className="flex justify-between items-start group-hover:text-white transition-colors duration-300">
              <h2 className="text-xl font-bold uppercase tracking-widest">Directors</h2>
              <Users size={28} strokeWidth={1.5} />
            </div>
            <div className="mt-auto group-hover:text-white transition-colors duration-300">
              <div className="text-8xl font-black leading-none tracking-tighter mb-2">
                {counts.directors}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                <span>Manage Profiles</span>
                <ArrowRight size={16} strokeWidth={2} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </div>
          </Link>

          {/* Challenges Card */}
          <Link href="/admin/challenges" className="group border-2 border-black p-8 hover:bg-black transition-colors duration-300 flex flex-col h-64 cursor-pointer relative">
            <div className="flex justify-between items-start group-hover:text-white transition-colors duration-300">
              <h2 className="text-xl font-bold uppercase tracking-widest">Challenges</h2>
              <Trophy size={28} strokeWidth={1.5} />
            </div>
            <div className="mt-auto group-hover:text-white transition-colors duration-300">
              <div className="text-8xl font-black leading-none tracking-tighter mb-2">
                {counts.challenges}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                <span>Manage Events</span>
                <ArrowRight size={16} strokeWidth={2} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </div>
          </Link>

          {/* Journals Card */}
          <Link href="/admin/journals" className="group border-2 border-black p-8 hover:bg-black transition-colors duration-300 flex flex-col h-64 cursor-pointer relative">
            <div className="flex justify-between items-start group-hover:text-white transition-colors duration-300">
              <h2 className="text-xl font-bold uppercase tracking-widest">Journals</h2>
              <BookOpen size={28} strokeWidth={1.5} />
            </div>
            <div className="mt-auto group-hover:text-white transition-colors duration-300">
              <div className="text-8xl font-black leading-none tracking-tighter mb-2">
                {counts.journals}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                <span>Manage Research</span>
                <ArrowRight size={16} strokeWidth={2} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
