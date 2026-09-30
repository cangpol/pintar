"use client";

import { useState, useMemo } from "react";
import AspirationCard, { AspirationCardProps, Comment } from "./AspirationCard";
import { Filter, ChevronDown, Trophy } from "lucide-react";

// Extended interface to include SPK variables
export interface RankedAspiration extends AspirationCardProps {
  jarak: number;
  urgensi: number;
  createdAt: string; // ISO date string for filtering
}

const MOCK_ASPIRATIONS: RankedAspiration[] = [
  {
    id: "1",
    title: "Perbaikan Jalan Berlubang di Jl. Merdeka",
    description: "Terdapat banyak lubang di sepanjang jalan Merdeka yang membahayakan pengendara motor, terutama saat hujan karena tertutup genangan air. Mohon segera diperbaiki.",
    author: "Budi Santoso",
    time: "2 jam yang lalu",
    category: "Infrastruktur",
    status: "Diproses",
    initialUpvotes: 124,
    comments: [
      { id: "c1", author: "Dinas PUPR", text: "Terima kasih laporannya. Tim kami sedang menuju ke lokasi.", time: "1 jam yang lalu" }
    ],
    jarak: 85,
    urgensi: 90,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Lampu Jalan Mati di Komplek Mawar",
    description: "Sudah 3 hari lampu penerangan jalan di blok C mati. Kondisi sangat gelap di malam hari dan rawan tindak kejahatan.",
    author: "Siti Aminah",
    time: "5 hari yang lalu",
    category: "Fasilitas Umum",
    status: "Menunggu",
    initialUpvotes: 45,
    comments: [],
    jarak: 40,
    urgensi: 60,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Penambahan Tempat Sampah di Taman Kota",
    description: "Taman kota semakin ramai dikunjungi saat akhir pekan, namun jumlah tempat sampah sangat kurang sehingga banyak sampah berserakan.",
    author: "Ahmad Riyadi",
    time: "2 minggu yang lalu",
    category: "Lingkungan",
    status: "Selesai",
    initialUpvotes: 89,
    comments: [
      { id: "c3", author: "Dinas Lingkungan Hidup", text: "Telah ditambahkan 5 tong sampah baru.", time: "2 jam yang lalu" }
    ],
    jarak: 30,
    urgensi: 40,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Pipa Air Bersih PDAM Bocor",
    description: "Terdapat kebocoran pipa utama yang menggenangi jalan raya dan menyebabkan aliran air ke rumah warga terhenti total sejak pagi.",
    author: "Dewi Lestari",
    time: "1 hari yang lalu",
    category: "Infrastruktur",
    status: "Menunggu",
    initialUpvotes: 210,
    comments: [],
    jarak: 95,
    urgensi: 95,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export default function AspirationFeed() {
  const [filterMode, setFilterMode] = useState<"semua" | "baru" | "seminggu" | "sebulan">("semua");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAndRankedAspirations = useMemo(() => {
    let filtered = [...MOCK_ASPIRATIONS];
    
    // Time Filtering logic
    const now = new Date().getTime();
    if (filterMode === "baru") {
      filtered = filtered.filter(a => (now - new Date(a.createdAt).getTime()) <= 3 * 24 * 60 * 60 * 1000); // last 3 days
    } else if (filterMode === "seminggu") {
      filtered = filtered.filter(a => (now - new Date(a.createdAt).getTime()) <= 7 * 24 * 60 * 60 * 1000);
    } else if (filterMode === "sebulan") {
      filtered = filtered.filter(a => (now - new Date(a.createdAt).getTime()) <= 30 * 24 * 60 * 60 * 1000);
    }

    // Ranking Logic (Total = Jarak + Urgensi)
    filtered.sort((a, b) => {
      const scoreA = a.jarak + a.urgensi;
      const scoreB = b.jarak + b.urgensi;
      return scoreB - scoreA;
    });

    return filtered;
  }, [filterMode]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l2-9 5 18 2-9h5"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Aspirasi Terbaru</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Diurutkan berdasarkan skor SPK (Jarak + Urgensi)</p>
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
          const totalScore = aspiration.jarak + aspiration.urgensi;
          return (
            <div key={aspiration.id} className="relative">
              {/* Ranking Badge */}
              <div className="absolute -top-3 -left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 text-xs font-black border-2 border-white dark:border-slate-900">
                <Trophy className="w-3.5 h-3.5" />
                TOP {index + 1} (Skor: {totalScore})
              </div>
              
              <div className="pt-2">
                <AspirationCard {...aspiration} />
              </div>
            </div>
          );
        })}
        {filteredAndRankedAspirations.length === 0 && (
          <div className="text-center py-10 text-slate-500 font-bold">
            Tidak ada aspirasi pada rentang waktu ini.
          </div>
        )}
      </div>
    </div>
  );
}
