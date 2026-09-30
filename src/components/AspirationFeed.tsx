"use client";

import { useState, useMemo, useEffect } from "react";
import AspirationCard from "./AspirationCard";
import { Filter, ChevronDown, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { MOCK_ASPIRATIONS_DATA } from "@/lib/dummyData";

export default function AspirationFeed() {
  const [filterMode, setFilterMode] = useState<"semua" | "baru" | "seminggu" | "sebulan">("semua");
  const [viewMode, setViewMode] = useState<"aktif" | "arsip">("aktif");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const [aspirations, setAspirations] = useState<any[]>(MOCK_ASPIRATIONS_DATA);

  useEffect(() => {
    const stored = localStorage.getItem("pintar_aspirations");
    if (stored) {
      setAspirations(JSON.parse(stored));
    } else {
      localStorage.setItem("pintar_aspirations", JSON.stringify(MOCK_ASPIRATIONS_DATA));
    }
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterMode, viewMode]);

  const filteredAndRankedAspirations = useMemo(() => {
    let filtered = [...aspirations];
    
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
    if (viewMode === "aktif") {
      filtered.sort((a, b) => b.urgensi - a.urgensi);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [filterMode, viewMode]);

  const totalPages = Math.ceil(filteredAndRankedAspirations.length / itemsPerPage);
  const currentAspirations = filteredAndRankedAspirations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentAspirations.map((aspiration) => {
          return (
            <div key={aspiration.id} className="relative h-full flex">
              <div className="w-full">
                <AspirationCard {...aspiration} />
              </div>
            </div>
          );
        })}
        {filteredAndRankedAspirations.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500 font-bold bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            Tidak ada aspirasi pada daftar ini.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
            Halaman {currentPage} dari {totalPages}
          </div>
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
