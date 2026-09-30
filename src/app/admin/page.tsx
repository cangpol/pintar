"use client";

import { useState } from "react";
import { Users, FileText, CheckCircle, Clock, Search, Filter, MoreVertical, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("terbaru");

  const recentAspirations = [
    { id: "ASP-001", user: "Budi Santoso", category: "Infrastruktur", status: "Diproses", date: "Hari ini, 09:30", color: "text-orange-500 bg-orange-500/10" },
    { id: "ASP-002", user: "Siti Aminah", category: "Pelayanan Publik", status: "Selesai", date: "Kemarin, 14:15", color: "text-emerald-500 bg-emerald-500/10" },
    { id: "ASP-003", user: "Agus Pratama", category: "Lingkungan", status: "Menunggu", date: "28 Sep, 08:45", color: "text-slate-500 bg-slate-500/10" },
    { id: "ASP-004", user: "Dewi Lestari", category: "Fasilitas Umum", status: "Diproses", date: "27 Sep, 16:20", color: "text-orange-500 bg-orange-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Header */}
      <div className="mb-10 animate-premium-reveal">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-300 text-sm font-bold mb-4 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4" />
          <span>Panel Administrator</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Dashboard Utama
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Selamat datang kembali, Admin. Berikut ringkasan laporan hari ini.
            </p>
          </div>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Unduh Laporan PDF</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-premium-reveal" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        {[
          { title: "Laporan Baru", value: "24", icon: FileText, gradient: "from-blue-400 to-blue-600", trend: "+12% dari kemarin" },
          { title: "Total Diproses", value: "145", icon: Clock, gradient: "from-orange-400 to-orange-500", trend: "Normal" },
          { title: "Selesai", value: "8.120", icon: CheckCircle, gradient: "from-emerald-400 to-emerald-600", trend: "+5% bulan ini" },
          { title: "Total Pengguna", value: "5.431", icon: Users, gradient: "from-teal-400 to-teal-600", trend: "+120 pengguna baru" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">{stat.title}</p>
              <p className="text-xs font-medium text-slate-400 mt-3">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-premium-reveal" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        
        {/* Table Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-teal-500" />
              Manajemen Aspirasi
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Cari tiket..." className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:border-teal-500" />
              </div>
              <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">ID Tiket</th>
                  <th className="px-6 py-4 font-bold">Pelapor</th>
                  <th className="px-6 py-4 font-bold">Kategori</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Waktu</th>
                  <th className="px-6 py-4 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {recentAspirations.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{item.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{item.user}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{item.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${item.color}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{item.date}</td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-teal-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-center">
            <button className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline">
              Lihat Semua Laporan
            </button>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700 shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -z-10" />
          
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Tindakan Cepat</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-medium">
              Ada 5 aspirasi mendesak yang memerlukan tanggapan Anda segera hari ini.
            </p>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl text-sm font-bold transition-colors">
              Proses Antrean (5)
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-sm font-bold transition-colors">
              Pengaturan Sistem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
