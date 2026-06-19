"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import Image from "next/image";

interface Film {
  id: string;
  title: string;
  directorName: string;
  posterUrl?: string;
  youtubeLink?: string;
  genre?: string;
  year?: number;
  language?: string;
  videoType?: string;
}

export default function BTSPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBTS = async () => {
      try {
        const q = query(
          collection(db, "films"),
          where("videoType", "==", "Behind the Scenes")
        );
        const querySnapshot = await getDocs(q);
        const filmsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Film[];
        
        // Sorting in JS since Firestore requires a composite index for where + orderBy
        filmsData.sort((a, b) => {
          const yearA = a.year || 0;
          const yearB = b.year || 0;
          return yearB - yearA;
        });

        setFilms(filmsData);
      } catch (error) {
        console.error("Error fetching BTS content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBTS();
  }, []);

  return (
    <div className="pt-24 pb-32 min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-wider text-text-primary mb-6 uppercase">
            Behind The Scenes
          </h1>
          <p className="font-heading italic text-text-secondary text-xl">
            The magic behind the lens. Discover how we bring stories to life.
          </p>
          <div className="h-px w-24 bg-accent/30 mx-auto mt-8"></div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : films.length === 0 ? (
          <div className="border border-border-subtle p-16 text-center rounded">
            <p className="text-text-secondary font-body uppercase tracking-widest text-sm">
              More content coming soon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {films.map((film) => (
              <Link href={`/films/${film.id}`} key={film.id} className="group flex flex-col">
                <div className="relative aspect-video bg-surface border border-border-subtle rounded overflow-hidden mb-4 transition-all duration-500 group-hover:border-accent">
                  {film.posterUrl ? (
                    <Image 
                      src={film.posterUrl}
                      alt={film.title || "BTS Video"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-surface to-background-secondary flex items-center justify-center p-6 text-center">
                      <span className="font-heading text-lg font-bold text-text-primary opacity-30">{film.title || "Untitled"}</span>
                    </div>
                  )}
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-background/60 opacity-0 transition-opacity duration-300 flex items-center justify-center group-hover:opacity-100">
                    <div className="w-16 h-16 rounded-full border-2 border-accent text-accent flex items-center justify-center transition-transform duration-300 scale-75 group-hover:scale-100">
                      <Play size={24} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col px-1 text-center">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent mb-2">
                    Making Of
                  </span>
                  <h3 className="font-heading text-xl font-bold text-text-primary mb-1 line-clamp-1">
                    {film.title || "Untitled BTS"}
                  </h3>
                  {film.directorName && (
                    <p className="text-xs font-medium text-text-secondary uppercase tracking-widest mt-1">
                      Dir. {film.directorName}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
