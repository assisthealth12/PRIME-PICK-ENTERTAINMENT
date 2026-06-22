"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase/config";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { Trash2, Plus, Loader2, Pencil, BookOpen, ExternalLink, CalendarClock } from "lucide-react";
import Image from "next/image";
import { JournalFormModal, JournalData } from "@/components/admin/JournalFormModal";

export function ManageJournals() {
  const [journals, setJournals] = useState<JournalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJournal, setEditingJournal] = useState<JournalData | null>(null);

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

  useEffect(() => {
    fetchJournals();
  }, []);

  const openAddForm = () => {
    setEditingJournal(null);
    setShowForm(true);
  };

  const openEditForm = (journal: JournalData) => {
    setEditingJournal(journal);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchJournals();
  };

  const handleDeleteJournal = async (id: string, coverPath?: string, pdfPath?: string) => {
    if (!confirm("Are you sure you want to delete this journal entry?")) return;

    try {
      await deleteDoc(doc(db, "journals", id));
      if (coverPath) {
        const imageRef = ref(storage, coverPath);
        await deleteObject(imageRef).catch(e => console.error("Error deleting cover", e));
      }
      if (pdfPath) {
        const pdfRef = ref(storage, pdfPath);
        await deleteObject(pdfRef).catch(e => console.error("Error deleting PDF", e));
      }
      await fetchJournals();
    } catch (error) {
      console.error("Error deleting journal:", error);
      alert("Failed to delete journal.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
            <BookOpen size={24} /> Research & Journals
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
            {journals.length} journal{journals.length !== 1 && "s"} total
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add Journal
        </button>
      </div>

      {showForm && (
        <JournalFormModal 
          journal={editingJournal} 
          onClose={() => setShowForm(false)} 
          onSuccess={handleFormSuccess} 
        />
      )}

      {/* ═══════════════════════════════════════ */}
      {/* JOURNALS LIST                           */}
      {/* ═══════════════════════════════════════ */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-black" size={32} />
        </div>
      ) : journals.length === 0 ? (
        <div className="border-2 border-black border-dashed p-16 text-center">
          <BookOpen size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">No journals published yet</p>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Publish First Journal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {journals.map(journal => (
            <div
              key={journal.id}
              className="border-2 border-black bg-white flex flex-col group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {/* Top info */}
              <div className="p-4 flex gap-4">
                {/* Cover thumbnail */}
                <div className="relative w-24 h-32 shrink-0 border-2 border-black overflow-hidden bg-gray-100">
                  {journal.coverImage && (
                    <Image
                      src={journal.coverImage}
                      alt={journal.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 inline-block mb-1">
                      {journal.type}
                    </span>
                    <h3 className="font-bold text-sm uppercase tracking-wider line-clamp-2">
                      {journal.title}
                    </h3>
                  </div>
                  
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest flex flex-col gap-1 mt-auto">
                    <span>By {journal.authors}</span>
                    <span className="flex items-center gap-1"><CalendarClock size={10} /> {journal.publishDate}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="border-t-2 border-gray-100 p-3 bg-gray-50 flex items-center justify-between">
                <div className="flex gap-1 overflow-x-auto no-scrollbar pr-2 max-w-[50%]">
                  {journal.tags?.map(t => (
                    <span key={t} className="text-[8px] bg-white border border-gray-200 px-1.5 py-0.5 whitespace-nowrap uppercase">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {journal.pdfUrl && (
                    <a
                      href={journal.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 border border-gray-200 bg-white hover:border-black transition-colors text-gray-500 hover:text-black"
                      title="View PDF"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    onClick={() => openEditForm(journal)}
                    className="p-1.5 border border-gray-200 bg-white hover:border-black transition-colors text-gray-500 hover:text-black cursor-pointer"
                    title="Edit Journal"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteJournal(journal.id!, journal.coverPath, journal.pdfPath)}
                    className="p-1.5 border border-gray-200 bg-white hover:border-red-500 transition-colors text-gray-500 hover:text-red-500 cursor-pointer"
                    title="Delete Journal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
