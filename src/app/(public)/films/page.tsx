"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { FilmCard } from "@/components/films/FilmCard";
import { ChevronDown } from "lucide-react";

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
  createdAt?: any;
}

type SortOption = "newest" | "oldest" | "az" | "za";

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedDirector, setSelectedDirector] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  
  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const q = query(
          collection(db, "films"), 
          where("visibility", "==", "Publish")
        );
        const querySnapshot = await getDocs(q);
        let filmsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Film[];

        // Filter out archived
        filmsData = filmsData.filter(f => f.status !== "Archived");
        
        setFilms(filmsData);
      } catch (error) {
        console.error("Error fetching films:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  // Compute unique filter options
  const genres = ["All", ...Array.from(new Set(films.map(f => f.genre).filter(Boolean)))];
  const directors = ["All", ...Array.from(new Set(films.map(f => f.directorName).filter(Boolean)))];
  const years = ["All", ...Array.from(new Set(films.map(f => f.year?.toString()).filter(Boolean)))].sort((a, b) => b.localeCompare(a));
  const languages = ["All", ...Array.from(new Set(films.map(f => f.language).filter(Boolean)))];

  // Apply filters & sorting
  const filteredAndSortedFilms = useMemo(() => {
    let result = [...films];

    // Filters
    if (selectedGenre !== "All") result = result.filter(f => f.genre === selectedGenre);
    if (selectedDirector !== "All") result = result.filter(f => f.directorName === selectedDirector);
    if (selectedYear !== "All") result = result.filter(f => f.year?.toString() === selectedYear);
    if (selectedLanguage !== "All") result = result.filter(f => f.language === selectedLanguage);

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "az") return a.title.localeCompare(b.title);
      if (sortBy === "za") return b.title.localeCompare(a.title);
      
      const yearA = a.year || 0;
      const yearB = b.year || 0;
      const timeA = a.createdAt?.toMillis?.() || yearA;
      const timeB = b.createdAt?.toMillis?.() || yearB;

      if (sortBy === "newest") return timeB - timeA;
      if (sortBy === "oldest") return timeA - timeB;
      return 0;
    });

    return result;
  }, [films, selectedGenre, selectedDirector, selectedYear, selectedLanguage, sortBy]);

  const upcomingFilms = filteredAndSortedFilms.filter(f => f.status === "Upcoming");
  const releasedFilms = filteredAndSortedFilms.filter(f => f.status !== "Upcoming");

  return (
    <div className="pt-12 md:pt-16 pb-32 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <header className="mb-8 md:mb-12">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-text-primary mb-4 uppercase">
            Library
          </h1>
          <p className="font-heading italic text-text-secondary text-lg md:text-xl max-w-3xl leading-relaxed">
            Our curated collection of independent cinema. Unbound storytelling.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* ── Sorting ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-end gap-6 mb-10 border-b border-border-subtle pb-6">

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">Sort</span>
                <div className="relative">
                  <select 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-transparent border-b border-text-primary text-xs font-bold uppercase tracking-widest pl-0 pr-6 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="az">A - Z</option>
                    <option value="za">Z - A</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* ── Upcoming Section ── */}
            {upcomingFilms.length > 0 && (
              <section className="mb-24">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="font-heading text-2xl md:text-4xl font-bold uppercase tracking-widest">
                    Upcoming Releases
                  </h2>
                  <div className="flex-1 h-px bg-border-subtle"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {upcomingFilms.map(film => (
                    <FilmCard key={film.id} film={film} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Released Section ── */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="font-heading text-2xl md:text-4xl font-bold uppercase tracking-widest">
                  Released
                </h2>
                <div className="flex-1 h-px bg-border-subtle"></div>
              </div>

              {releasedFilms.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-text-secondary text-sm uppercase tracking-widest font-bold">No films match your criteria.</p>
                  <button 
                    onClick={() => { setSelectedGenre("All"); setSelectedDirector("All"); setSelectedYear("All"); setSelectedLanguage("All"); }}
                    className="mt-6 text-accent hover:text-accent-hover text-xs uppercase tracking-widest font-bold"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
                  {releasedFilms.map(film => (
                    <FilmCard key={film.id} film={film} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

// Sub-component for filter dropdowns to keep code clean
function FilterSelect({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string; 
  value: string; 
  options: (string | undefined)[]; 
  onChange: (val: string) => void;
}) {
  const validOptions = options.filter(Boolean) as string[];
  if (validOptions.length <= 1) return null; // Don't show filter if no options

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent border-b border-border-subtle hover:border-text-primary text-xs font-bold uppercase tracking-widest pl-0 pr-6 py-1 focus:outline-none cursor-pointer transition-colors w-32 truncate"
        >
          {validOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary" />
      </div>
    </div>
  );
}
