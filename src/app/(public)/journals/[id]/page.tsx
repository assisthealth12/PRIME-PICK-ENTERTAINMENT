"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Share2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { JournalData } from "@/components/admin/JournalFormModal";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay: i * 0.1 },
  }),
};

export default function JournalDetailPage() {
  const params = useParams();
  const [journal, setJournal] = useState<JournalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  useEffect(() => {
    const fetchJournal = async () => {
      if (!params.id) return;
      try {
        const docRef = doc(db, "journals", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setJournal({ id: docSnap.id, ...docSnap.data() } as JournalData);
        }
      } catch (error) {
        console.error("Error fetching journal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [params.id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-9 h-9 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Not Found ── */
  if (!journal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-3 tracking-wider uppercase">
          Journal Not Found
        </h1>
        <p className="text-text-secondary text-sm mb-8 max-w-md">
          The research document you are looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/journals"
          className="inline-flex items-center gap-2 border border-text-primary text-text-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] hover:bg-text-primary hover:text-background transition-all"
        >
          <ArrowLeft size={14} /> Back to Journals
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/journals"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Library
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-text-primary hover:text-accent text-[11px] font-bold uppercase tracking-[0.2em] transition-colors"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
            {copied ? "Copied!" : "Share Journal"}
          </button>
        </div>

        {/* ================================================================ */}
        {/* SECTION 1 — HEADER (No Image)                                    */}
        {/* ================================================================ */}
        <div className="mb-16 border-b border-border-subtle pb-16">
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-block bg-accent text-black text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 mb-6"
          >
            {journal.type}
          </motion.span>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider text-text-primary uppercase leading-[1.1] mb-8 max-w-4xl"
          >
            {journal.title}
          </motion.h1>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
          >
            <span className="text-[12px] uppercase tracking-[0.2em] text-text-secondary">
              By <span className="text-text-primary font-bold">{journal.authors}</span>
            </span>
            <span className="text-[12px] uppercase tracking-[0.2em] text-text-secondary">
              Published {journal.publishDate}
            </span>
          </motion.div>
        </div>

        {/* ================================================================ */}
        {/* SECTION 2 — CONTENT                                              */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16">

          {/* ── LEFT: Main content ── */}
          <div className="lg:col-span-8 pb-16 md:pb-24">

            {/* Tags */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2 mb-10"
            >
              {journal.tags?.map(tag => (
                <span
                  key={tag}
                  className="border border-border-subtle text-text-secondary text-[11px] font-medium uppercase tracking-widest px-4 py-1.5"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Abstract */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-16"
            >
              <h3 className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-accent mb-6 flex items-center gap-3">
                Abstract
                <span className="h-px flex-1 bg-border-subtle" />
              </h3>
              <p className="text-text-secondary leading-[1.9] text-[15px] md:text-base whitespace-pre-wrap">
                {journal.abstract}
              </p>
            </motion.div>

            {/* Read PDF CTA */}
            {journal.pdfUrl && (
              <motion.div
                custom={5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
                <a
                  href={journal.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-4 bg-text-primary text-background px-8 py-5 text-[13px] font-bold uppercase tracking-[0.15em] transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <FileText size={18} />
                  Open Full PDF Document
                  <ExternalLink
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 ml-2"
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
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-28">
              {/* Journal details card */}
              <div className="border border-border-subtle p-6 md:p-8 bg-surface">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent mb-6 flex items-center gap-3">
                  Document Details
                  <span className="h-px flex-1 bg-border-subtle" />
                </h4>
                <dl className="space-y-5 text-xs">
                  <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                    <dt className="text-text-secondary uppercase tracking-wider">Type</dt>
                    <dd className="text-text-primary font-medium text-right">{journal.type}</dd>
                  </div>
                  <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                    <dt className="text-text-secondary uppercase tracking-wider">Authors</dt>
                    <dd className="text-text-primary font-medium text-right">{journal.authors}</dd>
                  </div>
                  <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                    <dt className="text-text-secondary uppercase tracking-wider">Published</dt>
                    <dd className="text-text-primary font-medium">{journal.publishDate}</dd>
                  </div>
                  {journal.tags && journal.tags.length > 0 && (
                    <div className="flex justify-between items-center">
                      <dt className="text-text-secondary uppercase tracking-wider">Tags</dt>
                      <dd className="text-text-primary font-medium">{journal.tags.length}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* PDF card */}
              {journal.pdfUrl && (
                <a
                  href={journal.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-4 flex items-center justify-between border border-border-subtle p-5 bg-surface hover:bg-accent/5 hover:border-accent/30 transition-all"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">PDF Document</span>
                    <p className="text-[11px] text-text-secondary mt-0.5">Open in new tab</p>
                  </div>
                  <ExternalLink size={16} className="text-text-secondary group-hover:text-accent transition-colors" />
                </a>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
