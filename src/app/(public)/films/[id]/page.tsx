"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Play } from "lucide-react";
import { motion } from "framer-motion";

interface Film {
  id: string;
  title: string;
  directorName: string;
  posterUrl?: string;
  youtubeLink?: string;
  videoType?: string;
  synopsis?: string;
  cast?: string[];
  genre?: string;
  year?: number;
  language?: string;
}

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: i * 0.1 },
  }),
};

export default function FilmDetailsPage() {
  const params = useParams();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const fetchFilm = async () => {
      if (!params.id) return;
      try {
        const docRef = doc(db, "films", params.id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFilm({ id: docSnap.id, ...docSnap.data() } as Film);
        }
      } catch (error) {
        console.error("Error fetching film:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilm();
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
  if (!film) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-3 tracking-wider uppercase">
          Film Not Found
        </h1>
        <p className="text-text-secondary text-sm mb-8 max-w-md">
          The film you are looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/films"
          className="inline-flex items-center gap-2 border border-text-primary text-text-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-text-primary hover:text-background transition-all"
        >
          <ArrowLeft size={14} /> Back to Films
        </Link>
      </div>
    );
  }

  const ytId = film.youtubeLink ? getYouTubeId(film.youtubeLink) : null;
  const videoLabel = film.videoType || "Trailer";

  return (
    <div className="min-h-screen bg-background">
      {/* ================================================================ */}
      {/* SECTION 1 — VIDEO HERO (full-width, cinematic)                    */}
      {/* ================================================================ */}
      <section className="relative bg-black pt-6 md:pt-10">
        {/* Back link — sits in the black area above the video */}
        <div className="absolute top-4 md:top-6 left-4 md:left-8 z-30">
          <Link
            href="/films"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </Link>
        </div>

        {/* 16:9 video area */}
        <div className="relative w-full aspect-video max-h-[80vh] mt-8 md:mt-12">
          {ytId && !playing ? (
            /* ── Thumbnail + play overlay ── */
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 w-full h-full cursor-pointer group"
            >
              <Image
                src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                alt={film.title || "Video thumbnail"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                unoptimized
                priority
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

              {/* Centered play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 border-white/80 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/10 backdrop-blur-sm bg-black/20">
                  <Play
                    size={28}
                    className="text-white ml-1 transition-colors group-hover:text-accent"
                    fill="currentColor"
                  />
                </div>
              </div>

              {/* Bottom-left label */}
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Play size={14} className="text-black ml-0.5" fill="currentColor" />
                </div>
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest">
                  Play {videoLabel}
                </span>
              </div>
            </button>
          ) : ytId && playing ? (
            /* ── Embedded YouTube player ── */
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&showinfo=0`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : film.posterUrl ? (
            /* ── Fallback: poster as hero ── */
            <div className="absolute inset-0">
              <Image
                src={film.posterUrl}
                alt={film.title || "Film"}
                fill
                className="object-cover"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
            </div>
          ) : (
            /* ── No media at all ── */
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black flex items-center justify-center">
              <span className="font-heading text-3xl text-white/10 uppercase tracking-widest">
                {film.title || "No Media"}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2 — FILM INFO                                            */}
      {/* ================================================================ */}
      <section className="relative z-10 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16">

            {/* ── LEFT: Main content ── */}
            <div className="lg:col-span-8 pt-10 md:pt-14 pb-16 md:pb-24">

              {/* Video type badge */}
              {film.videoType && (
                <motion.span
                  custom={0}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="inline-block bg-accent text-black text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 mb-5"
                >
                  {film.videoType}
                </motion.span>
              )}

              {/* Title */}
              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider text-text-primary uppercase leading-[0.95] mb-4"
              >
                {film.title || "Untitled Film"}
              </motion.h1>

              {/* Director */}
              {film.directorName && (
                <motion.div
                  custom={2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-3 mb-8"
                >
                  <span className="text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                    Directed by
                  </span>
                  <span className="text-sm uppercase tracking-[0.15em] font-bold text-accent">
                    {film.directorName}
                  </span>
                </motion.div>
              )}

              {/* Meta tags */}
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-2 mb-10"
              >
                {film.year && (
                  <span className="border border-border-subtle text-text-secondary text-[11px] font-medium uppercase tracking-widest px-4 py-1.5">
                    {film.year}
                  </span>
                )}
                {film.genre && (
                  <span className="border border-border-subtle text-text-secondary text-[11px] font-medium uppercase tracking-widest px-4 py-1.5">
                    {film.genre}
                  </span>
                )}
                {film.language && (
                  <span className="border border-border-subtle text-text-secondary text-[11px] font-medium uppercase tracking-widest px-4 py-1.5">
                    {film.language}
                  </span>
                )}
              </motion.div>

              {/* Divider */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="h-px bg-border-subtle mb-10"
              />

              {/* Synopsis */}
              {film.synopsis && (
                <motion.div
                  custom={4}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-12"
                >
                  <h3 className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-accent mb-4 flex items-center gap-3">
                    Synopsis
                    <span className="h-px flex-1 bg-border-subtle" />
                  </h3>
                  <p className="text-text-secondary leading-[1.9] text-[15px] md:text-base max-w-2xl">
                    {film.synopsis}
                  </p>
                </motion.div>
              )}

              {/* Cast */}
              {film.cast && film.cast.length > 0 && (
                <motion.div
                  custom={5}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-12"
                >
                  <h3 className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-accent mb-5 flex items-center gap-3">
                    Cast
                    <span className="h-px flex-1 bg-border-subtle" />
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {film.cast.map((actor, idx) => (
                      <span
                        key={idx}
                        className="bg-surface border border-border-subtle text-text-primary text-[11px] font-medium uppercase tracking-wider px-4 py-2 hover:border-accent/50 transition-colors"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Watch on YouTube CTA */}
              {film.youtubeLink && (
                <motion.div
                  custom={6}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <a
                    href={film.youtubeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-3 bg-text-primary text-background px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Watch {videoLabel} on YouTube
                    <ExternalLink
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                </motion.div>
              )}
            </div>

            {/* ── RIGHT: Metadata sidebar ── */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-4 pb-16 md:pb-24"
            >
              <div className="lg:sticky lg:top-28 pt-0 lg:pt-14">
                {/* Removed redundant poster image. The Film Details card will now sit cleanly at the top of the sidebar. */}

                {/* Film details card */}
                <div className="border border-border-subtle p-6 md:p-8 bg-surface">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent mb-6 flex items-center gap-3">
                    Film Details
                    <span className="h-px flex-1 bg-border-subtle" />
                  </h4>
                  <dl className="space-y-5 text-xs">
                    {film.directorName && (
                      <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                        <dt className="text-text-secondary uppercase tracking-wider">Director</dt>
                        <dd className="text-text-primary font-medium text-right">{film.directorName}</dd>
                      </div>
                    )}
                    {film.genre && (
                      <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                        <dt className="text-text-secondary uppercase tracking-wider">Genre</dt>
                        <dd className="text-text-primary font-medium">{film.genre}</dd>
                      </div>
                    )}
                    {film.year && (
                      <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                        <dt className="text-text-secondary uppercase tracking-wider">Year</dt>
                        <dd className="text-text-primary font-medium">{film.year}</dd>
                      </div>
                    )}
                    {film.language && (
                      <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                        <dt className="text-text-secondary uppercase tracking-wider">Language</dt>
                        <dd className="text-text-primary font-medium">{film.language}</dd>
                      </div>
                    )}
                    {film.videoType && (
                      <div className="flex justify-between items-center">
                        <dt className="text-text-secondary uppercase tracking-wider">Type</dt>
                        <dd className="text-text-primary font-medium">{film.videoType}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
