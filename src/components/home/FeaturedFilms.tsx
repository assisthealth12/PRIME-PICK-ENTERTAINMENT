"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { FilmCard } from "@/components/films/FilmCard";

interface Film {
  id: string;
  title: string;
  directorName: string;
  posterUrl?: string;
  youtubeLink?: string;
  genre?: string;
  year?: number;
  language?: string;
  runtime?: string;
  status?: string;
  visibility?: string;
  featured?: boolean;
}

export function FeaturedFilms() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const q = query(
          collection(db, "films"), 
          where("featured", "==", true),
          where("visibility", "==", "Publish"),
          where("status", "==", "Released"),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const filmsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Film[];
        
        // Sorting in JS if needed, but if the array is small it doesn't matter much.
        // Doing it in JS because Firestore composite index would be required for where + orderBy.
        filmsData.sort((a, b) => (b.year || 0) - (a.year || 0));
        
        setFilms(filmsData);
      } catch (error) {
        console.error("Error fetching featured films:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  if (loading) {
    return (
      <section className="py-24 bg-transparent flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (films.length === 0) {
    return null; // Don't show the section if no featured films
  }

  return (
    <section className="py-24 bg-transparent">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-body text-[10px] font-medium tracking-[0.3em] uppercase text-accent">
                Curated Selection
              </span>
              <div className="h-px w-12 bg-accent opacity-40"></div>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-wider text-text-primary uppercase">
              Featured Films
            </h2>
          </div>
          <Link 
            href="/films"
            className="text-xs font-medium tracking-[0.15em] text-accent uppercase hover:text-accent-hover transition-colors flex items-center gap-2"
          >
            View All Films
            <div className="w-6 h-px bg-current"></div>
          </Link>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {films.map((film) => (
            <motion.div variants={itemVariants} key={film.id}>
              <FilmCard film={film} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
