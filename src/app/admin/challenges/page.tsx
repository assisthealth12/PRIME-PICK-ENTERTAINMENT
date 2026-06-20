"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase/config";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { Trash2, Plus, Image as ImageIcon, Loader2, Pencil, Trophy } from "lucide-react";
import Image from "next/image";
import { ChallengeFormModal, ChallengeData } from "@/components/admin/ChallengeFormModal";

export default function ChallengesAdmin() {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<ChallengeData | null>(null);

  const fetchChallenges = async () => {
    try {
      const q = query(collection(db, "challenges"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as ChallengeData[];
      setChallenges(data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const openAddForm = () => {
    setEditingChallenge(null);
    setShowForm(true);
  };

  const openEditForm = (challenge: ChallengeData) => {
    setEditingChallenge(challenge);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchChallenges();
  };

  const handleDeleteChallenge = async (id: string, coverPath?: string, films?: ChallengeData["films"]) => {
    if (!confirm("Are you sure you want to delete this entire challenge event and all its films?")) return;

    try {
      await deleteDoc(doc(db, "challenges", id));
      
      // Delete Cover Image
      if (coverPath) {
        const imageRef = ref(storage, coverPath);
        await deleteObject(imageRef).catch(e => console.error("Error deleting cover image", e));
      }

      // Delete Film Posters
      if (films) {
        for (const film of films) {
          if (film.posterPath) {
            const posterRef = ref(storage, film.posterPath);
            await deleteObject(posterRef).catch(e => console.error("Error deleting poster", e));
          }
        }
      }

      await fetchChallenges();
    } catch (error) {
      console.error("Error deleting challenge:", error);
      alert("Failed to delete challenge.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-black">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
            <Trophy size={24} /> Challenges
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
            Manage Challenge Series and submitted films
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Create Challenge Event
        </button>
      </div>

      {showForm && (
        <ChallengeFormModal 
          challenge={editingChallenge} 
          onClose={() => setShowForm(false)} 
          onSuccess={handleFormSuccess} 
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-black" size={32} />
        </div>
      ) : challenges.length === 0 ? (
        <div className="border-2 border-black border-dashed p-16 text-center">
          <Trophy size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">No challenges created yet</p>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Create First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map(challenge => (
            <div
              key={challenge.id}
              className={`border-2 border-black bg-white flex flex-col group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${challenge.visibility === 'Draft' ? 'opacity-70 grayscale-[50%]' : ''}`}
            >
              <div className="relative w-full h-48 border-b-2 border-black overflow-hidden bg-black flex items-center justify-center">
                {challenge.coverUrl ? (
                  <Image
                    src={challenge.coverUrl}
                    alt={challenge.seriesName}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-80"
                  />
                ) : (
                  <ImageIcon size={32} className="text-gray-600" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <span className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">{challenge.season}</span>
                  <h3 className="text-white font-bold text-xl uppercase tracking-wider">{challenge.seriesName}</h3>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">{challenge.description || "No description provided."}</p>
                
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Submitted Films ({challenge.films?.length || 0})</span>
                  <div className="flex -space-x-2 overflow-hidden">
                    {challenge.films?.slice(0, 5).map((film, i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 overflow-hidden relative" title={film.title}>
                        {film.posterUrl ? (
                          <Image src={film.posterUrl} alt={film.title} fill sizes="32px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-[8px] font-bold">{film.title.charAt(0)}</div>
                        )}
                      </div>
                    ))}
                    {(challenge.films?.length || 0) > 5 && (
                      <div className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 text-[10px] font-bold text-gray-500">
                        +{(challenge.films?.length || 0) - 5}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                   <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${challenge.visibility === 'Draft' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                      {challenge.visibility || "Publish"}
                    </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditForm(challenge)}
                      className="p-1.5 border border-gray-200 hover:border-black transition-colors text-gray-500 hover:text-black cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteChallenge(challenge.id!, challenge.coverPath, challenge.films)}
                      className="p-1.5 border border-gray-200 hover:border-red-500 transition-colors text-gray-500 hover:text-red-500 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
