"use client";

import { useState, useEffect, useRef } from "react";
import { db, storage } from "@/lib/firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { Trash2, Plus, Image as ImageIcon, Loader2, Pencil, X, Users } from "lucide-react";
import Image from "next/image";

interface DirectorData {
  id: string;
  name: string;
  bio: string;
  photoUrl: string;
  photoPath: string;
}

export default function DirectorsAdmin() {
  const [directors, setDirectors] = useState<DirectorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDirectors = async () => {
    try {
      const q = query(collection(db, "directors"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as DirectorData[];
      setDirectors(data);
    } catch (error) {
      console.error("Error fetching directors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectors();
  }, []);

  const resetForm = () => {
    setName("");
    setBio("");
    setPhotoFile(null);
    setExistingPhotoUrl("");
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (director: DirectorData) => {
    setEditingId(director.id);
    setName(director.name || "");
    setBio(director.bio || "");
    setExistingPhotoUrl(director.photoUrl || "");
    setPhotoFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let photoUrl = existingPhotoUrl;
      let photoPath = "";

      // Upload new photo if selected
      if (photoFile) {
        photoPath = `directors/${Date.now()}_${photoFile.name}`;
        const storageRef = ref(storage, photoPath);
        const uploadTask = await uploadBytesResumable(storageRef, photoFile);
        photoUrl = await getDownloadURL(uploadTask.ref);
      }

      const directorData: Record<string, unknown> = {
        name,
        bio,
        photoUrl,
      };

      if (photoPath) {
        directorData.photoPath = photoPath;
      }

      if (editingId) {
        // UPDATE
        await updateDoc(doc(db, "directors", editingId), directorData);
      } else {
        // ADD
        directorData.createdAt = serverTimestamp();
        if (!photoPath) directorData.photoPath = ""; // Ensure property exists
        await addDoc(collection(db, "directors"), directorData);
      }

      resetForm();
      setShowForm(false);
      await fetchDirectors();
    } catch (error) {
      console.error("Error saving director:", error);
      alert("Failed to save director.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDirector = async (id: string, photoPath: string) => {
    if (!confirm("Are you sure you want to delete this director?")) return;

    try {
      await deleteDoc(doc(db, "directors", id));
      if (photoPath) {
        const imageRef = ref(storage, photoPath);
        await deleteObject(imageRef).catch(e => console.error("Error deleting image", e));
      }
      await fetchDirectors();
    } catch (error) {
      console.error("Error deleting director:", error);
      alert("Failed to delete director.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
            <Users size={24} /> Directors
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
            {directors.length} director{directors.length !== 1 && "s"} listed
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add Director
        </button>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* MODAL FORM (Add / Edit)                */}
      {/* ═══════════════════════════════════════ */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { resetForm(); setShowForm(false); }} />

          <div className="relative bg-white border-2 border-black w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-10">
            <div className="sticky top-0 bg-white border-b-2 border-black p-5 flex items-center justify-between z-20">
              <h2 className="text-lg font-black uppercase tracking-widest">
                {editingId ? "Edit Director" : "Add New Director"}
              </h2>
              <button
                onClick={() => { resetForm(); setShowForm(false); }}
                className="p-1 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm focus:outline-none transition-colors"
                  placeholder="e.g. Veera Sai Eshwar"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Biography</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={4}
                  className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about the director..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">
                  Profile Photo {editingId && existingPhotoUrl && "(leave empty to keep current)"}
                </label>
                {editingId && existingPhotoUrl && !photoFile && (
                  <div className="mb-2 relative w-20 h-20 border border-gray-200 overflow-hidden rounded-full">
                    <Image src={existingPhotoUrl} alt="Current photo" fill className="object-cover" unoptimized />
                  </div>
                )}
                <div className="border-2 border-gray-300 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setPhotoFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon size={20} className="mb-1.5 text-gray-400" />
                  <p className="text-xs font-bold uppercase">{photoFile ? photoFile.name : "Click to upload"}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { resetForm(); setShowForm(false); }}
                  className="flex-1 border-2 border-black text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer"
                >
                  {isUploading ? <><Loader2 className="animate-spin" size={14} /> Saving...</> : editingId ? "Update" : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* DIRECTORS LIST                          */}
      {/* ═══════════════════════════════════════ */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-black" size={32} />
        </div>
      ) : directors.length === 0 ? (
        <div className="border-2 border-black border-dashed p-16 text-center">
          <Users size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">No directors added yet</p>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Add Director
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {directors.map(dir => (
            <div
              key={dir.id}
              className="border-2 border-black bg-white flex flex-col group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
            >
              <div className="flex items-start gap-4 p-5">
                <div className="relative w-20 h-20 rounded-full border-2 border-black overflow-hidden bg-gray-100 shrink-0">
                  {dir.photoUrl ? (
                    <Image
                      src={dir.photoUrl}
                      alt={dir.name || "Director"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-3xl uppercase text-gray-300">
                      {dir.name ? dir.name.charAt(0) : "?"}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg uppercase tracking-wider truncate mb-1">
                    {dir.name || "Unknown"}
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 line-clamp-2">
                    {dir.bio || "No biography provided."}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => openEditForm(dir)}
                      className="p-1.5 border border-gray-200 hover:border-black transition-colors text-gray-500 hover:text-black cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteDirector(dir.id, dir.photoPath)}
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
