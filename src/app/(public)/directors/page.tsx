"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Image from "next/image";

interface Director {
  id: string;
  name: string;
  photoUrl?: string;
  bio?: string;
}

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const q = query(collection(db, "directors"), orderBy("createdAt", "desc"));
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

  return (
    <div className="pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8">
        <header className="mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-wider text-text-primary mb-4">Directors</h1>
          <p className="font-heading italic text-text-secondary text-xl max-w-2xl">
            The independent voices shaping the future of Indian storytelling.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : directors.length === 0 ? (
          <div className="border border-border-subtle p-12 text-center text-text-secondary font-body uppercase tracking-widest text-sm rounded">
            No directors have been published yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-12">
            {directors.map((dir) => (
              <Link href={`/directors/${dir.id}`} key={dir.id} className="group flex flex-col items-center text-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-border-subtle flex items-center justify-center mb-6 transition-all duration-500 group-hover:border-accent group-hover:scale-105 bg-surface overflow-hidden relative">
                  {dir.photoUrl ? (
                    <Image
                      src={dir.photoUrl}
                      alt={dir.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="font-heading text-5xl font-bold text-accent">
                      {dir.name ? dir.name.charAt(0).toUpperCase() : "?"}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-text-primary text-xl mb-2 group-hover:text-accent transition-colors">
                  {dir.name}
                </h3>
                <span className="text-xs font-medium text-text-secondary uppercase tracking-[0.15em]">
                  Director
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
