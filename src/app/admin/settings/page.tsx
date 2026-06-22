"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Settings as SettingsIcon, Plus, Trash2, Loader2, Pencil, Check, X } from "lucide-react";
import { ManageChallenges } from "@/components/admin/ManageChallenges";
import { ManageJournalsSettings } from "@/components/admin/ManageJournalsSettings";

export default function SettingsAdmin() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingLangIdx, setEditingLangIdx] = useState<number | null>(null);
  const [editingLangValue, setEditingLangValue] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().languages) {
          setLanguages(docSnap.data().languages);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveLanguagesToDb = async (newLanguages: string[]) => {
    try {
      await setDoc(doc(db, "settings", "general"), { languages: newLanguages }, { merge: true });
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    }
  };

  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newLanguage.trim();
    if (trimmed) {
      const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      const exists = languages.some(lang => lang.toLowerCase() === capitalized.toLowerCase());
      if (!exists) {
        const updated = [...languages, capitalized];
        setLanguages(updated);
        setNewLanguage("");
        await saveLanguagesToDb(updated);
      } else {
        alert("This language is already added!");
        setNewLanguage("");
      }
    }
  };

  const handleRemoveLanguage = async (langToRemove: string) => {
    const updated = languages.filter(lang => lang !== langToRemove);
    setLanguages(updated);
    await saveLanguagesToDb(updated);
  };

  const startEditLanguage = (idx: number) => {
    setEditingLangIdx(idx);
    setEditingLangValue(languages[idx]);
  };

  const cancelEditLanguage = () => {
    setEditingLangIdx(null);
    setEditingLangValue("");
  };

  const saveEditLanguage = async (idx: number) => {
    const trimmed = editingLangValue.trim();
    if (!trimmed) return;
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    const duplicate = languages.some((lang, i) => i !== idx && lang.toLowerCase() === capitalized.toLowerCase());
    if (duplicate) {
      alert("This language already exists!");
      return;
    }
    const updated = [...languages];
    updated[idx] = capitalized;
    setLanguages(updated);
    setEditingLangIdx(null);
    setEditingLangValue("");
    await saveLanguagesToDb(updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
            <SettingsIcon size={24} /> Settings
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
            Manage global site configurations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Languages Panel */}
        <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-200 pb-3 mb-4">
            Manage Languages
          </h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Add languages here to make them available in the Add/Edit Film form dropdown.
          </p>

          <form onSubmit={handleAddLanguage} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="e.g. English"
              className="flex-1 border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!newLanguage.trim()}
              className="bg-black text-white px-4 py-2.5 flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Plus size={20} />
            </button>
          </form>

          {languages.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-200">
              No languages added yet.
            </div>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {languages.map((lang, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between border-2 border-gray-100 bg-gray-50 p-3 hover:border-black transition-colors"
                >
                  {editingLangIdx === idx ? (
                    <form onSubmit={(e) => { e.preventDefault(); saveEditLanguage(idx); }} className="flex items-center gap-2 flex-1 mr-2">
                      <input
                        type="text"
                        value={editingLangValue}
                        onChange={(e) => setEditingLangValue(e.target.value)}
                        className="flex-1 border-2 border-black p-1.5 text-sm outline-none"
                        autoFocus
                      />
                      <button type="submit" className="text-green-600 hover:text-green-800 transition-colors cursor-pointer" title="Save">
                        <Check size={16} />
                      </button>
                      <button type="button" onClick={cancelEditLanguage} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" title="Cancel">
                        <X size={16} />
                      </button>
                    </form>
                  ) : (
                    <>
                      <span className="font-bold text-sm uppercase tracking-wider">{lang}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditLanguage(idx)}
                          className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                          title="Edit Language"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleRemoveLanguage(lang)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove Language"
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

        {/* Challenges Panel */}
        <ManageChallenges />
      </div>

      <ManageJournalsSettings />
    </div>
  );
}
