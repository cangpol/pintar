"use client";

import { useState, useMemo } from "react";
import AspirationCard from "./AspirationCard";
import { Filter, ChevronDown, Trophy } from "lucide-react";
import { MOCK_ASPIRATIONS_DATA } from "@/lib/dummyData";

export default function AspirationFeed() {
  const [filterMode, setFilterMode] = useState<"semua" | "baru" | "seminggu" | "sebulan">("semua");
  const [viewMode, setViewMode] = useState<"aktif" | "arsip">("aktif");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAndRankedAspirations = useMemo(() => {
    let filtered = [...MOCK_ASPIRATIONS_DATA];
    
    // Time Filtering logic
    const now = new Date().getTime();
    if (filterMode === "baru") {
      filtered = filtered.filter(a => (now - new Date(a.createdAt).getTime()) <= 3 * 24 * 60 * 60 * 1000); // last 3 days
    } else if (filterMode === "seminggu") {
      filtered = filtered.filter(a => (now - new Date(a.createdAt).getTime()) <= 7 * 24 * 60 * 60 * 1000);
    } else if (filterMode === "sebulan") {
      filtered = filtered.filter(a => (now - new Date(a.createdAt).getTime()) <= 30 * 24 * 60 * 60 * 1000);
    }

    // View Mode Filtering
    if (viewMode === "aktif") {
      filtered = filtered.filter(a => a.status !== "Selesai" && a.status !== "Ditolak/Arsip");
    } else {
      filtered = filtered.filter(a => a.status === "Selesai" || a.status === "Ditolak/Arsip");
    }

    // Ranking Logic (Total = Urgensi only)
    // Only sort by urgensi if it's active. For Arsip, we can just leave it as is or sort by time.
    if (viewMode === "aktif") {
      filtered.sort((a, b) => b.urgensi - a.urgensi);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [filterMode, viewMode]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Sub-tabs for Aktif vs Arsip */}
      <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl self-start">
        <button 
          onClick={() => setViewMode("aktif")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "aktif" ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
        >
          Sedang Berjalan
        </button>
        <button 
          onClick={() => setViewMode("arsip")}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === "arsip" ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
        >
          Arsip (Selesai)
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 px-1">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${viewMode === 'aktif' ? 'bg-teal-50 border-teal-100 text-teal-600' : 'bg-slate-100 border-slate-200 text-slate-500'} flex items-center justify-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l2-9 5 18 2-9h5"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {viewMode === "aktif" ? "Aspirasi Terbaru" : "Arsip Aspirasi"}
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {viewMode === "aktif" ? "Diurutkan berdasarkan skor SPK (Tingkat Urgensi)" : "Laporan yang telah selesai ditindaklanjuti atau diarsipkan"}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
          >
            <Filter className="w-4 h-4" />
            {filterMode === "semua" ? "Filter Waktu" : filterMode === "baru" ? "Postingan Baru" : filterMode === "seminggu" ? "Seminggu Terakhir" : "Sebulan Terakhir"}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-20">
              {([
                { id: "semua", label: "Semua Waktu" },
                { id: "baru", label: "Postingan Baru" },
                { id: "seminggu", label: "Seminggu Terakhir" },
                { id: "sebulan", label: "Sebulan Terakhir" }
              ] as const).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { setFilterMode(opt.id); setIsFilterOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${filterMode === opt.id ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-6">
        {filteredAndRankedAspirations.map((aspiration, index) => {
          return (
            <div key={aspiration.id} className="relative">
              {/* Ranking Badge (Only for aktif) */}
              {viewMode === "aktif" && (
                <div className="absolute -top-3 -left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 text-xs font-black border-2 border-white dark:border-slate-900">
                  <Trophy className="w-3.5 h-3.5" />
                  TOP {index + 1} (Urgensi: {aspiration.urgensi})
                </div>
              )}
              
              <div className={viewMode === "aktif" ? "pt-2" : ""}>
                <AspirationCard {...aspiration} />
              </div>
            </div>
          );
        })}
        {filteredAndRankedAspirations.length === 0 && (
          <div className="text-center py-10 text-slate-500 font-bold bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            Tidak ada aspirasi pada daftar ini.
          </div>
        )}
      </div>
    </div>
  );
}
