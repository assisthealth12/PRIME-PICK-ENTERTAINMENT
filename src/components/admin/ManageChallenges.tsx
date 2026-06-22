"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Plus, Trash2, Loader2, ChevronDown, ChevronRight, Pencil, Check, X } from "lucide-react";

export interface ChallengeSeriesSetting {
  name: string;
  seasons: string[];
}

export function ManageChallenges() {
  const [seriesList, setSeriesList] = useState<ChallengeSeriesSetting[]>([]);
  const [newSeriesName, setNewSeriesName] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedSeries, setExpandedSeries] = useState<string | null>(null);
  const [newSeasonNames, setNewSeasonNames] = useState<Record<string, string>>({});

  // Edit state for series name
  const [editingSeriesIdx, setEditingSeriesIdx] = useState<number | null>(null);
  const [editingSeriesValue, setEditingSeriesValue] = useState("");

  // Edit state for season name
  const [editingSeason, setEditingSeason] = useState<{ seriesIdx: number; seasonIdx: number } | null>(null);
  const [editingSeasonValue, setEditingSeasonValue] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "challenges");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().series) {
          setSeriesList(docSnap.data().series);
        }
      } catch (error) {
        console.error("Error fetching challenge settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveToDb = async (updatedSeries: ChallengeSeriesSetting[]) => {
    try {
      await setDoc(doc(db, "settings", "challenges"), { series: updatedSeries }, { merge: true });
    } catch (error) {
      console.error("Error saving challenge settings:", error);
      alert("Failed to save settings.");
    }
  };

  const handleAddSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSeriesName.trim();
    if (trimmed) {
      const exists = seriesList.some(s => s.name.toLowerCase() === trimmed.toLowerCase());
      if (!exists) {
        const updated = [...seriesList, { name: trimmed, seasons: [] }];
        setSeriesList(updated);
        setNewSeriesName("");
        await saveToDb(updated);
      } else {
        alert("This Challenge Series is already added!");
      }
    }
  };

  const handleRemoveSeries = async (nameToRemove: string) => {
    if (!confirm("Are you sure you want to delete this series?")) return;
    const updated = seriesList.filter(s => s.name !== nameToRemove);
    setSeriesList(updated);
    if (expandedSeries === nameToRemove) setExpandedSeries(null);
    await saveToDb(updated);
  };

  const handleAddSeason = async (seriesName: string, e: React.FormEvent) => {
    e.preventDefault();
    const newSeason = newSeasonNames[seriesName]?.trim();
    if (!newSeason) return;

    const updated = seriesList.map(series => {
      if (series.name === seriesName) {
        const seasonExists = series.seasons.some(s => s.toLowerCase() === newSeason.toLowerCase());
        if (!seasonExists) {
          return { ...series, seasons: [...series.seasons, newSeason] };
        } else {
          alert("This season already exists for this series!");
        }
      }
      return series;
    });

    setSeriesList(updated);
    setNewSeasonNames(prev => ({ ...prev, [seriesName]: "" }));
    await saveToDb(updated);
  };

  const handleRemoveSeason = async (seriesName: string, seasonToRemove: string) => {
    const updated = seriesList.map(series => {
      if (series.name === seriesName) {
        return { ...series, seasons: series.seasons.filter(s => s !== seasonToRemove) };
      }
      return series;
    });
    setSeriesList(updated);
    await saveToDb(updated);
  };

  // ── Edit Series Name ──
  const startEditSeries = (idx: number) => {
    setEditingSeriesIdx(idx);
    setEditingSeriesValue(seriesList[idx].name);
  };

  const cancelEditSeries = () => {
    setEditingSeriesIdx(null);
    setEditingSeriesValue("");
  };

  const saveEditSeries = async (idx: number) => {
    const trimmed = editingSeriesValue.trim();
    if (!trimmed) return;
    const duplicate = seriesList.some((s, i) => i !== idx && s.name.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) { alert("This series name already exists!"); return; }
    const oldName = seriesList[idx].name;
    const updated = [...seriesList];
    updated[idx] = { ...updated[idx], name: trimmed };
    setSeriesList(updated);
    if (expandedSeries === oldName) setExpandedSeries(trimmed);
    setEditingSeriesIdx(null);
    setEditingSeriesValue("");
    await saveToDb(updated);
  };

  // ── Edit Season Name ──
  const startEditSeason = (seriesIdx: number, seasonIdx: number) => {
    setEditingSeason({ seriesIdx, seasonIdx });
    setEditingSeasonValue(seriesList[seriesIdx].seasons[seasonIdx]);
  };

  const cancelEditSeason = () => {
    setEditingSeason(null);
    setEditingSeasonValue("");
  };

  const saveEditSeason = async () => {
    if (!editingSeason) return;
    const trimmed = editingSeasonValue.trim();
    if (!trimmed) return;
    const { seriesIdx, seasonIdx } = editingSeason;
    const series = seriesList[seriesIdx];
    const duplicate = series.seasons.some((s, i) => i !== seasonIdx && s.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) { alert("This season already exists!"); return; }
    const updatedSeasons = [...series.seasons];
    updatedSeasons[seasonIdx] = trimmed;
    const updated = [...seriesList];
    updated[seriesIdx] = { ...series, seasons: updatedSeasons };
    setSeriesList(updated);
    setEditingSeason(null);
    setEditingSeasonValue("");
    await saveToDb(updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin text-black" size={24} />
      </div>
    );
  }

  return (
    <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
      <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-200 pb-3 mb-4">
        Challenge Series
      </h2>
      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
        Create Challenge Series names and add seasons to them. These will appear when creating a new Challenge Event.
      </p>

      {/* Add Series Form */}
      <form onSubmit={handleAddSeries} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newSeriesName}
          onChange={(e) => setNewSeriesName(e.target.value)}
          placeholder="New Series Name (e.g. 72 Hour Challenge)"
          className="flex-1 border-2 border-gray-300 focus:border-black p-2.5 text-sm outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!newSeriesName.trim()}
          className="bg-black text-white px-4 py-2.5 flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Plus size={20} />
        </button>
      </form>

      {/* List of Series */}
      {seriesList.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-200">
          No challenge series added yet.
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto pr-2">
          {seriesList.map((series, idx) => {
            const isExpanded = expandedSeries === series.name;
            return (
              <div key={idx} className="border-2 border-gray-200 bg-gray-50 flex flex-col">
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedSeries(isExpanded ? null : series.name)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    {editingSeriesIdx === idx ? (
                      <form onSubmit={(e) => { e.preventDefault(); saveEditSeries(idx); }} className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingSeriesValue}
                          onChange={(e) => setEditingSeriesValue(e.target.value)}
                          className="flex-1 border-2 border-black p-1 text-sm outline-none"
                          autoFocus
                        />
                        <button type="submit" className="text-green-600 hover:text-green-800 transition-colors cursor-pointer" title="Save">
                          <Check size={16} />
                        </button>
                        <button type="button" onClick={cancelEditSeries} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" title="Cancel">
                          <X size={16} />
                        </button>
                      </form>
                    ) : (
                      <span className="font-bold text-sm uppercase tracking-wider">{series.name}</span>
                    )}
                  </div>
                  {editingSeriesIdx !== idx && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); startEditSeries(idx); }}
                        className="text-gray-400 hover:text-black transition-colors p-1 cursor-pointer"
                        title="Edit Series Name"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveSeries(series.name); }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Remove Series"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Seasons List (Expanded State) */}
                {isExpanded && (
                  <div className="p-3 pt-0 border-t-2 border-gray-200 bg-white">
                    <div className="mt-3 mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Seasons</span>
                    </div>
                    
                    {series.seasons.length > 0 ? (
                      <ul className="space-y-2 mb-3">
                        {series.seasons.map((season, sIdx) => (
                          <li key={sIdx} className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2 text-xs">
                            {editingSeason?.seriesIdx === idx && editingSeason?.seasonIdx === sIdx ? (
                              <form onSubmit={(e) => { e.preventDefault(); saveEditSeason(); }} className="flex items-center gap-2 flex-1 mr-2">
                                <input
                                  type="text"
                                  value={editingSeasonValue}
                                  onChange={(e) => setEditingSeasonValue(e.target.value)}
                                  className="flex-1 border-2 border-black p-1 text-xs outline-none"
                                  autoFocus
                                />
                                <button type="submit" className="text-green-600 hover:text-green-800 transition-colors cursor-pointer" title="Save">
                                  <Check size={14} />
                                </button>
                                <button type="button" onClick={cancelEditSeason} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" title="Cancel">
                                  <X size={14} />
                                </button>
                              </form>
                            ) : (
                              <>
                                <span className="uppercase tracking-wider font-semibold">{season}</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => startEditSeason(idx, sIdx)}
                                    className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                                    title="Edit Season"
                                  >
                                    <Pencil size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveSeason(series.name, season)}
                                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Remove Season"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-xs text-gray-400 italic mb-3">No seasons added.</div>
                    )}

                    <form onSubmit={(e) => handleAddSeason(series.name, e)} className="flex gap-2">
                      <input
                        type="text"
                        value={newSeasonNames[series.name] || ""}
                        onChange={(e) => setNewSeasonNames(prev => ({ ...prev, [series.name]: e.target.value }))}
                        placeholder="Add Season (e.g. Season 1)"
                        className="flex-1 border-2 border-gray-300 focus:border-black p-1.5 text-xs outline-none transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={!newSeasonNames[series.name]?.trim()}
                        className="bg-gray-200 text-black px-2 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Plus size={16} />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
