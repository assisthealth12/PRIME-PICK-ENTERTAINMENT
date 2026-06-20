"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowLeft } from "lucide-react";
import { ChallengeData } from "@/components/admin/ChallengeFormModal";

const slugify = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^?&\s]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export default function ChallengeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const seriesSlug = params.slug as string;

  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  // Track which film is currently playing (by film id)
  const [playingFilmId, setPlayingFilmId] = useState<string | null>(null);

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

        // Filter data to only include the requested slug
        const seriesData = data.filter(c => slugify(c.seriesName) === seriesSlug);
        
        if (seriesData.length > 0) {
          setChallenges(seriesData);
          // Auto-select latest season
          setSelectedSeason(seriesData[0].season);
        }
      } catch (error) {
        console.error("Error fetching challenge details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (seriesSlug) {
      fetchChallenges();
    }
  }, [seriesSlug]);

  const activeChallenge = useMemo(() => {
    return challenges.find(c => c.season === selectedSeason);
  }, [challenges, selectedSeason]);

  const seriesName = challenges[0]?.seriesName || "Challenge Series";
  const allSeasons = challenges.map(c => c.season);

  // Reset playing state when season changes
  useEffect(() => {
    setPlayingFilmId(null);
  }, [selectedSeason]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40 min-h-screen">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="py-40 text-center min-h-screen">
        <p className="text-text-secondary text-sm uppercase tracking-widest font-bold">Challenge not found.</p>
        <button onClick={() => router.push('/challenges')} className="mt-4 text-accent hover:underline text-xs uppercase tracking-widest font-bold">
          ← Back to Challenges
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-12 md:pt-16 pb-32">
      <div className="container mx-auto px-4 md:px-8">

        {/* ── Header (no cover image) ── */}
        <button 
          onClick={() => router.push('/challenges')}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-colors mb-8 w-fit"
        >
          <ArrowLeft size={14} /> Back to Challenges
        </button>

        <header className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-accent opacity-60"></div>
            <span className="font-body text-[10px] font-medium tracking-[0.3em] uppercase text-accent">
              {activeChallenge?.season}
            </span>
            <div className="h-px w-8 bg-accent opacity-60"></div>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-text-primary mb-4 uppercase">
            {seriesName}
          </h1>
          {activeChallenge?.description && (
            <p className="font-heading italic text-text-secondary text-lg md:text-xl max-w-3xl leading-relaxed">
              {activeChallenge.description}
            </p>
          )}
        </header>
        
        {/* ── Season Filter ── */}
        {allSeasons.length > 1 && (
          <div className="flex flex-wrap items-center gap-3 mb-16 pb-6 border-b border-border-subtle">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary mr-2">Select Season:</span>
            {allSeasons.map(season => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  selectedSeason === season 
                    ? "bg-text-primary text-bg-primary border border-text-primary" 
                    : "bg-transparent text-text-secondary border border-border-subtle hover:border-text-primary hover:text-text-primary"
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        )}

        {/* ── Films Grid ── */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-heading text-2xl md:text-4xl font-bold uppercase tracking-widest text-text-primary">
              Submitted Films
            </h2>
            <div className="flex-1 h-px bg-border-subtle"></div>
            <span className="text-text-secondary text-sm font-bold">{activeChallenge?.films?.length || 0}</span>
          </div>
          
          {(!activeChallenge?.films || activeChallenge.films.length === 0) ? (
            <div className="py-16 text-center border-2 border-dashed border-border-subtle">
              <p className="text-text-secondary text-sm uppercase tracking-widest font-bold">No films submitted for this season yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
              {activeChallenge.films.map((film, index) => {
                const ytId = film.youtubeLink ? getYouTubeId(film.youtubeLink) : null;

                return (
                  <Link href={`/challenges/${seriesSlug}/${film.id}`} key={film.id || index} className="group flex flex-col">
                    {/* Video / Thumbnail */}
                    <div className="relative aspect-video w-full bg-black overflow-hidden mb-4 border border-border-subtle">
                      <Image
                        src={film.posterUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : "/placeholder.jpg")}
                        alt={film.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Centered Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center backdrop-blur-sm bg-black/20">
                          <Play
                            size={22}
                            className="text-white ml-0.5"
                            fill="currentColor"
                          />
                        </div>
                      </div>

                      {/* Bottom-left label */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                          <ArrowLeft size={10} className="text-black transform rotate-135" />
                        </div>
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
                          View Details
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col gap-1">
                      <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
                        {film.title}
                      </h3>
                      {film.directorName && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary">
                          Dir. {film.directorName}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
