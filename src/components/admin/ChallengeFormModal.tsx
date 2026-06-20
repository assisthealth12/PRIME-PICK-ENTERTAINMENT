"use client";

import { useState, useRef, useEffect } from "react";
import { db, storage } from "@/lib/firebase/config";
import { doc, addDoc, updateDoc, collection, serverTimestamp, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader2, X, Image as ImageIcon, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { ChallengeSeriesSetting } from "./ManageChallenges";

export interface ChallengeFilm {
  id: string;
  title: string;
  directorName: string;
  cast: string[];
  youtubeLink: string;
  videoType: string;
  synopsis: string;
  genre: string;
  language: string;
  runtime: string;
  year: number;
  releaseDate: string;
  posterUrl: string;
  posterPath: string;
  posterFile?: File | null;
  castStr?: string; // Transient field for form input
}

export interface ChallengeData {
  id?: string;
  seriesName: string;
  season: string;
  description: string;
  coverUrl: string;
  coverPath: string;
  films: ChallengeFilm[];
  visibility?: string;
  createdAt?: any;
}

interface ChallengeFormModalProps {
  challenge?: ChallengeData | null;
  onClose: () => void;
  onSuccess: () => void;
}

const emptyFilm = (): ChallengeFilm => ({
  id: Date.now().toString(),
  title: "",
  directorName: "",
  cast: [],
  youtubeLink: "",
  videoType: "Short Film",
  synopsis: "",
  genre: "",
  language: "",
  runtime: "",
  year: new Date().getFullYear(),
  releaseDate: "",
  posterUrl: "",
  posterPath: "",
  posterFile: null,
  castStr: "",
});

export function ChallengeFormModal({ challenge, onClose, onSuccess }: ChallengeFormModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [availableSeries, setAvailableSeries] = useState<ChallengeSeriesSetting[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  // Challenge Level State
  const [seriesName, setSeriesName] = useState(challenge?.seriesName || "");
  const [season, setSeason] = useState(challenge?.season || "");
  const [description, setDescription] = useState(challenge?.description || "");
  const [visibility, setVisibility] = useState(challenge?.visibility || "Publish");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const existingCoverUrl = challenge?.coverUrl || "";
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Track which film cards are expanded
  const [expandedFilms, setExpandedFilms] = useState<Record<string, boolean>>({});

  // Films State
  const [films, setFilms] = useState<ChallengeFilm[]>(
    challenge?.films?.map(f => ({ ...f, castStr: f.cast?.join(", ") || "" })) || [emptyFilm()]
  );

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [challengeSnap, generalSnap] = await Promise.all([
          getDoc(doc(db, "settings", "challenges")),
          getDoc(doc(db, "settings", "general")),
        ]);
        if (challengeSnap.exists() && challengeSnap.data().series) {
          setAvailableSeries(challengeSnap.data().series);
        }
        if (generalSnap.exists() && generalSnap.data().languages) {
          setAvailableLanguages(generalSnap.data().languages);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleAddFilm = () => {
    const newFilm = emptyFilm();
    setFilms([...films, newFilm]);
    setExpandedFilms(prev => ({ ...prev, [newFilm.id]: true }));
  };

  const handleRemoveFilm = (idToRemove: string) => {
    if (films.length === 1) {
      alert("You must have at least one film.");
      return;
    }
    setFilms(films.filter(f => f.id !== idToRemove));
  };

  const updateFilm = (id: string, field: keyof ChallengeFilm, value: any) => {
    setFilms(films.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const toggleFilmExpand = (id: string) => {
    setExpandedFilms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seriesName || !season) {
      alert("Please select a Series Name and Season.");
      return;
    }
    setIsUploading(true);

    try {
      // 1. Upload Challenge Cover
      let finalCoverUrl = existingCoverUrl;
      let finalCoverPath = challenge?.coverPath || "";

      if (coverFile) {
        finalCoverPath = `challenges/covers/${Date.now()}_${coverFile.name}`;
        const storageRef = ref(storage, finalCoverPath);
        const uploadTask = await uploadBytesResumable(storageRef, coverFile);
        finalCoverUrl = await getDownloadURL(uploadTask.ref);
      }

      // 2. Upload Film Posters
      const finalFilms: Omit<ChallengeFilm, 'posterFile' | 'castStr'>[] = [];
      for (const film of films) {
        let posterUrl = film.posterUrl;
        let posterPath = film.posterPath;

        if (film.posterFile) {
          posterPath = `challenges/posters/${Date.now()}_${film.posterFile.name}`;
          const storageRef = ref(storage, posterPath);
          const uploadTask = await uploadBytesResumable(storageRef, film.posterFile);
          posterUrl = await getDownloadURL(uploadTask.ref);
        }

        const castArray = (film.castStr || "").split(",").map(c => c.trim()).filter(c => c !== "");

        finalFilms.push({
          id: film.id,
          title: film.title,
          directorName: film.directorName,
          cast: castArray,
          youtubeLink: film.youtubeLink,
          videoType: film.videoType,
          synopsis: film.synopsis,
          genre: film.genre,
          language: film.language,
          runtime: film.runtime,
          year: Number(film.year),
          releaseDate: film.releaseDate,
          posterUrl,
          posterPath
        });
      }

      const challengeData: Record<string, unknown> = {
        seriesName,
        season,
        description,
        visibility,
        coverUrl: finalCoverUrl,
        coverPath: finalCoverPath,
        films: finalFilms
      };

      if (challenge?.id) {
        await updateDoc(doc(db, "challenges", challenge.id), challengeData);
      } else {
        challengeData.createdAt = serverTimestamp();
        await addDoc(collection(db, "challenges"), challengeData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving challenge:", error);
      alert("Failed to save challenge event.");
    } finally {
      setIsUploading(false);
    }
  };

  const selectedSeries = availableSeries.find(s => s.name === seriesName);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white border-2 border-black w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10">
        <div className="sticky top-0 bg-white border-b-2 border-black p-5 flex items-center justify-between z-20">
          <h2 className="text-lg font-black uppercase tracking-widest">
            {challenge?.id ? "Edit Challenge Event" : "Create Challenge Event"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-8">
          
          {/* Challenge Series Details */}
          <div className="space-y-4 border-2 border-black p-4 bg-gray-50">
            <h3 className="font-bold uppercase tracking-widest border-b-2 border-gray-200 pb-2">Challenge Event Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Series Name *</label>
                <select value={seriesName} onChange={e => { setSeriesName(e.target.value); setSeason(""); }} required className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none bg-white">
                  <option value="">Select Series...</option>
                  {availableSeries.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Season *</label>
                <select value={season} onChange={e => setSeason(e.target.value)} required disabled={!seriesName} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none bg-white disabled:bg-gray-100">
                  <option value="">Select Season...</option>
                  {selectedSeries?.seasons.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Short Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none resize-none" placeholder="Brief description of this specific event..." />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Visibility</label>
                <select value={visibility} onChange={e => setVisibility(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none font-bold">
                  <option value="Publish">Publish</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Event Cover Image */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">
                Challenge Cover Image {challenge?.id && existingCoverUrl && "(leave empty to keep current)"}
              </label>
              {challenge?.id && existingCoverUrl && !coverFile && (
                <div className="mb-2 relative w-40 h-20 border border-gray-200 overflow-hidden rounded bg-black">
                  <Image src={existingCoverUrl} alt="Current cover" fill sizes="160px" className="object-contain" />
                </div>
              )}
              <div className="border-2 border-gray-300 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black transition-colors relative bg-white">
                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setCoverFile(e.target.files[0]);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <ImageIcon size={20} className="mb-1.5 text-gray-400" />
                <p className="text-xs font-bold uppercase">{coverFile ? coverFile.name : "Click to upload challenge cover (Landscape)"}</p>
              </div>
            </div>
          </div>

          {/* Films Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-bold uppercase tracking-widest">Submitted Films</h3>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{films.length} Film{films.length !== 1 && "s"}</span>
            </div>
            
            {films.map((film, index) => {
              const isExpanded = expandedFilms[film.id] !== false; // Default expanded for first film or new
              return (
                <div key={film.id} className="relative border-2 border-gray-300 bg-white shadow-sm transition-all hover:border-black">
                  {/* Film Header (always visible) */}
                  <div 
                    className="flex items-center gap-3 p-4 cursor-pointer select-none"
                    onClick={() => toggleFilmExpand(film.id)}
                  >
                    <div className="bg-black text-white w-6 h-6 flex items-center justify-center font-bold text-xs shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-sm uppercase tracking-wider truncate block">
                        {film.title || "Untitled Film"}
                      </span>
                      {film.directorName && (
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Dir. {film.directorName}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveFilm(film.id); }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove Film"
                      >
                        <Trash2 size={16} />
                      </button>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded Film Form */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4 space-y-4">
                      {/* Row 1: Title, Director */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">Film Title *</label>
                          <input type="text" value={film.title} onChange={e => updateFilm(film.id, "title", e.target.value)} required className="w-full border border-gray-300 focus:border-black p-2 text-sm outline-none transition-colors" placeholder="e.g. I Met You" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">Director Name</label>
                          <input type="text" value={film.directorName} onChange={e => updateFilm(film.id, "directorName", e.target.value)} className="w-full border border-gray-300 focus:border-black p-2 text-sm outline-none transition-colors" placeholder="e.g. Veera Sai Eshwar" />
                        </div>
                      </div>

                      {/* Row 2: Genre, Language */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">Genre</label>
                          <input type="text" value={film.genre} onChange={e => updateFilm(film.id, "genre", e.target.value)} className="w-full border border-gray-300 focus:border-black p-2 text-sm outline-none transition-colors" placeholder="e.g. Drama, Thriller" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">Language</label>
                          <select value={film.language} onChange={e => updateFilm(film.id, "language", e.target.value)} className="w-full border border-gray-300 focus:border-black p-2 text-sm outline-none bg-white">
                            <option value="">Select language...</option>
                            {availableLanguages.map(lang => (
                              <option key={lang} value={lang}>{lang}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Row 3: YouTube Link, Video Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">YouTube Link *</label>
                          <input type="url" value={film.youtubeLink} onChange={e => updateFilm(film.id, "youtubeLink", e.target.value)} required className="w-full border border-gray-300 focus:border-black p-2 text-sm outline-none transition-colors" placeholder="https://youtube.com/..." />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">Video Type</label>
                          <select value={film.videoType} onChange={e => updateFilm(film.id, "videoType", e.target.value)} className="w-full border border-gray-300 focus:border-black p-2 text-sm outline-none bg-white font-bold">
                            <option value="Short Film">Short Film</option>
                            <option value="Feature Film">Feature Film</option>
                            <option value="Documentary">Documentary</option>
                            <option value="Music Video">Music Video</option>
                            <option value="Trailer">Trailer</option>
                            <option value="Web Series">Web Series</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 4: Meta (Year, Runtime, Release Date) */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-3 border border-gray-100">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">Year</label>
                          <input type="number" value={film.year} onChange={e => updateFilm(film.id, "year", e.target.value)} className="w-full border border-gray-300 focus:border-black p-1.5 text-sm outline-none" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">Runtime</label>
                          <input type="text" value={film.runtime} onChange={e => updateFilm(film.id, "runtime", e.target.value)} className="w-full border border-gray-300 focus:border-black p-1.5 text-sm outline-none" placeholder="e.g. 15 mins" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">Release Date</label>
                          <input type="date" value={film.releaseDate} onChange={e => updateFilm(film.id, "releaseDate", e.target.value)} className="w-full border border-gray-300 focus:border-black p-1.5 text-sm outline-none" />
                        </div>
                      </div>

                      {/* Row 5: Synopsis */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">Synopsis</label>
                        <textarea value={film.synopsis} onChange={e => updateFilm(film.id, "synopsis", e.target.value)} rows={2} className="w-full border border-gray-300 focus:border-black p-2 text-sm outline-none resize-none" placeholder="Brief synopsis of the film..." />
                      </div>

                      {/* Row 6: Cast */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">Cast (comma separated)</label>
                        <input type="text" value={film.castStr || ""} onChange={e => updateFilm(film.id, "castStr", e.target.value)} className="w-full border border-gray-300 focus:border-black p-2 text-sm outline-none" placeholder="e.g. Actor 1, Actor 2" />
                      </div>

                      {/* Row 7: Poster Upload */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-600">
                          Film Poster {film.posterUrl && "(leave empty to keep current)"}
                        </label>
                        {film.posterUrl && !film.posterFile && (
                          <div className="mb-2 relative w-16 h-24 border border-gray-200 overflow-hidden bg-gray-100">
                            <Image src={film.posterUrl} alt="Poster" fill sizes="64px" className="object-cover" />
                          </div>
                        )}
                        <div className="border border-gray-300 border-dashed p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black transition-colors relative bg-gray-50">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                              if (e.target.files && e.target.files[0]) {
                                updateFilm(film.id, "posterFile", e.target.files[0]);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <ImageIcon size={16} className="mb-1 text-gray-400" />
                          <p className="text-[10px] font-bold uppercase">{film.posterFile ? film.posterFile.name : "Upload Individual Poster"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddFilm}
              className="w-full border-2 border-dashed border-gray-300 text-gray-500 py-3 text-xs font-bold uppercase tracking-widest hover:border-black hover:text-black transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Another Film
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t-2 border-black sticky bottom-0 bg-white z-20 pb-5">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-black text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isUploading} className="flex-1 bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer">
              {isUploading ? <><Loader2 className="animate-spin" size={14} /> Saving Event...</> : challenge?.id ? "Update Challenge" : "Publish Challenge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
