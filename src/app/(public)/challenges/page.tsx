"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ChallengeData } from "@/components/admin/ChallengeFormModal";

// Helper to slugify series name
const slugify = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export default function ChallengesPage() {
  const [seriesPackages, setSeriesPackages] = useState<{ name: string; slug: string; latestCover: string; seasonCount: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const q = query(
          collection(db, "challenges"),
          where("visibility", "==", "Publish"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChallengeData[];

        // Group by Series Name
        const grouped = new Map<string, { latestCover: string; seasons: Set<string> }>();
        
        data.forEach(challenge => {
          if (!grouped.has(challenge.seriesName)) {
            grouped.set(challenge.seriesName, {
              latestCover: challenge.coverUrl,
              seasons: new Set([challenge.season])
            });
          } else {
            // Already exists, just add season
            grouped.get(challenge.seriesName)!.seasons.add(challenge.season);
          }
        });

        const packages = Array.from(grouped.entries()).map(([name, info]) => ({
          name,
          slug: slugify(name),
          latestCover: info.latestCover,
          seasonCount: info.seasons.size
        }));

        setSeriesPackages(packages);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <div className="pt-12 md:pt-16 pb-32 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-4 md:px-8">
        <header className="mb-12 md:mb-16">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-text-primary mb-4 uppercase">
            Challenge Series
          </h1>
          <p className="font-heading italic text-text-secondary text-lg md:text-xl max-w-3xl leading-relaxed">
            Witness the creative pressure cooker. Explore films born from intense constraints and creative challenges.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : seriesPackages.length === 0 ? (
          <div className="py-20 text-center border-2 border-border-subtle border-dashed">
            <p className="text-text-secondary text-sm uppercase tracking-widest font-bold">No challenge series available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {seriesPackages.map((pkg) => (
              <Link href={`/challenges/${pkg.slug}`} key={pkg.slug} className="group block h-full">
                <article className="h-full flex flex-col border border-border-subtle hover:border-text-primary transition-all duration-300 bg-bg-secondary overflow-hidden">
                  <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                    {pkg.latestCover ? (
                      <Image
                        src={pkg.latestCover}
                        alt={`${pkg.name} Cover`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-heading text-4xl text-border-subtle">
                        {pkg.name.charAt(0)}
                      </div>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between bg-bg-secondary group-hover:bg-bg-elevated transition-colors duration-300">
                    <div>
                      <h2 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-widest text-text-primary mb-2 line-clamp-2">
                        {pkg.name}
                      </h2>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                        <span>{pkg.seasonCount} Season{pkg.seasonCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Explore Series</span>
                      <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
