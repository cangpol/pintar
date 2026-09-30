"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, CheckCircle, Clock, LayoutDashboard, ShieldCheck, Check, X, Printer, UserPlus, Settings, LogOut, Trash2, Eye, Building2, Plus } from "lucide-react";
import jsPDF from "jspdf";
import { createPortal } from "react-dom";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "aspirasi" | "users" | "dinas">("dashboard");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  // Dinas Categories CRUD State
  const [dinasList, setDinasList] = useState<any[]>([]);
  const [isDinasModalOpen, setIsDinasModalOpen] = useState(false);
  const [editingDinasId, setEditingDinasId] = useState<string | null>(null);
  const [dinasForm, setDinasForm] = useState({ name: "", email: "", status: "Aktif" });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ email: "", password: "", name: "", role: "Operator Dinas", instansi: "", status: "Aktif" });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAspiration, setSelectedAspiration] = useState<any>(null);
  const [selectedDinas, setSelectedDinas] = useState("");

  const [aspirations, setAspirations] = useState([
    { id: "ASP-001", user: "Budi Santoso", category: "Infrastruktur", title: "Perbaikan Jalan Berlubang di Jl. Merdeka", description: "Terdapat banyak lubang di sepanjang jalan Merdeka yang membahayakan pengendara motor, terutama saat hujan karena tertutup genangan air. Mohon segera diperbaiki.", status: "Menunggu Approval", date: "Hari ini, 09:30", color: "text-orange-500 bg-orange-500/10", forwardedTo: "", jarak: 85, urgensi: 90 },
    { id: "ASP-004", user: "Dewi Lestari", category: "Infrastruktur", title: "Pipa Air Bersih PDAM Bocor", description: "Terdapat kebocoran pipa utama yang menggenangi jalan raya dan menyebabkan aliran air ke rumah warga terhenti total sejak pagi.", status: "Menunggu Approval", date: "Kemarin, 16:20", color: "text-orange-500 bg-orange-500/10", forwardedTo: "", jarak: 95, urgensi: 95 },
    { id: "ASP-002", user: "Siti Aminah", category: "Fasilitas Umum", title: "Lampu Jalan Mati di Komplek Mawar", description: "Sudah 3 hari lampu penerangan jalan di blok C mati. Kondisi sangat gelap di malam hari dan rawan tindak kejahatan.", status: "Menunggu Approval", date: "Kemarin, 14:15", color: "text-orange-500 bg-orange-500/10", forwardedTo: "", jarak: 40, urgensi: 60 },
    { id: "ASP-003", user: "Ahmad Riyadi", category: "Lingkungan", title: "Penambahan Tempat Sampah di Taman Kota", description: "Taman kota semakin ramai dikunjungi saat akhir pekan, namun jumlah tempat sampah sangat kurang sehingga banyak sampah berserakan.", status: "Selesai", date: "1 hari yang lalu", color: "text-emerald-500 bg-emerald-500/10", forwardedTo: "Dinas Lingkungan Hidup", jarak: 30, urgensi: 40 },
  ]);

  useEffect(() => {
    setIsClient(true);
    const session = localStorage.getItem("pintar_session");
    if (!session) {
      router.push("/login");
      return;
    }
    setCurrentUser(JSON.parse(session));
    setUsers(JSON.parse(localStorage.getItem("pintar_users") || "[]"));
    
    // Default Dinas
    const storedDinas = JSON.parse(localStorage.getItem("pintar_dinas") || "[]");
    if (storedDinas.length === 0) {
      const defaultDinas = [
        { id: "DIN-001", name: "Dinas Pekerjaan Umum (PU)", email: "pu@jateng.go.id", status: "Aktif" },
        { id: "DIN-002", name: "Dinas Lingkungan Hidup", email: "dlh@jateng.go.id", status: "Aktif" },
        { id: "DIN-003", name: "Dinas Perhubungan", email: "dishub@jateng.go.id", status: "Aktif" },
      ];
      localStorage.setItem("pintar_dinas", JSON.stringify(defaultDinas));
      setDinasList(defaultDinas);
    } else {
      setDinasList(storedDinas);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("pintar_session");
    router.push("/");
  };

  // DINAS CRUD
  const handleOpenDinasModal = (dinasId: string | null = null) => {
    if (dinasId) {
      const d = dinasList.find(x => x.id === dinasId);
      if (d) { setDinasForm(d); setEditingDinasId(d.id); }
    } else {
      setDinasForm({ name: "", email: "", status: "Aktif" });
      setEditingDinasId(null);
    }
    setIsDinasModalOpen(true);
  };
  const handleSaveDinas = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = [...dinasList];
    if (editingDinasId) {
      updated = updated.map(d => d.id === editingDinasId ? { ...dinasForm, id: editingDinasId } : d);
    } else {
      updated.push({ ...dinasForm, id: `DIN-00${dinasList.length + 1}` });
    }
    setDinasList(updated);
    localStorage.setItem("pintar_dinas", JSON.stringify(updated));
    setIsDinasModalOpen(false);
  };
  const handleDeleteDinas = (id: string) => {
    if (confirm("Yakin ingin menghapus dinas ini?")) {
      const updated = dinasList.filter(d => d.id !== id);
      setDinasList(updated);
      localStorage.setItem("pintar_dinas", JSON.stringify(updated));
    }
  };

  // USER CRUD
  const handleOpenUserModal = (userId: string | null = null) => {
    if (userId) {
      const u = users.find(x => x.id === userId);
      if (u) { setUserForm(u); setEditingUserId(u.id); }
    } else {
      setUserForm({ email: "", password: "123", name: "", role: "Operator Dinas", instansi: "", status: "Aktif" });
      setEditingUserId(null);
    }
    setIsUserModalOpen(true);
  };
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedUsers = [...users];
    if (editingUserId) {
      updatedUsers = updatedUsers.map(u => u.id === editingUserId ? { ...userForm, id: editingUserId } : u);
    } else {
      updatedUsers.push({ ...userForm, id: `USR-00${users.length + 1}` });
    }
    setUsers(updatedUsers);
    localStorage.setItem("pintar_users", JSON.stringify(updatedUsers));
    setIsUserModalOpen(false);
  };
  const handleDeleteUser = (id: string) => {
    if (id === currentUser.id) return alert("Anda tidak dapat menghapus akun Anda sendiri!");
    if (confirm("Yakin ingin menghapus user ini?")) {
      const updatedUsers = users.filter(u => u.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem("pintar_users", JSON.stringify(updatedUsers));
    }
  };

  // ASPIRATION ACTIONS
  const openDetailModal = (aspiration: any) => {
    setSelectedAspiration(aspiration);
    setSelectedDinas(aspiration.forwardedTo || "");
    setIsDetailModalOpen(true);
  };

  const handleApproveFromDetail = () => {
    if (!selectedDinas) return alert("Pilih dinas yang akan diteruskan terlebih dahulu!");
    setLoadingAction(`approve-${selectedAspiration.id}`);
    setTimeout(() => {
      setAspirations(prev => prev.map(a => 
        a.id === selectedAspiration.id ? { ...a, status: "Diteruskan ke Dinas", color: "text-blue-500 bg-blue-500/10", forwardedTo: selectedDinas } : a
      ));
      setLoadingAction(null);
      setIsDetailModalOpen(false);
    }, 1000);
  };

  const handleRejectFromDetail = () => {
    if(confirm("Apakah Anda yakin ingin menolak aspirasi ini?")) {
      setAspirations(prev => prev.map(a => 
        a.id === selectedAspiration.id ? { ...a, status: "Ditolak/Arsip", color: "text-slate-500 bg-slate-500/10" } : a
      ));
      setIsDetailModalOpen(false);
    }
  };

  const handleDeleteAspiration = (id: string) => {
    if(confirm("Apakah Anda yakin ingin MENGHAPUS aspirasi ini secara permanen?")) {
      setAspirations(prev => prev.filter(a => a.id !== id));
      setIsDetailModalOpen(false);
    }
  };

  const generatePDF = (aspiration: any) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204);
    doc.text("TVRI JAWA TENGAH", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.text("SISTEM PUSAT INTERAKSI & ASPIRASI RAKYAT (PINTAR)", 105, 28, { align: "center" });
    doc.setLineWidth(1);
    doc.setDrawColor(0, 102, 204);
    doc.line(20, 35, 190, 35);
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 37, 190, 37);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SURAT PENGANTAR ASPIRASI MASYARAKAT", 105, 55, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Nomor Tiket  : ${aspiration.id}`, 20, 70);
    doc.text(`Tanggal      : ${new Date().toLocaleDateString('id-ID')}`, 20, 77);
    doc.text(`Kategori     : ${aspiration.category}`, 20, 84);
    doc.text(`Total Skor SPK: ${aspiration.jarak + aspiration.urgensi} (Jarak: ${aspiration.jarak}, Urgensi: ${aspiration.urgensi})`, 20, 91);
    
    doc.text("Kepada Yth,", 20, 107);
    doc.setFont("helvetica", "bold");
    doc.text(`Kepala ${aspiration.forwardedTo || "Instansi Terkait"}`, 20, 114);
    doc.setFont("helvetica", "normal");
    doc.text("di Tempat", 20, 121);
    
    const bodyText = `Dengan hormat,\n\nMelalui surat ini, kami meneruskan laporan dan aspirasi dari masyarakat yang masuk melalui platform PINTAR TVRI Jawa Tengah. Berikut adalah rincian laporan yang perlu mendapat perhatian dan tindak lanjut dari instansi Bapak/Ibu:`;
    const splitBody = doc.splitTextToSize(bodyText, 170);
    doc.text(splitBody, 20, 135);
    
    doc.setFont("helvetica", "bold");
    doc.text("Nama Pelapor :", 25, 160);
    doc.setFont("helvetica", "normal");
    doc.text(aspiration.user, 60, 160);
    doc.setFont("helvetica", "bold");
    doc.text("Judul Laporan :", 25, 170);
    doc.setFont("helvetica", "normal");
    doc.text(aspiration.title, 60, 170);
    doc.setFont("helvetica", "bold");
    doc.text("Uraian Aduan :", 25, 180);
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(aspiration.description, 130);
    doc.text(splitDesc, 60, 180);
    
    const closingText = `Demikian surat pengantar ini kami sampaikan. Kami sangat mengharapkan tindak lanjut segera demi mewujudkan pelayanan publik yang lebih baik.\n\nAtas perhatian dan kerja samanya, kami ucapkan terima kasih.`;
    const splitClosing = doc.splitTextToSize(closingText, 170);
    doc.text(splitClosing, 20, 220);
    
    doc.text("Hormat kami,", 140, 250);
    doc.setFont("helvetica", "bold");
    doc.text(currentUser?.name || "Administrator", 140, 275);
    doc.text("PINTAR TVRI Jawa Tengah", 140, 282);
    
    window.open(doc.output('bloburl'), '_blank');
  };

  if (!currentUser) return null;

  const renderModals = () => {
    if (!isClient) return null;
    return createPortal(
      <>
        {/* Detail Modal */}
        {isDetailModalOpen && selectedAspiration && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedAspiration.title}</h3>
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-1">{selectedAspiration.id} • {selectedAspiration.date}</p>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 mb-6 border border-slate-100 dark:border-slate-700/50">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pelapor</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{selectedAspiration.user}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kategori</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{selectedAspiration.category}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl border border-orange-100 dark:border-orange-800">
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Jarak (0-100)</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-200">{selectedAspiration.jarak}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800">
                    <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Urgensi (0-100)</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-200">{selectedAspiration.urgensi}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Skor SPK: {selectedAspiration.jarak + selectedAspiration.urgensi}</p>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Isi Laporan / Keluhan</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">{selectedAspiration.description}</p>
                </div>
              </div>

              {selectedAspiration.status === "Menunggu Approval" && currentUser.role === "Super Admin" ? (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-500" /> Aksi Administrator
                  </h4>
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Pilih Kategori Dinas Tujuan</label>
                    <select 
                      value={selectedDinas} 
                      onChange={e => setSelectedDinas(e.target.value)} 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white text-sm font-medium"
                    >
                      <option value="">-- Pilih Dinas / Instansi --</option>
                      {dinasList.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={handleDeleteAspiration} 
                      className="py-3 px-4 bg-red-50 hover:bg-red-500 hover:text-white dark:bg-red-900/30 dark:hover:bg-red-600 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                    <button 
                      onClick={handleRejectFromDetail} 
                      className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <X className="w-4 h-4" /> Tolak
                    </button>
                    <button 
                      onClick={handleApproveFromDetail} 
                      disabled={loadingAction === `approve-${selectedAspiration.id}`}
                      className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                    >
                      {loadingAction === `approve-${selectedAspiration.id}` ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Check className="w-5 h-5" /> Setujui & Teruskan</>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-300">Status: {selectedAspiration.status}</p>
                    {selectedAspiration.forwardedTo && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Diteruskan ke: {selectedAspiration.forwardedTo}</p>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                    {currentUser.role === "Super Admin" && (
                      <button onClick={() => handleDeleteAspiration(selectedAspiration.id)} className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold rounded-xl transition-colors flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Hapus Data
                      </button>
                    )}
                    <button onClick={() => setIsDetailModalOpen(false)} className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Tutup</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Modal */}
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                {editingUserId ? "Edit Pengguna" : "Tambah Pengguna Baru"}
              </h3>
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                  <input required type="text" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email / NIP</label>
                  <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <input required type="text" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                    <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white">
                      <option>Super Admin</option>
                      <option>Operator Dinas</option>
                      <option>Peninjau</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select value={userForm.status} onChange={e => setUserForm({...userForm, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white">
                      <option>Aktif</option>
                      <option>Nonaktif</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Instansi</label>
                  <input required type="text" value={userForm.instansi} onChange={e => setUserForm({...userForm, instansi: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white" />
                </div>
                <div className="flex justify-end gap-3 pt-4 mt-6">
                  <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500">Batal</button>
                  <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-md">Simpan Data</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dinas Modal */}
        {isDinasModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                {editingDinasId ? "Edit Kategori Dinas" : "Tambah Kategori Dinas"}
              </h3>
              <form onSubmit={handleSaveDinas} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Dinas</label>
                  <input required type="text" value={dinasForm.name} onChange={e => setDinasForm({...dinasForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email Dinas</label>
                  <input required type="email" value={dinasForm.email} onChange={e => setDinasForm({...dinasForm, email: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select value={dinasForm.status} onChange={e => setDinasForm({...dinasForm, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white">
                    <option>Aktif</option>
                    <option>Nonaktif</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4 mt-6">
                  <button type="button" onClick={() => setIsDinasModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500">Batal</button>
                  <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-md">Simpan Data</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>,
      document.body
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      
      {/* Header Info & Logout */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center font-bold text-lg">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">{currentUser.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.role} • {currentUser.instansi}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-full text-sm font-bold transition-all">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 md:gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide animate-premium-reveal">
        <button onClick={() => setActiveTab("dashboard")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <LayoutDashboard className="w-4 h-4" /> Overview
        </button>
        <button onClick={() => setActiveTab("aspirasi")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'aspirasi' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
          <CheckCircle className="w-4 h-4" /> Approval
        </button>
        {currentUser.role === "Super Admin" && (
          <>
            <button onClick={() => setActiveTab("users")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Users className="w-4 h-4" /> Manajemen User
            </button>
            <button onClick={() => setActiveTab("dinas")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dinas' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <Building2 className="w-4 h-4" /> Kategori Dinas
            </button>
          </>
        )}
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div className="animate-premium-reveal">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { title: "Laporan Baru", value: "24", icon: FileText, gradient: "from-blue-400 to-blue-600" },
              { title: "Total Diteruskan", value: "145", icon: Clock, gradient: "from-orange-400 to-orange-500" },
              { title: "Tuntas/Selesai", value: "8.120", icon: CheckCircle, gradient: "from-emerald-400 to-emerald-600" },
              { title: "Total Pengguna", value: users.length, icon: Users, gradient: "from-teal-400 to-teal-600" },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ASPIRASI TAB */}
      {activeTab === "aspirasi" && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-premium-reveal">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500" /> Approval Aspirasi
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">SPK Rank</th>
                  <th className="px-6 py-4 font-bold">Detail Laporan</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-center">Aksi / Cetak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {aspirations.sort((a,b) => (b.jarak + b.urgensi) - (a.jarak + a.urgensi)).map((item, i) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center justify-center p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl border border-orange-100 dark:border-orange-800 w-16">
                        <span className="text-[10px] font-bold uppercase">Skor</span>
                        <span className="text-lg font-black">{item.jarak + item.urgensi}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{item.id} - {item.user}</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">{item.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{item.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${item.color}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openDetailModal(item)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white dark:bg-blue-500/10 dark:hover:bg-blue-500 rounded-lg text-xs font-bold transition-colors">
                          <Eye className="w-4 h-4" /> Detail
                        </button>
                        {(item.status === "Diteruskan ke Dinas" || item.status === "Selesai") && (
                          <button onClick={() => generatePDF(item)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-800 hover:text-white dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-lg text-xs font-bold transition-colors">
                            <Printer className="w-4 h-4" /> Cetak
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

      {/* USER MANAGEMENT TAB */}
      {activeTab === "users" && currentUser.role === "Super Admin" && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden animate-premium-reveal">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-500" /> Manajemen Pengguna
            </h3>
            <button onClick={() => handleOpenUserModal(null)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-teal-700">
              <UserPlus className="w-4 h-4" /> Tambah User
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Role & Instansi</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {users.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-bold">{item.role}</p>
                    <p className="text-xs text-slate-500">{item.instansi}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleOpenUserModal(item.id)} className="p-2 text-slate-400 hover:text-teal-600"><Settings className="w-5 h-5" /></button>
                    <button onClick={() => handleDeleteUser(item.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DINAS TAB */}
      {activeTab === "dinas" && currentUser.role === "Super Admin" && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden animate-premium-reveal">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-500" /> Kategori Dinas
            </h3>
            <button onClick={() => handleOpenDinasModal(null)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-teal-700">
              <Plus className="w-4 h-4" /> Tambah Dinas
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Nama Dinas</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {dinasList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20">
                  <td className="px-6 py-4 text-sm font-bold text-slate-500">{item.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.email}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleOpenDinasModal(item.id)} className="p-2 text-slate-400 hover:text-teal-600"><Settings className="w-5 h-5" /></button>
                    <button onClick={() => handleDeleteDinas(item.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {renderModals()}
    </div>
  );
}
