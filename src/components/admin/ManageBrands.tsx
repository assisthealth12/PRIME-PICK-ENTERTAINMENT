"use client";

import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase/config";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { Trash2, Plus, Loader2, Pencil, ExternalLink } from "lucide-react";
import Image from "next/image";
import { BrandFormModal, BrandData } from "@/components/admin/BrandFormModal";

export function ManageBrands() {
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandData | null>(null);

  const fetchBrands = async () => {
    try {
      // By order then createdAt
      const q = query(collection(db, "brands"), orderBy("order", "asc"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as BrandData[];
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openAddForm = () => {
    setEditingBrand(null);
    setShowForm(true);
  };

  const openEditForm = (brand: BrandData) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchBrands();
  };

  const handleDeleteBrand = async (id: string, logoPath?: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      await deleteDoc(doc(db, "brands", id));
      if (logoPath) {
        const imageRef = ref(storage, logoPath);
        await deleteObject(imageRef).catch(e => console.error("Error deleting logo", e));
      }
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete brand.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">Manage Brands</h1>
          <p className="text-gray-500 text-sm uppercase tracking-wider">Brand Collaborations & Endorsements</p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add Brand
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : brands.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 p-16 flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 font-bold uppercase tracking-widest mb-4">No brands found</p>
          <button
            onClick={openAddForm}
            className="text-black border-b-2 border-black pb-1 font-bold uppercase tracking-widest text-sm hover:text-gray-500 transition-colors"
          >
            Add your first brand
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div key={brand.id} className="border-2 border-black flex flex-col group bg-white">
              <div className="relative aspect-video w-full bg-gray-50 border-b-2 border-black p-4 flex items-center justify-center">
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  fill
                  className="object-contain p-4"
                />
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="mb-4">
                  <h3 className="font-bold uppercase tracking-widest text-lg line-clamp-1" title={brand.name}>
                    {brand.name}
                  </h3>
                  {brand.websiteUrl && (
                    <a 
                      href={brand.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-gray-500 hover:text-black uppercase tracking-wider flex items-center gap-1 mt-1"
                    >
                      <ExternalLink size={10} /> Visit Website
                    </a>
                  )}
                </div>

                <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openEditForm(brand)}
                    className="flex-1 bg-gray-100 hover:bg-black hover:text-white py-2 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand.id!, brand.logoPath)}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white py-2 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BrandFormModal
          brand={editingBrand}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
