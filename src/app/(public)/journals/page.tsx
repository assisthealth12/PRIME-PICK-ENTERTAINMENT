"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy, getDoc, doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Loader2, FileText, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
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
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "journals");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.types) setAvailableTypes(data.types);
          if (data.tags) setAvailableTags(data.tags);
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
    const matchesSearch = journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          journal.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          journal.authors.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || journal.type === selectedType;
    const matchesTag = selectedTag === "All" || (journal.tags && journal.tags.includes(selectedTag));
    return matchesSearch && matchesType && matchesTag;
  });

  return (
    <div className="min-h-screen bg-background pt-16 pb-32">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* ── Header ── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-16"
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
          className="mb-12 border border-border-subtle bg-surface p-5 flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Search journals, authors, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border-subtle py-3 px-4 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors font-body text-sm"
          />
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex-1 min-w-0 bg-background border border-border-subtle py-3 px-4 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors cursor-pointer font-body"
            >
              <option value="All">All Types</option>
              {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="flex-1 min-w-0 bg-background border border-border-subtle py-3 px-4 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors cursor-pointer font-body"
            >
              <option value="All">All Tags</option>
              {availableTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </motion.div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-9 h-9 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="text-center py-20 border border-border-subtle bg-surface">
            <FileText size={48} className="mx-auto text-text-secondary/30 mb-4" strokeWidth={1.5} />
            <h3 className="font-heading text-xl text-text-primary font-bold mb-2 uppercase tracking-wider">No journals found</h3>
            <p className="text-text-secondary text-sm mb-6">Try adjusting your filters or search query.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedType("All"); setSelectedTag("All"); }}
              className="inline-flex items-center gap-2 border border-text-primary text-text-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-text-primary hover:text-background transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* ── Instagram-style 4:5 Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJournals.map((journal, idx) => (
              <motion.div
                key={journal.id}
                custom={idx + 2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="h-full"
              >
                <Link
                  href={`/journals/${journal.id}`}
                  className="group flex flex-col h-full border border-border-subtle bg-surface overflow-hidden hover:border-accent/40 hover:shadow-lg transition-all duration-300"
                >
                  {/* 4:5 Cover Image (Instagram ratio) - No text overlay */}
                  <div className="relative w-full overflow-hidden bg-background shrink-0" style={{ aspectRatio: "4/5" }}>
                    {journal.coverImage ? (
                      <Image
                        src={journal.coverImage}
                        alt={journal.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="text-text-secondary/15" size={48} />
                      </div>
                    )}

                    {/* Type badge - Still on top of image */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-black text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1">
                        {journal.type}
                      </span>
                    </div>
                  </div>

                  {/* Content below the image */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-heading text-lg md:text-xl font-bold text-text-primary uppercase tracking-wider leading-tight line-clamp-2 mb-3 group-hover:text-accent transition-colors">
                      {journal.title}
                    </h2>
                    
                    <div className="flex flex-col gap-1 mb-4">
                      <span className="text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                        By <span className="text-text-primary font-bold">{journal.authors}</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-text-secondary/60">
                        {journal.publishDate}
                      </span>
                    </div>

                    {/* Spacer to push tags to bottom if title is short */}
                    <div className="flex-1" />

                    {/* Bottom bar with tags */}
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-border-subtle">
                      <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                        {journal.tags?.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="border border-border-subtle text-text-secondary text-[8px] font-medium uppercase tracking-widest px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                        {journal.tags && journal.tags.length > 2 && (
                          <span className="text-[8px] text-text-secondary/50 uppercase tracking-widest px-1 py-0.5">
                            +{journal.tags.length - 2}
                          </span>
                        )}
                      </div>

                      {journal.pdfUrl && (
                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-accent shrink-0 flex items-center gap-1">
                          <FileText size={10} /> PDF
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
