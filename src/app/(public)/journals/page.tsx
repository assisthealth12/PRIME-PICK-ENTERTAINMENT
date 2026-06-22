"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy, getDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { Search, Loader2, FileText, CalendarClock, BookOpen } from "lucide-react";
import { JournalData } from "@/components/admin/JournalFormModal";

export default function JournalsPage() {
  const [journals, setJournals] = useState<JournalData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Settings for filters
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  // Active filters
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
    <div className="min-h-screen bg-bg-primary pt-16 pb-32">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-black text-white rounded-full mb-6">
            <BookOpen size={28} strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-wider text-text-primary uppercase mb-6">
            Research & <span className="text-accent text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#D4AF37]">Journals</span>
          </h1>
          <p className="max-w-2xl mx-auto font-body text-text-secondary text-lg leading-relaxed">
            Explore our curated collection of research papers, thesis documents, audience analyses, and industry insights.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 bg-white shadow-sm p-5 border border-gray-200 rounded-lg space-y-4">
          {/* Search */}
          <div>
            <input 
              type="text" 
              placeholder="Search journals, authors, or topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded py-3 px-4 text-black text-center placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-colors font-body text-sm"
            />
          </div>
          {/* Dropdowns row */}
          <div style={{ display: "flex", gap: "16px" }}>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ flex: 1, minWidth: 0 }}
              className="bg-gray-50 border border-gray-300 rounded py-3 px-4 text-black text-sm focus:outline-none focus:border-black transition-colors cursor-pointer"
            >
              <option value="All">All Types</option>
              {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select 
              value={selectedTag} 
              onChange={(e) => setSelectedTag(e.target.value)}
              style={{ flex: 1, minWidth: 0 }}
              className="bg-gray-50 border border-gray-300 rounded py-3 px-4 text-black text-sm focus:outline-none focus:border-black transition-colors cursor-pointer"
            >
              <option value="All">All Tags</option>
              {availableTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-black" size={48} />
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="text-center py-20 border border-gray-200 rounded-lg bg-white shadow-sm">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
            <h3 className="font-heading text-xl text-black font-bold mb-2">No journals found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedType("All"); setSelectedTag("All"); }}
              className="mt-6 px-6 py-2 border border-black text-black rounded hover:bg-black hover:text-white transition-colors text-sm uppercase tracking-widest font-bold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Journals Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredJournals.map(journal => (
              <div 
                key={journal.id} 
                className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  {/* Cover */}
                  <div className="relative w-full sm:w-48 h-64 sm:h-auto shrink-0 bg-gray-100 overflow-hidden border-b sm:border-b-0 sm:border-r border-gray-200">
                    {journal.coverImage ? (
                      <Image 
                        src={journal.coverImage} 
                        alt={journal.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <BookOpen className="text-gray-300" size={40} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 shadow">
                        {journal.type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col h-full">
                    <h2 className="font-heading text-xl font-bold text-black leading-snug mb-3 group-hover:text-gray-700 transition-colors line-clamp-2">
                      {journal.title}
                    </h2>
                    
                    <div className="flex flex-col gap-1.5 mb-4 border-l-2 border-accent pl-3">
                      <p className="text-xs text-gray-500 font-medium">By <span className="text-black font-bold">{journal.authors}</span></p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                        <CalendarClock size={12} /> {journal.publishDate}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1 font-body leading-relaxed">
                      {journal.abstract}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[50%]">
                        {journal.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[9px] text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 uppercase tracking-wider whitespace-nowrap">
                            {tag}
                          </span>
                        ))}
                        {journal.tags && journal.tags.length > 2 && (
                          <span className="text-[9px] text-gray-500 bg-gray-100 border border-gray-200 px-2 py-1 uppercase tracking-wider whitespace-nowrap">
                            +{journal.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <a 
                        href={journal.pdfUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors rounded shrink-0"
                      >
                        <FileText size={14} /> View PDF
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
