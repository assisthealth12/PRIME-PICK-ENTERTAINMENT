"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import Image from "next/image";

interface Director {
  id: string;
  name: string;
  photoUrl?: string;
}

export function DirectorsHighlight() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const q = query(collection(db, "directors"), orderBy("createdAt", "desc"), limit(5));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Director[];
        setDirectors(data);
      } catch (error) {
        console.error("Error fetching directors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectors();
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

  if (directors.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-transparent border-t border-border-subtle">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-accent opacity-40"></div>
            <span className="font-body text-[10px] font-medium tracking-[0.3em] uppercase text-accent">
              Visionaries
            </span>
            <div className="h-px w-12 bg-accent opacity-40"></div>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-wider text-text-primary mb-4">
            Meet the Directors
          </h2>
          <p className="font-heading italic text-text-secondary text-xl md:text-2xl max-w-2xl mx-auto">
            The independent voices shaping the future of Indian storytelling.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-4 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {directors.map((dir) => (
            <motion.div variants={itemVariants} key={dir.id}>
              <Link href={`/directors/${dir.id}`} className="group flex flex-col items-center text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden glass-panel flex items-center justify-center mb-6 transition-all duration-500 group-hover:border-accent group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-accent/10 relative">
                  {dir.photoUrl ? (
                    <Image
                      src={dir.photoUrl}
                      alt={dir.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="font-heading text-4xl font-bold text-accent">
                      {dir.name ? dir.name.charAt(0).toUpperCase() : "?"}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-text-primary text-xl mb-1 group-hover:text-accent transition-colors">
                  {dir.name}
                </h3>
                <span className="text-[10px] font-medium text-text-secondary uppercase tracking-[0.15em]">
                  Director
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <Link 
            href="/directors"
            className="inline-block bg-transparent border border-border-subtle text-text-primary px-8 py-3 uppercase font-heading font-medium text-xs tracking-[0.15em] transition-colors hover:border-accent hover:text-accent"
          >
            View All Profiles
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
