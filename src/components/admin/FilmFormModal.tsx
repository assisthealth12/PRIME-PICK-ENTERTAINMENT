"use client";

import { useState, useRef, useEffect } from "react";
import { db, storage } from "@/lib/firebase/config";
import { doc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface FilmData {
  id?: string;
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

interface FilmFormModalProps {
  film?: FilmData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function FilmFormModal({ film, onClose, onSuccess }: FilmFormModalProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState(film?.title || "");
  const [slug, setSlug] = useState(film?.slug || "");
  const [directorName, setDirectorName] = useState(film?.directorName || "");
  const [castStr, setCastStr] = useState(film?.cast ? film.cast.join(", ") : "");
  const [youtubeLink, setYoutubeLink] = useState(film?.youtubeLink || "");
  const [videoType, setVideoType] = useState(film?.videoType || "Short Film");
  const [synopsis, setSynopsis] = useState(film?.synopsis || "");
  const [genre, setGenre] = useState(film?.genre || "");
  const [language, setLanguage] = useState(film?.language || "");
  const [runtime, setRuntime] = useState(film?.runtime || "");
  const [year, setYear] = useState<number | string>(film?.year || new Date().getFullYear());
  const [releaseDate, setReleaseDate] = useState(film?.releaseDate || "");
  const [status, setStatus] = useState(film?.status || "Released");
  const [visibility, setVisibility] = useState(film?.visibility || "Publish");
  const [featured, setFeatured] = useState(film?.featured || false);

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const existingPosterUrl = film?.posterUrl || "";

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (!film && title && !slug) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title, film, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let posterUrl = existingPosterUrl;
      let posterPath = film?.posterPath || "";

      // Upload new poster if selected
      if (posterFile) {
        posterPath = `films/${Date.now()}_${posterFile.name}`;
        const storageRef = ref(storage, posterPath);
        const uploadTask = await uploadBytesResumable(storageRef, posterFile);
        posterUrl = await getDownloadURL(uploadTask.ref);
      }

      const castArray = castStr.split(",").map(c => c.trim()).filter(c => c !== "");

      const filmData: Record<string, unknown> = {
        title,
        slug,
        directorName,
        cast: castArray,
        youtubeLink,
        videoType,
        synopsis,
        genre,
        language,
        runtime,
        year: Number(year),
        releaseDate,
        status,
        visibility,
        featured,
        posterUrl,
        posterPath
      };

      if (film?.id) {
        // UPDATE existing film
        await updateDoc(doc(db, "films", film.id), filmData);
      } else {
        // ADD new film
        filmData.createdAt = serverTimestamp();
        await addDoc(collection(db, "films"), filmData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving film:", error);
      alert("Failed to save film.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white border-2 border-black w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10">
        <div className="sticky top-0 bg-white border-b-2 border-black p-5 flex items-center justify-between z-20">
          <h2 className="text-lg font-black uppercase tracking-widest">
            {film?.id ? "Edit Film" : "Add New Film"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          
          {/* Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Film Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors" placeholder="e.g. I Met You" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Slug</label>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors" placeholder="e.g. i-met-you" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Director Name *</label>
              <input type="text" value={directorName} onChange={e => setDirectorName(e.target.value)} required className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors" placeholder="e.g. Veera Sai Eshwar" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Genre</label>
              <input type="text" value={genre} onChange={e => setGenre(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors" placeholder="e.g. Drama, Thriller" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Language</label>
              <input type="text" value={language} onChange={e => setLanguage(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors" placeholder="e.g. English" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">YouTube Link</label>
              <input type="url" value={youtubeLink} onChange={e => setYoutubeLink(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors" placeholder="https://youtube.com/..." />
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 border-2 border-gray-100">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Year</label>
              <input type="number" value={year} onChange={e => setYear(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Runtime</label>
              <input type="text" value={runtime} onChange={e => setRuntime(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2 text-sm outline-none" placeholder="e.g. 15 mins" />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Release Date</label>
              <input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2 text-sm outline-none" />
            </div>
          </div>

          {/* Business Rules / Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-l-4 border-accent pl-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none font-bold">
                <option value="Upcoming">Upcoming (Coming Soon)</option>
                <option value="Released">Released (Watch Now)</option>
                <option value="Archived">Archived (Hidden from main lists)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Visibility</label>
              <select value={visibility} onChange={e => setVisibility(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none font-bold">
                <option value="Publish">Publish</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Featured on Home</label>
              <select value={featured ? "true" : "false"} onChange={e => setFeatured(e.target.value === "true")} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none font-bold">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          {/* Long Text */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Synopsis</label>
            <textarea value={synopsis} onChange={e => setSynopsis(e.target.value)} rows={3} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none resize-none" />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Cast (comma separated)</label>
            <input type="text" value={castStr} onChange={e => setCastStr(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none" />
          </div>

          {/* Poster Upload */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">
              Movie Poster {film?.id && existingPosterUrl && "(leave empty to keep current)"}
            </label>
            {film?.id && existingPosterUrl && !posterFile && (
              <div className="mb-2 relative w-20 h-28 border border-gray-200 overflow-hidden rounded">
                <Image src={existingPosterUrl} alt="Current poster" fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="border-2 border-gray-300 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black transition-colors relative">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setPosterFile(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <ImageIcon size={20} className="mb-1.5 text-gray-400" />
              <p className="text-xs font-bold uppercase">{posterFile ? posterFile.name : "Click to upload poster image"}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t-2 border-black">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-black text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isUploading} className="flex-1 bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer">
              {isUploading ? <><Loader2 className="animate-spin" size={14} /> Saving...</> : film?.id ? "Update Film" : "Publish Film"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
