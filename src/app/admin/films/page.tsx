"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase/config";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { Trash2, Plus, Image as ImageIcon, Loader2, Pencil, ExternalLink, Film, Star, EyeOff, CalendarClock } from "lucide-react";
import Image from "next/image";
import { FilmFormModal } from "@/components/admin/FilmFormModal";

// Re-export interface if needed, or define here
interface FilmData {
  id: string;
  title: string;
  slug?: string;
  directorName: string;
  cast?: string[];
  youtubeLink: string;
  videoType: string;
  synopsis: string;
  posterUrl: string;
  posterPath?: string;
  status?: string;
  visibility?: string;
  featured?: boolean;
  runtime?: string;
  releaseDate?: string;
  genre?: string;
  language?: string;
  year?: number;
}

export default function FilmsAdmin() {
  const [films, setFilms] = useState<FilmData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFilm, setEditingFilm] = useState<FilmData | null>(null);

  const fetchFilms = async () => {
    try {
      const q = query(collection(db, "films"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const filmsData = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as FilmData[];
      setFilms(filmsData);
    } catch (error) {
      console.error("Error fetching films:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const openAddForm = () => {
    setEditingFilm(null);
    setShowForm(true);
  };

  const openEditForm = (film: FilmData) => {
    setEditingFilm(film);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchFilms();
  };

  const handleDeleteFilm = async (id: string, posterPath?: string) => {
    if (!confirm("Are you sure you want to delete this film?")) return;

    try {
      await deleteDoc(doc(db, "films", id));
      if (posterPath) {
        const imageRef = ref(storage, posterPath);
        await deleteObject(imageRef).catch(e => console.error("Error deleting image", e));
      }
      await fetchFilms();
    } catch (error) {
      console.error("Error deleting film:", error);
      alert("Failed to delete film.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
            <Film size={24} /> Films
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
            {films.length} film{films.length !== 1 && "s"} total
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add Film
        </button>
      </div>

      {showForm && (
        <FilmFormModal 
          film={editingFilm} 
          onClose={() => setShowForm(false)} 
          onSuccess={handleFormSuccess} 
        />
      )}

      {/* ═══════════════════════════════════════ */}
      {/* FILMS LIST                              */}
      {/* ═══════════════════════════════════════ */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-black" size={32} />
        </div>
      ) : films.length === 0 ? (
        <div className="border-2 border-black border-dashed p-16 text-center">
          <Film size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">No films added yet</p>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Add Your First Film
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {films.map(film => (
            <div
              key={film.id}
              className={`border-2 border-black bg-white flex flex-col sm:flex-row group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${film.visibility === 'Draft' ? 'opacity-70 grayscale-[50%]' : ''}`}
            >
              {/* Poster thumbnail */}
              <div className="relative w-full sm:w-28 h-40 sm:h-auto shrink-0 border-b-2 sm:border-b-0 sm:border-r-2 border-black overflow-hidden bg-gray-100">
                {film.posterUrl ? (
                  <Image
                    src={film.posterUrl}
                    alt={film.title || "Poster"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={24} />
                  </div>
                )}
                
                {/* Badges Overlay on Poster */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {film.featured && (
                    <div className="bg-[#D4AF37] text-white p-1 rounded-full shadow-lg" title="Featured">
                      <Star size={12} fill="currentColor" />
                    </div>
                  )}
                  {film.status === "Upcoming" && (
                    <div className="bg-black text-white p-1 rounded-full shadow-lg" title="Upcoming">
                      <CalendarClock size={12} />
                    </div>
                  )}
                  {film.visibility === "Draft" && (
                    <div className="bg-gray-500 text-white p-1 rounded-full shadow-lg" title="Draft">
                      <EyeOff size={12} />
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-lg uppercase tracking-wider truncate">
                      {film.title || "Untitled"}
                    </h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 border border-gray-200 px-2 py-0.5">
                      {film.status || "Released"}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 border border-gray-200 px-2 py-0.5">
                      {film.videoType || "Short"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                    {film.directorName && <span>Dir. {film.directorName}</span>}
                    {film.year && <span>• {film.year}</span>}
                    {film.runtime && <span>• {film.runtime}</span>}
                  </div>
                  {film.slug && (
                    <p className="text-[10px] text-gray-400 font-mono mb-1">/{film.slug}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {film.youtubeLink && (
                    <a
                      href={film.youtubeLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 border border-gray-200 hover:border-black transition-colors text-gray-500 hover:text-black"
                      title="Watch on YouTube"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button
                    onClick={() => openEditForm(film)}
                    className="p-2 border border-gray-200 hover:border-black transition-colors text-gray-500 hover:text-black cursor-pointer"
                    title="Edit Film"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteFilm(film.id, film.posterPath)}
                    className="p-2 border border-gray-200 hover:border-red-500 transition-colors text-gray-500 hover:text-red-500 cursor-pointer"
                    title="Delete Film"
                  >
                    <Trash2 size={16} />
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
