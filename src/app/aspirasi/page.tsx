import AspirationFeed from "@/components/AspirationFeed";
import { Search } from "lucide-react";

export default function AspirasiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Semua Aspirasi Warga</h1>
        <p className="text-slate-600">Jelajahi dan dukung berbagai aspirasi, usulan, dan pelaporan dari masyarakat sekitar Anda.</p>
        
        <div className="mt-8 max-w-xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Cari aspirasi atau lokasi..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-700 bg-white"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>
      
      <AspirationFeed showRanking={true} />
    </div>
  );
}
