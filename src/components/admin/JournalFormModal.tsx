"use client";

import { useState, useRef, useEffect } from "react";
import { db, storage } from "@/lib/firebase/config";
import { doc, addDoc, updateDoc, collection, serverTimestamp, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader2, X, Image as ImageIcon, FileText } from "lucide-react";
import Image from "next/image";

export interface JournalData {
  id?: string;
  title: string;
  type: string;
  authors: string;
  publishDate: string;
  coverImage: string;
  coverPath?: string;
  abstract: string;
  tags: string[];
  pdfUrl: string;
  pdfPath?: string;
  pdfName?: string;
  createdAt?: any;
}

interface JournalFormModalProps {
  journal?: JournalData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function JournalFormModal({ journal, onClose, onSuccess }: JournalFormModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [title, setTitle] = useState(journal?.title || "");
  const [type, setType] = useState(journal?.type || "");
  const [authors, setAuthors] = useState(journal?.authors || "");
  const [publishDate, setPublishDate] = useState(journal?.publishDate || new Date().toISOString().split('T')[0]);
  const [abstract, setAbstract] = useState(journal?.abstract || "");
  const [tagsStr, setTagsStr] = useState(journal?.tags ? journal.tags.join(", ") : "");
  
  // Settings Data
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

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

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const existingCoverUrl = journal?.coverImage || "";

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const existingPdfUrl = journal?.pdfUrl || "";
  const existingPdfName = journal?.pdfName || "";

  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsUploading(true);

    try {
      // Validate PDF file size if a new one is selected
      if (pdfFile) {
        const fileSizeMB = pdfFile.size / (1024 * 1024);
        if (fileSizeMB > 2) {
          setErrorMsg("PDF file must be less than 2MB.");
          setIsUploading(false);
          return;
        }
      }

      if (!pdfFile && !existingPdfUrl) {
         setErrorMsg("A PDF file is required.");
         setIsUploading(false);
         return;
      }

      let coverUrl = existingCoverUrl;
      let coverPath = journal?.coverPath || "";

      // Upload new cover image
      if (coverFile) {
        coverPath = `journals/covers/${Date.now()}_${coverFile.name}`;
        const storageRef = ref(storage, coverPath);
        const uploadTask = await uploadBytesResumable(storageRef, coverFile);
        coverUrl = await getDownloadURL(uploadTask.ref);
      }

      let pdfUrl = existingPdfUrl;
      let pdfPath = journal?.pdfPath || "";
      let pdfName = existingPdfName;

      // Upload new PDF
      if (pdfFile) {
        pdfPath = `journals/pdfs/${Date.now()}_${pdfFile.name}`;
        pdfName = pdfFile.name;
        const storageRef = ref(storage, pdfPath);
        const uploadTask = await uploadBytesResumable(storageRef, pdfFile);
        pdfUrl = await getDownloadURL(uploadTask.ref);
      }

      const tagsArray = tagsStr.split(",").map(c => c.trim()).filter(c => c !== "");

      const journalData: Record<string, unknown> = {
        title,
        type,
        authors,
        publishDate,
        abstract,
        tags: tagsArray,
        coverImage: coverUrl,
        coverPath,
        pdfUrl,
        pdfPath,
        pdfName
      };

      if (journal?.id) {
        // UPDATE existing journal
        await updateDoc(doc(db, "journals", journal.id), journalData);
      } else {
        // ADD new journal
        journalData.createdAt = serverTimestamp();
        await addDoc(collection(db, "journals"), journalData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving journal:", error);
      setErrorMsg("Failed to save journal.");
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
            {journal?.id ? "Edit Journal" : "Add New Journal"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 border-b-2 border-red-200 p-3 text-xs font-bold uppercase text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Journal Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors" placeholder="e.g. Audience Response Analysis" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Journal Type *</label>
              <select value={type} onChange={e => setType(e.target.value)} required className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none bg-white">
                <option value="">Select a type...</option>
                {Array.from(new Set([...availableTypes, type].filter(Boolean))).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Author(s) *</label>
              <input type="text" value={authors} onChange={e => setAuthors(e.target.value)} required className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors" placeholder="e.g. Editorial Team" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Publication Date *</label>
              <input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} required className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Abstract / Summary * (100-300 words)</label>
            <textarea value={abstract} onChange={e => setAbstract(e.target.value)} required rows={4} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none resize-none" placeholder="Briefly summarize the journal..." />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Tags / Keywords (comma separated)</label>
            <div className="mb-2 flex flex-wrap gap-1">
              {availableTags.map(tag => (
                <button 
                  key={tag} 
                  type="button" 
                  onClick={() => setTagsStr(prev => prev ? `${prev}, ${tag}` : tag)}
                  className="text-[10px] bg-gray-100 hover:bg-gray-200 border border-gray-300 px-2 py-1 uppercase tracking-wider"
                >
                  + {tag}
                </button>
              ))}
            </div>
            <input type="text" value={tagsStr} onChange={e => setTagsStr(e.target.value)} className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none" placeholder="e.g. Storytelling, Film Analysis" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cover Upload */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">
                Cover Image (4:5 Ratio, e.g. 1080x1350px) {journal?.id && existingCoverUrl && "(leave empty to keep)"}
              </label>
              {journal?.id && existingCoverUrl && !coverFile && (
                <div className="mb-2 relative w-full h-24 border border-gray-200 overflow-hidden bg-gray-100">
                  <Image src={existingCoverUrl} alt="Cover" fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="border-2 border-gray-300 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black transition-colors relative h-24 bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={e => { if (e.target.files?.[0]) setCoverFile(e.target.files[0]); }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required={!existingCoverUrl && !coverFile}
                />
                <ImageIcon size={20} className="mb-1.5 text-gray-400" />
                <p className="text-[10px] font-bold uppercase px-2 truncate w-full">{coverFile ? coverFile.name : "Upload Cover Graphic"}</p>
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">
                PDF Document (Max 2MB) {journal?.id && existingPdfUrl && "(leave empty to keep)"}
              </label>
              {journal?.id && existingPdfUrl && !pdfFile && (
                <div className="mb-2 p-2 border border-gray-200 bg-gray-50 flex items-center gap-2 text-xs truncate">
                  <FileText size={16} className="text-gray-400 shrink-0" />
                  <a href={existingPdfUrl} target="_blank" rel="noreferrer" className="hover:underline truncate">{existingPdfName || "Current PDF"}</a>
                </div>
              )}
              <div className="border-2 border-gray-300 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-black transition-colors relative h-24 bg-gray-50">
                <input
                  type="file"
                  accept="application/pdf"
                  ref={pdfInputRef}
                  onChange={e => { if (e.target.files?.[0]) setPdfFile(e.target.files[0]); }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required={!existingPdfUrl && !pdfFile}
                />
                <FileText size={20} className={`mb-1.5 ${pdfFile && pdfFile.size > 2 * 1024 * 1024 ? "text-red-500" : "text-gray-400"}`} />
                <p className={`text-[10px] font-bold uppercase px-2 truncate w-full ${pdfFile && pdfFile.size > 2 * 1024 * 1024 ? "text-red-500" : ""}`}>
                  {pdfFile ? pdfFile.name : "Upload PDF (< 2MB)"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t-2 border-black">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-black text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isUploading} className="flex-1 bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer">
              {isUploading ? <><Loader2 className="animate-spin" size={14} /> Saving...</> : journal?.id ? "Update Journal" : "Publish Journal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
