"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy, getDoc, doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Loader2, FileText, BookOpen, Search, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { JournalData } from "@/components/admin/JournalFormModal";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay: i * 0.08 },
  }),
};

export default function JournalsPage() {
  const [journals, setJournals] = useState<JournalData[]>([]);
  const [loading, setLoading] = useState(true);

  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "journals");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.types) setAvailableTypes(data.types);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const q = query(collection(db, "journals"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const journalsData = querySnapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as JournalData[];
        setJournals(journalsData);
      } catch (error) {
        console.error("Error fetching journals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  const filteredJournals = journals.filter(journal => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (journal.title || "").toLowerCase().includes(query) ||
      (journal.abstract || "").toLowerCase().includes(query) ||
      (journal.authors || "").toLowerCase().includes(query) ||
      (journal.tags || []).some(tag => tag.toLowerCase().includes(query));
      
    const matchesType = selectedType === "All" || journal.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const hasActiveFilters = searchQuery !== "" || selectedType !== "All";

  return (
    <div className="min-h-screen bg-background pt-16 pb-32">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── Header ── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <span className="inline-block bg-accent text-black text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 mb-5">
            Library
          </span>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider text-text-primary uppercase leading-[0.95] mb-4">
            Research &amp; Journals
          </h1>
          <p className="max-w-xl font-body text-text-secondary text-sm leading-relaxed">
            Explore our curated collection of research papers, thesis documents, audience analyses, and industry insights.
          </p>
        </motion.div>

        {/* ── Filters ── */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-10 border border-border-subtle bg-surface p-5 flex flex-col gap-4 sticky top-4 z-10 backdrop-blur-sm"
        >
          {/* Search row */}
          <div className="flex items-center gap-3 bg-background border border-border-subtle px-4 py-3 focus-within:border-accent transition-colors">
            <Search size={16} strokeWidth={2} className="text-text-secondary/60 shrink-0" />
            <input
              type="text"
              placeholder="Search journals, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-text-primary placeholder-text-secondary text-sm font-body focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="text-text-secondary/60 hover:text-text-primary transition-colors cursor-pointer shrink-0"
              >
                <X size={14} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-text-secondary/60 text-[10px] font-bold uppercase tracking-[0.15em] shrink-0">
              <SlidersHorizontal size={12} strokeWidth={2} />
              Type
            </span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex-1 min-w-0 bg-background border border-border-subtle py-2.5 px-4 text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors cursor-pointer font-body"
            >
              <option value="All">All Types</option>
              {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {hasActiveFilters && (
              <button
                onClick={() => { setSearchQuery(""); setSelectedType("All"); }}
                className="shrink-0 flex items-center gap-1.5 text-text-secondary hover:text-accent text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer px-2 py-2.5"
              >
                <X size={12} strokeWidth={2.5} />
                Reset
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Results count ── */}
        {!loading && journals.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-text-secondary/70 text-xs font-body mb-6 -mt-2"
          >
            Showing <span className="font-bold text-text-primary">{filteredJournals.length}</span> of {journals.length} {journals.length === 1 ? "entry" : "entries"}
          </motion.p>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-row h-40 border border-border-subtle bg-surface overflow-hidden"
              >
                <div className="relative w-32 sm:w-36 shrink-0 bg-border-subtle/40 animate-pulse" />
                <div className="p-5 flex flex-col flex-1 justify-center gap-3 min-w-0">
                  <div className="h-4 bg-border-subtle/40 animate-pulse rounded-sm w-4/5" />
                  <div className="h-4 bg-border-subtle/40 animate-pulse rounded-sm w-3/5" />
                  <div className="h-3 bg-border-subtle/30 animate-pulse rounded-sm w-2/5 mt-2" />
                  <div className="flex gap-1.5 mt-auto pt-4">
                    <div className="h-5 w-12 bg-border-subtle/30 animate-pulse rounded-sm" />
                    <div className="h-5 w-12 bg-border-subtle/30 animate-pulse rounded-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredJournals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 border border-border-subtle bg-surface"
          >
            <FileText size={48} className="mx-auto text-text-secondary/30 mb-4" strokeWidth={1.5} />
            <h3 className="font-heading text-xl text-text-primary font-bold mb-2 uppercase tracking-wider">
              {journals.length === 0 ? "Nothing here yet" : "No journals found"}
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              {journals.length === 0
                ? "Check back soon for new research and publications."
                : "Try adjusting your filters or search query."}
            </p>
            {journals.length > 0 && (
              <button
                onClick={() => { setSearchQuery(""); setSelectedType("All"); }}
                className="inline-flex items-center gap-2 border border-text-primary text-text-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-text-primary hover:text-background transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          /* ── Horizontal Cards — 2 per row ── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredJournals.map((journal, idx) => (
                <motion.div
                  key={journal.id}
                  custom={idx + 2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                  layout
                  className="h-full"
                >
                  <Link
                    href={`/journals/${journal.id}`}
                    className="group flex flex-row h-full border border-border-subtle bg-surface overflow-hidden hover:border-accent hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Left: Cover Image */}
                    <div className="relative w-32 sm:w-36 h-40 shrink-0 bg-black overflow-hidden">
                      {journal.coverImage ? (
                        <Image
                          src={journal.coverImage}
                          alt={journal.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="150px"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="text-white/20" size={32} />
                        </div>
                      )}

                    </div>

                    {/* Right: Content */}
                    <div className="p-5 flex flex-col flex-1 justify-center min-w-0">
                      <span className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 block">
                        {journal.type}
                      </span>
                      <h2 className="font-heading text-lg md:text-xl font-bold text-black leading-snug mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300">
                        {journal.title}
                      </h2>

                      <div className="flex flex-col gap-1 mb-4 border-l-2 border-accent pl-3">
                        <span className="text-xs text-gray-600 font-body truncate">
                          By <span className="text-black font-bold">{journal.authors}</span>
                        </span>
                        <span className="text-[10px] text-gray-400 font-body">
                          {journal.publishDate}
                        </span>
                      </div>

                      {/* Bottom bar with tags */}
                      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-auto">
                        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                          {journal.tags?.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="bg-gray-50 border border-gray-200 text-gray-500 text-[9px] uppercase tracking-wider px-2 py-1 rounded-sm whitespace-nowrap"
                            >
                              {tag}
                            </span>
                          ))}
                          {journal.tags && journal.tags.length > 2 && (
                            <span className="bg-gray-50 border border-gray-200 text-gray-400 text-[9px] uppercase tracking-wider px-2 py-1 rounded-sm whitespace-nowrap">
                              +{journal.tags.length - 2}
                            </span>
                          )}
                        </div>

                        {journal.pdfUrl && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(journal.pdfUrl, "_blank", "noopener,noreferrer");
                            }}
                            className="shrink-0 flex items-center gap-1.5 bg-black text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-colors rounded-sm cursor-pointer"
                          >
                            <FileText size={10} /> PDF
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}