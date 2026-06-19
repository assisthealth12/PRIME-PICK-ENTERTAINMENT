"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { motion } from "framer-motion";

interface Director {
  id: string;
  name: string;
  bio?: string;
  photoUrl?: string;
}

interface Film {
  id: string;
  title: string;
  posterUrl?: string;
  year?: number;
  genre?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay: i * 0.1 },
  }),
};

export default function DirectorDetailsPage() {
  const params = useParams();
  const [director, setDirector] = useState<Director | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirectorAndFilms = async () => {
      if (!params.id) return;
      try {
        // Fetch Director
        const docRef = doc(db, "directors", params.id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const dirData = { id: docSnap.id, ...docSnap.data() } as Director;
          setDirector(dirData);

          // Fetch Films by this director
          // Assuming directorName matches exactly. If you store directorId in films, use that instead.
          if (dirData.name) {
            const filmsQuery = query(
              collection(db, "films"),
              where("directorName", "==", dirData.name)
            );
            const filmsSnap = await getDocs(filmsQuery);
            const filmsData = filmsSnap.docs.map(f => ({
              id: f.id,
              ...f.data()
            })) as Film[];
            setFilms(filmsData);
          }
        }
      } catch (error) {
        console.error("Error fetching director details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDirectorAndFilms();
  }, [params.id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-9 h-9 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Not found ── */
  if (!director) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-3 tracking-wider uppercase">
          Director Not Found
        </h1>
        <p className="text-text-secondary text-sm mb-8 max-w-md">
          The profile you are looking for doesn&apos;t exist.
        </p>
        <Link
          href="/directors"
          className="inline-flex items-center gap-2 border border-text-primary text-text-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-text-primary hover:text-background transition-all"
        >
          <ArrowLeft size={14} /> All Directors
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Back Link */}
        <Link
          href="/directors"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-[11px] font-bold uppercase tracking-[0.2em] transition-colors mb-12 md:mb-20"
        >
          <ArrowLeft size={14} /> Back to Roster
        </Link>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24 md:mb-32">
          
          {/* Left: Photo */}
          <motion.div 
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-4"
          >
            <div className="relative w-full max-w-[320px] mx-auto lg:mx-0 aspect-[4/5] rounded-[100px] sm:rounded-full overflow-hidden shadow-2xl border border-border-subtle group">
              {director.photoUrl ? (
                <Image
                  src={director.photoUrl}
                  alt={director.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                  priority
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                  <span className="font-heading text-8xl font-bold text-accent">
                    {director.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Info */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-4 mb-4"
            >
              <div className="h-px w-8 bg-accent opacity-60"></div>
              <span className="font-body text-[10px] font-medium tracking-[0.3em] uppercase text-accent">
                Director Profile
              </span>
            </motion.div>

            <motion.h1
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-text-primary uppercase leading-none mb-10"
            >
              {director.name}
            </motion.h1>

            {director.bio && (
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <h3 className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-accent mb-6 flex items-center gap-3">
                  Biography
                  <span className="h-px w-16 bg-border-subtle" />
                </h3>
                <p className="text-text-secondary leading-[2] text-[15px] sm:text-base md:text-lg max-w-3xl">
                  {director.bio}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Filmography Section */}
        {films.length > 0 && (
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-6 mb-12">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-wider text-text-primary uppercase">
                Filmography
              </h2>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
                {films.length} Project{films.length !== 1 && "s"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {films.map((film) => (
                <Link href={`/films/${film.id}`} key={film.id} className="group flex flex-col">
                  <div className="relative aspect-[2/3] glass-panel rounded overflow-hidden mb-4 transition-all duration-500 group-hover:border-accent group-hover:shadow-xl group-hover:-translate-y-1">
                    {film.posterUrl ? (
                      <Image 
                        src={film.posterUrl}
                        alt={film.title || "Film Poster"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-background-secondary to-background flex items-center justify-center p-6 text-center">
                        <span className="font-heading text-xl font-bold text-text-primary opacity-20">{film.title}</span>
                      </div>
                    )}
                    
                    {/* Hover Play Overlay */}
                    <div className="absolute inset-0 bg-background/80 opacity-0 transition-opacity duration-300 flex items-center justify-center group-hover:opacity-100">
                      <div className="w-14 h-14 rounded-full border border-accent text-accent flex items-center justify-center transition-transform duration-300 scale-75 group-hover:scale-100 bg-background-secondary shadow-lg shadow-accent/20">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col px-1">
                    <h3 className="font-heading text-lg font-bold text-text-primary mb-1 line-clamp-1">
                      {film.title}
                    </h3>
                    {(film.year || film.genre) && (
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-secondary font-medium">
                        {film.year && <span>{film.year}</span>}
                        {film.year && film.genre && <div className="w-1 h-1 rounded-full bg-accent"></div>}
                        {film.genre && <span>{film.genre}</span>}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
