"use client";

import AspirationCard, { AspirationCardProps, Comment } from "./AspirationCard";
import { Filter } from "lucide-react";

const MOCK_ASPIRATIONS: AspirationCardProps[] = [
  {
    id: "1",
    title: "Perbaikan Jalan Berlubang di Jl. Merdeka",
    description: "Terdapat banyak lubang di sepanjang jalan Merdeka yang membahayakan pengendara motor, terutama saat hujan karena tertutup genangan air. Mohon segera diperbaiki sebelum ada korban jiwa.",
    author: "Budi Santoso",
    time: "2 jam yang lalu",
    category: "Infrastruktur",
    status: "Diproses",
    initialUpvotes: 124,
    comments: [
      { id: "c1", author: "Dinas PUPR", text: "Terima kasih laporannya. Tim kami sedang menuju ke lokasi untuk melakukan penambalan sementara.", time: "1 jam yang lalu" },
      { id: "c2", author: "Andi", text: "Setuju, kemarin saya hampir jatuh di sana.", time: "45 menit yang lalu" }
    ],
  },
  {
    id: "2",
    title: "Lampu Jalan Mati di Komplek Mawar",
    description: "Sudah 3 hari lampu penerangan jalan di blok C mati. Kondisi sangat gelap di malam hari dan rawan tindak kejahatan.",
    author: "Siti Aminah",
    time: "5 jam yang lalu",
    category: "Fasilitas Umum",
    status: "Menunggu",
    initialUpvotes: 45,
    comments: [],
  },
  {
    id: "3",
    title: "Penambahan Tempat Sampah di Taman Kota",
    description: "Taman kota semakin ramai dikunjungi saat akhir pekan, namun jumlah tempat sampah sangat kurang sehingga banyak sampah berserakan.",
    author: "Ahmad Riyadi",
    time: "1 hari yang lalu",
    category: "Lingkungan",
    status: "Selesai",
    initialUpvotes: 89,
    comments: [
      { id: "c3", author: "Dinas Lingkungan Hidup", text: "Telah ditambahkan 5 tong sampah baru di area bermain dan pintu masuk.", time: "2 jam yang lalu" }
    ],
  },
];

export default function AspirationFeed() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l2-9 5 18 2-9h5"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Aspirasi Terbaru</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Live feed laporan masyarakat</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm active:scale-95">
          <Filter className="w-4 h-4" />
          Filter & Urutkan
        </button>
      </div>
      
      <div className="flex flex-col gap-5">
        {MOCK_ASPIRATIONS.map((aspiration) => (
          <AspirationCard key={aspiration.id} {...aspiration} />
        ))}
      </div>
    </div>
  );
}
