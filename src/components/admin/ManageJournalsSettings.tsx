"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Plus, Trash2, Loader2, Pencil, Check, X } from "lucide-react";

export function ManageJournalsSettings() {
  const [types, setTypes] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newType, setNewType] = useState("");
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingTypeIdx, setEditingTypeIdx] = useState<number | null>(null);
  const [editingTypeValue, setEditingTypeValue] = useState("");
  const [editingTagIdx, setEditingTagIdx] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "journals");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.types) setTypes(data.types);
          if (data.tags) setTags(data.tags);
        }
      } catch (error) {
        console.error("Error fetching journal settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveToDb = async (updatedTypes: string[], updatedTags: string[]) => {
    try {
      await setDoc(doc(db, "settings", "journals"), { types: updatedTypes, tags: updatedTags }, { merge: true });
    } catch (error) {
      console.error("Error saving journal settings:", error);
      alert("Failed to save settings.");
    }
  };

  // ── Types ──
  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newType.trim();
    if (trimmed) {
      const exists = types.some(t => t.toLowerCase() === trimmed.toLowerCase());
      if (!exists) {
        const updated = [...types, trimmed];
        setTypes(updated);
        setNewType("");
        await saveToDb(updated, tags);
      } else {
        alert("This type is already added!");
      }
    }
  };

  const handleRemoveType = async (typeToRemove: string) => {
    const updated = types.filter(t => t !== typeToRemove);
    setTypes(updated);
    await saveToDb(updated, tags);
  };

  const startEditType = (idx: number) => {
    setEditingTypeIdx(idx);
    setEditingTypeValue(types[idx]);
  };

  const cancelEditType = () => {
    setEditingTypeIdx(null);
    setEditingTypeValue("");
  };

  const saveEditType = async (idx: number) => {
    const trimmed = editingTypeValue.trim();
    if (!trimmed) return;
    const duplicate = types.some((t, i) => i !== idx && t.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) { alert("This type already exists!"); return; }
    const updated = [...types];
    updated[idx] = trimmed;
    setTypes(updated);
    setEditingTypeIdx(null);
    setEditingTypeValue("");
    await saveToDb(updated, tags);
  };

  // ── Tags ──
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTag.trim();
    if (trimmed) {
      const exists = tags.some(t => t.toLowerCase() === trimmed.toLowerCase());
      if (!exists) {
        const updated = [...tags, trimmed];
        setTags(updated);
        setNewTag("");
        await saveToDb(types, updated);
      } else {
        alert("This tag is already added!");
      }
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updated = tags.filter(t => t !== tagToRemove);
    setTags(updated);
    await saveToDb(types, updated);
  };

  const startEditTag = (idx: number) => {
    setEditingTagIdx(idx);
    setEditingTagValue(tags[idx]);
  };

  const cancelEditTag = () => {
    setEditingTagIdx(null);
    setEditingTagValue("");
  };

  const saveEditTag = async (idx: number) => {
    const trimmed = editingTagValue.trim();
    if (!trimmed) return;
    const duplicate = tags.some((t, i) => i !== idx && t.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) { alert("This tag already exists!"); return; }
    const updated = [...tags];
    updated[idx] = trimmed;
    setTags(updated);
    setEditingTagIdx(null);
    setEditingTagValue("");
    await saveToDb(types, updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin text-black" size={24} />
      </div>
    );
  }

  return (
    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {/* Types Panel */}
      <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-200 pb-3 mb-4">
          Journal Types
        </h2>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          Manage the dropdown options for &quot;Journal Type&quot; (e.g. Research Paper, Case Study).
        </p>

        <form onSubmit={handleAddType} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="e.g. Research Paper"
            className="flex-1 border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!newType.trim()}
            className="bg-black text-white px-4 py-2.5 flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </form>

        {types.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-200">
            No types added yet.
          </div>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {types.map((type, idx) => (
              <li key={idx} className="flex items-center justify-between border-2 border-gray-100 bg-gray-50 p-3 hover:border-black transition-colors">
                {editingTypeIdx === idx ? (
                  <form onSubmit={(e) => { e.preventDefault(); saveEditType(idx); }} className="flex items-center gap-2 flex-1 mr-2">
                    <input
                      type="text"
                      value={editingTypeValue}
                      onChange={(e) => setEditingTypeValue(e.target.value)}
                      className="flex-1 border-2 border-black p-1.5 text-sm outline-none"
                      autoFocus
                    />
                    <button type="submit" className="text-green-600 hover:text-green-800 transition-colors cursor-pointer" title="Save">
                      <Check size={16} />
                    </button>
                    <button type="button" onClick={cancelEditType} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" title="Cancel">
                      <X size={16} />
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="font-bold text-sm uppercase tracking-wider">{type}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditType(idx)}
                        className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                        title="Edit Type"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleRemoveType(type)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove Type"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tags Panel */}
      <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-200 pb-3 mb-4">
          Journal Tags
        </h2>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          Manage keywords/tags that can be assigned to journals (e.g. Storytelling).
        </p>

        <form onSubmit={handleAddTag} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="e.g. Storytelling"
            className="flex-1 border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!newTag.trim()}
            className="bg-black text-white px-4 py-2.5 flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </form>

        {tags.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-200">
            No tags added yet.
          </div>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {tags.map((tag, idx) => (
              <li key={idx} className="flex items-center justify-between border-2 border-gray-100 bg-gray-50 p-3 hover:border-black transition-colors">
                {editingTagIdx === idx ? (
                  <form onSubmit={(e) => { e.preventDefault(); saveEditTag(idx); }} className="flex items-center gap-2 flex-1 mr-2">
                    <input
                      type="text"
                      value={editingTagValue}
                      onChange={(e) => setEditingTagValue(e.target.value)}
                      className="flex-1 border-2 border-black p-1.5 text-sm outline-none"
                      autoFocus
                    />
                    <button type="submit" className="text-green-600 hover:text-green-800 transition-colors cursor-pointer" title="Save">
                      <Check size={16} />
                    </button>
                    <button type="button" onClick={cancelEditTag} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" title="Cancel">
                      <X size={16} />
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="font-bold text-sm uppercase tracking-wider">{tag}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditTag(idx)}
                        className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                        title="Edit Tag"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove Tag"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
