"use client";

import AspirationFeed from "@/components/AspirationFeed";
import SubmissionForm from "@/components/SubmissionForm";
import ProgressTracker from "@/components/ProgressTracker";
import { Users, CheckCircle, TrendingUp, ShieldCheck } from "lucide-react";

export default function Home() {
  const trackerSteps = [
    { title: "Verifikasi Laporan", description: "Laporan diterima dan diverifikasi oleh admin", status: "completed" as const },
    { title: "Koordinasi Instansi", description: "Diteruskan ke dinas terkait (PUPR)", status: "current" as const },
    { title: "Tindak Lanjut", description: "Proses pengerjaan/perbaikan di lapangan", status: "upcoming" as const },
    { title: "Selesai", description: "Masalah telah teratasi", status: "upcoming" as const },
  ];

  return (
    <div className="min-h-screen pb-12">
      {/* Premium Hero Section */}
      <section className="relative bg-slate-900 pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[3rem] shadow-2xl shadow-teal-900/20 mb-12">
        {/* Abstract Background Elements matching Logo Colors (Teal & Golden Orange) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10 animate-premium-reveal" style={{ animationFillMode: 'both' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm font-bold mb-8 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Transparan & Terpercaya</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
            Suara Anda, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">Aksi Nyata.</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Sampaikan usulan, keluhan, maupun aspirasi Anda secara langsung. Pantau perkembangannya secara transparan, dan mari bangun lingkungan yang lebih baik bersama-sama.
          </p>
          
          {/* Ticker / Stats - Premium Modern Cards with Logo Colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-premium-reveal" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
            {/* Box 1 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-5 hover:bg-white/10 transition-all hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform relative z-10">
                <Users className="w-6 h-6 text-white"/>
              </div>
              <div className="text-left relative z-10">
                <p className="text-3xl font-black text-white">5.4K</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Warga Terlibat</p>
              </div>
            </div>
            
            {/* Box 2 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-5 hover:bg-white/10 transition-all hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform relative z-10">
                <CheckCircle className="w-6 h-6 text-white"/>
              </div>
              <div className="text-left relative z-10">
                <p className="text-3xl font-black text-white">1.200</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Aspirasi Selesai</p>
              </div>
            </div>
            
            {/* Box 3 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-5 hover:bg-white/10 transition-all hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform relative z-10">
                <TrendingUp className="w-6 h-6 text-white"/>
              </div>
              <div className="text-left relative z-10">
                <p className="text-3xl font-black text-white">3 Mnt</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Rata-rata Respon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Bento Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="animate-premium-reveal" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <SubmissionForm />
            </div>
          </div>

          {/* Right Column: Feed */}
          <div className="lg:col-span-7 animate-premium-reveal" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
            <AspirationFeed />
          </div>

        </div>
      </section>
    </div>
  );
}
