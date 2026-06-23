"use client";

import { useState, useRef } from "react";
import { db, storage } from "@/lib/firebase/config";
import { doc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export interface BrandData {
  id?: string;
  name: string;
  websiteUrl: string;
  logoUrl: string;
  logoPath?: string;
  order?: number;
  createdAt?: any;
}

interface BrandFormModalProps {
  brand?: BrandData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BrandFormModal({ brand, onClose, onSuccess }: BrandFormModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState(brand?.name || "");
  const [websiteUrl, setWebsiteUrl] = useState(brand?.websiteUrl || "");
  const [order, setOrder] = useState<number>(brand?.order || 0);

  // Logo state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(brand?.logoUrl || "");

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<{ url: string, path: string }> => {
    const filePath = `${folder}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url: downloadURL, path: filePath });
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setErrorMsg("");

    try {
      let finalLogoUrl = brand?.logoUrl || "";
      let finalLogoPath = brand?.logoPath || "";

      if (logoFile) {
        const uploaded = await uploadFile(logoFile, "brands");
        finalLogoUrl = uploaded.url;
        finalLogoPath = uploaded.path;
      }

      if (!finalLogoUrl) {
        throw new Error("Logo image is required.");
      }

      const brandData = {
        name,
        websiteUrl,
        logoUrl: finalLogoUrl,
        logoPath: finalLogoPath,
        order: Number(order) || 0,
        updatedAt: serverTimestamp(),
      };

      if (brand?.id) {
        // Update existing
        await updateDoc(doc(db, "brands", brand.id), brandData);
      } else {
        // Create new
        await addDoc(collection(db, "brands"), {
          ...brandData,
          createdAt: serverTimestamp(),
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error saving brand:", error);
      setErrorMsg(error.message || "Failed to save brand");
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-black">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-widest">{brand ? 'Edit Brand' : 'New Brand'}</h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Brand Collaborations / Endorsements</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 transition-colors rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
              {errorMsg}
            </div>
          )}

          <form id="brandForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Logo Upload */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-gray-600">
                Brand Logo (PNG with transparent bg) *
              </label>
              <div 
                onClick={() => logoInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-colors relative min-h-[160px]"
              >
                {logoPreview ? (
                  <div className="relative w-full h-32 flex items-center justify-center">
                    {/* Since it's likely a transparent PNG, we use object-contain */}
                    <Image src={logoPreview} alt="Logo preview" fill className="object-contain" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-bold">Click to upload logo</span>
                    <span className="text-[10px] uppercase mt-1">Recommended: 400x200 max</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={logoInputRef} 
                  onChange={handleLogoChange} 
                  accept="image/png,image/svg+xml,image/webp" 
                  className="hidden" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Brand Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required
                  className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors"
                  placeholder="e.g. Sony"
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Website URL</label>
                <input 
                  type="url" 
                  value={websiteUrl} 
                  onChange={e => setWebsiteUrl(e.target.value)} 
                  className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-600">Display Order</label>
              <input 
                type="number" 
                value={order} 
                onChange={e => setOrder(Number(e.target.value))} 
                className="w-full border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors"
              />
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Lower numbers appear first</p>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black p-6 bg-gray-50 flex justify-end gap-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="brandForm"
            className="px-6 py-2.5 bg-black border-2 border-black text-white text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-black transition-colors flex items-center gap-2 disabled:opacity-50"
            disabled={isUploading}
          >
            {isUploading && <Loader2 size={14} className="animate-spin" />}
            {isUploading ? 'Saving...' : (brand ? 'Update Brand' : 'Add Brand')}
          </button>
        </div>
      </div>
    </div>
  );
}
