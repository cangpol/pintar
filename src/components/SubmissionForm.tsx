"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Send, MapPin, CheckCircle2, ChevronRight, PenLine, Building2, Leaf, HeartPulse, GraduationCap, AlertTriangle } from "lucide-react";

const CATEGORIES = [
  { id: "Infrastruktur", icon: Building2, desc: "Jalan, Jembatan, Fasilitas" },
  { id: "Lingkungan", icon: Leaf, desc: "Sampah, Pohon, Taman" },
  { id: "Kesehatan", icon: HeartPulse, desc: "Puskesmas, RS, Layanan" },
  { id: "Pendidikan", icon: GraduationCap, desc: "Sekolah, Beasiswa" },
];

export default function SubmissionForm() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Aspirasi berhasil dikirim!");
    setStep(1); setCategory(""); setLocation(""); setTitle(""); setDescription("");
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Buat Laporan Baru</h2>
        <p className="text-slate-500 text-sm">Sampaikan masalah di sekitar Anda agar segera ditindaklanjuti.</p>
      </div>

      {/* Modern Stepper */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step >= 1 ? "bg-teal-600 text-white shadow-md shadow-teal-500/20" : "bg-slate-100 text-slate-400"}`}>
          {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
        </div>
        <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 2 ? "bg-teal-600" : "bg-slate-100"}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step >= 2 ? "bg-teal-600 text-white shadow-md shadow-teal-500/20" : "bg-slate-100 text-slate-400"}`}>
          2
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Pilih Kategori Utama</label>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left group ${
                        isSelected 
                          ? "border-teal-500 bg-teal-50/50 shadow-sm" 
                          : "border-slate-100 bg-white hover:border-teal-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`p-2 rounded-xl mb-3 ${isSelected ? "bg-teal-500 text-white shadow-sm" : "bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-600"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`font-bold text-sm ${isSelected ? "text-teal-900" : "text-slate-700"}`}>{cat.id}</span>
                      <span className="text-xs text-slate-400 mt-1 line-clamp-1">{cat.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi Spesifik</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari atau ketik nama jalan..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50 hover:bg-white focus:bg-white transition-all text-slate-700 font-medium placeholder:font-normal"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleNext}
                disabled={!category || !location}
                className="w-full flex justify-center items-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-teal-600 disabled:bg-slate-100 disabled:text-slate-400 transition-all active:scale-[0.98] shadow-md shadow-slate-900/10 disabled:shadow-none"
              >
                Detail Laporan <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Judul Laporan</label>
              <div className="relative">
                <PenLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Contoh: Lampu Jalan Mati di Jl. Sudirman"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50 hover:bg-white focus:bg-white transition-all text-slate-700 font-medium placeholder:font-normal"
                />
              </div>
              {title.toLowerCase().includes("jalan") && (
                <div className="mt-3 flex items-start gap-2 bg-amber-50/80 border border-amber-200/50 p-3.5 rounded-xl text-amber-800 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <strong className="block mb-1">Kemungkinan Duplikasi Laporan</strong>
                    <p className="text-amber-700/80 leading-relaxed">Terdapat <span className="font-bold underline decoration-amber-300 underline-offset-2 cursor-pointer">2 laporan jalan rusak</span> di sekitar lokasi Anda. Apakah Anda ingin mendukung laporan yang sudah ada?</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Lengkap</label>
              <textarea
                placeholder="Ceritakan detail masalah yang Anda temui. Kapan terjadinya? Apa dampaknya?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-4 rounded-xl border-2 border-slate-100 focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50 hover:bg-white focus:bg-white transition-all text-slate-700 font-medium placeholder:font-normal resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 transition-all flex items-center justify-center active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={!title || !description}
                className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3.5 rounded-xl font-bold hover:from-teal-600 hover:to-teal-700 disabled:from-slate-100 disabled:to-slate-100 disabled:text-slate-400 transition-all active:scale-[0.98] shadow-md shadow-teal-600/20 disabled:shadow-none"
              >
                Kirim Laporan <Send className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
