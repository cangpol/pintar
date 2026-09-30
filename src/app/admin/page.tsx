"use client";

import { useState } from "react";
import { Users, FileText, CheckCircle, Clock, Search, Filter, MoreVertical, LayoutDashboard, ShieldCheck, Download, Check, X, Printer, UserPlus, Settings } from "lucide-react";
import jsPDF from "jspdf";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "aspirasi" | "users">("dashboard");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  // Dummy data state for aspirations
  const [aspirations, setAspirations] = useState([
    { id: "ASP-001", user: "Budi Santoso", category: "Infrastruktur", description: "Jalan berlubang parah di ruas jalan protokol depan pasar induk yang menyebabkan kecelakaan.", status: "Menunggu Approval", date: "Hari ini, 09:30", color: "text-orange-500 bg-orange-500/10" },
    { id: "ASP-002", user: "Siti Aminah", category: "Pelayanan Publik", description: "Antrean panjang dan pelayanan lambat di Disdukcapil kota.", status: "Selesai", date: "Kemarin, 14:15", color: "text-emerald-500 bg-emerald-500/10" },
    { id: "ASP-003", user: "Agus Pratama", category: "Lingkungan", description: "Sampah menumpuk tidak diangkut selama 4 hari di TPS dekat perumahan warga.", status: "Menunggu Approval", date: "28 Sep, 08:45", color: "text-orange-500 bg-orange-500/10" },
    { id: "ASP-004", user: "Dewi Lestari", category: "Fasilitas Umum", description: "Lampu penerangan jalan (PJU) mati total di sepanjang jalan merdeka barat.", status: "Diteruskan ke Dinas", date: "27 Sep, 16:20", color: "text-blue-500 bg-blue-500/10" },
  ]);

  // Dummy users data
  const [users, setUsers] = useState([
    { id: "USR-001", name: "Admin Utama", role: "Super Admin", instansi: "TVRI Jawa Tengah", status: "Aktif" },
    { id: "USR-002", name: "Dinas PU", role: "Operator Dinas", instansi: "Dinas Pekerjaan Umum", status: "Aktif" },
    { id: "USR-003", name: "Dinas Lingkungan", role: "Operator Dinas", instansi: "Dinas Lingkungan Hidup", status: "Aktif" },
    { id: "USR-004", name: "Staff Peninjau", role: "Reviewer", instansi: "TVRI Jawa Tengah", status: "Nonaktif" },
  ]);

  const handleApprove = (id: string) => {
    setLoadingAction(id);
    setTimeout(() => {
      setAspirations(prev => prev.map(a => 
        a.id === id ? { ...a, status: "Diteruskan ke Dinas", color: "text-blue-500 bg-blue-500/10" } : a
      ));
      setLoadingAction(null);
      alert(`Aspirasi ${id} berhasil diapprove dan diteruskan ke instansi terkait!`);
    }, 1000);
  };

  const handleReject = (id: string) => {
    if(confirm("Apakah Anda yakin ingin menolak/mengarsipkan aspirasi ini?")) {
      setAspirations(prev => prev.map(a => 
        a.id === id ? { ...a, status: "Ditolak/Arsip", color: "text-slate-500 bg-slate-500/10" } : a
      ));
    }
  };

  const generatePDF = (aspiration: any) => {
    const doc = new jsPDF();
    
    // Kop Surat
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("PINTAR - PUSAT INTERAKSI & ASPIRASI RAKYAT", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("TVRI Jawa Tengah", 105, 27, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);
    
    // Judul Surat
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SURAT PENGANTAR ASPIRASI MASYARAKAT", 105, 45, { align: "center" });
    
    // Isi
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    doc.text(`Nomor Tiket  : ${aspiration.id}`, 20, 60);
    doc.text(`Tanggal      : ${new Date().toLocaleDateString('id-ID')}`, 20, 67);
    doc.text(`Kategori     : ${aspiration.category}`, 20, 74);
    
    doc.text("Kepada Yth,", 20, 90);
    doc.setFont("helvetica", "bold");
    doc.text(`Kepala Dinas / Instansi Terkait (Kategori: ${aspiration.category})`, 20, 97);
    doc.setFont("helvetica", "normal");
    doc.text("di Tempat", 20, 104);
    
    const bodyText = `Dengan hormat,\n\nMelalui surat ini, kami meneruskan laporan dan aspirasi dari masyarakat yang masuk melalui platform PINTAR TVRI Jawa Tengah. Berikut adalah rincian laporan yang perlu mendapat perhatian dan tindak lanjut dari instansi Bapak/Ibu:`;
    const splitBody = doc.splitTextToSize(bodyText, 170);
    doc.text(splitBody, 20, 120);
    
    doc.setFont("helvetica", "bold");
    doc.text("Nama Pelapor :", 25, 145);
    doc.setFont("helvetica", "normal");
    doc.text(aspiration.user, 60, 145);
    
    doc.setFont("helvetica", "bold");
    doc.text("Uraian Aduan :", 25, 155);
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(aspiration.description, 130);
    doc.text(splitDesc, 60, 155);
    
    const closingText = `Demikian surat pengantar ini kami sampaikan. Kami sangat mengharapkan tindak lanjut segera demi mewujudkan pelayanan publik yang lebih baik.\n\nAtas perhatian dan kerja samanya, kami ucapkan terima kasih.`;
    const splitClosing = doc.splitTextToSize(closingText, 170);
    doc.text(splitClosing, 20, 190);
    
    doc.text("Hormat kami,", 140, 220);
    doc.setFont("helvetica", "bold");
    doc.text("Administrator PINTAR", 140, 245);
    doc.text("TVRI Jawa Tengah", 140, 252);
    
    // Simpan PDF
    doc.save(`Surat_Pengantar_Aspirasi_${aspiration.id}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 md:gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide animate-premium-reveal">
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
        >
          <LayoutDashboard className="w-4 h-4" /> Overview Dashboard
        </button>
        <button 
          onClick={() => setActiveTab("aspirasi")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'aspirasi' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
        >
          <CheckCircle className="w-4 h-4" /> Approval & Aspirasi
        </button>
        <button 
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
        >
          <Users className="w-4 h-4" /> Manajemen User
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div className="animate-premium-reveal">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard Utama</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Ringkasan statistik sistem PINTAR TVRI Jawa Tengah.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { title: "Laporan Baru", value: "24", icon: FileText, gradient: "from-blue-400 to-blue-600", trend: "Menunggu Approval" },
              { title: "Total Diteruskan", value: "145", icon: Clock, gradient: "from-orange-400 to-orange-500", trend: "Sedang diproses dinas" },
              { title: "Tuntas/Selesai", value: "8.120", icon: CheckCircle, gradient: "from-emerald-400 to-emerald-600", trend: "Solusi ditemukan" },
              { title: "Total Pengguna", value: "5.431", icon: Users, gradient: "from-teal-400 to-teal-600", trend: "Admin & Publik" },
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
        </div>
      )}

      {activeTab === "aspirasi" && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-premium-reveal">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500" />
              Approval Aspirasi & Penerusan
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Detail Laporan</th>
                  <th className="px-6 py-4 font-bold">Kategori</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-center">Aksi / Cetak PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {aspirations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.id} - {item.user}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-sm">{item.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{item.date}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{item.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${item.color}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.status === "Menunggu Approval" ? (
                          <>
                            <button 
                              onClick={() => handleApprove(item.id)}
                              disabled={loadingAction === item.id}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/10 dark:hover:bg-emerald-500 rounded-lg transition-colors group relative"
                              title="Setujui & Teruskan"
                            >
                              {loadingAction === item.id ? <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /> : <Check className="w-5 h-5" />}
                            </button>
                            <button 
                              onClick={() => handleReject(item.id)}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-500 rounded-lg transition-colors group relative"
                              title="Tolak / Arsipkan"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => generatePDF(item)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-800 hover:text-white dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all text-xs font-bold"
                            title="Export Pengantar ke Dinas (PDF)"
                          >
                            <Printer className="w-4 h-4" />
                            <span>Cetak PDF</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-premium-reveal">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-500" />
              Manajemen Hak Akses & Pengguna
            </h3>
            <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-teal-700 transition-colors">
              <UserPlus className="w-4 h-4" /> Tambah User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">User / ID</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Instansi</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{item.role}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{item.instansi}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'Aktif' ? 'text-teal-600 bg-teal-50 dark:bg-teal-500/10 dark:text-teal-400' : 'text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-400'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
