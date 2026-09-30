"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, CheckCircle, Clock, LayoutDashboard, Check, X, Printer, UserPlus, Settings, LogOut, Trash2, Building2, Plus, Trophy, MapPin, AlertTriangle } from "lucide-react";
import jsPDF from "jspdf";
import { createPortal } from "react-dom";
import { MOCK_ASPIRATIONS_DATA } from "@/lib/dummyData";

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

  const [aspirations, setAspirations] = useState(MOCK_ASPIRATIONS_DATA);

  // Quick select dinas for approval
  const [selectedDinasForCard, setSelectedDinasForCard] = useState<Record<string, string>>({});

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
        { id: "DIN-004", name: "Dinas Kesehatan", email: "dinkes@jateng.go.id", status: "Aktif" },
        { id: "DIN-005", name: "Dinas Pendidikan", email: "disdik@jateng.go.id", status: "Aktif" },
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
  const handleApprove = (id: string) => {
    const dinas = selectedDinasForCard[id];
    if (!dinas) return alert("Pilih dinas yang akan diteruskan pada dropdown terlebih dahulu!");
    
    setLoadingAction(`approve-${id}`);
    setTimeout(() => {
      setAspirations(prev => prev.map(a => 
        a.id === id ? { ...a, status: "Diteruskan ke Dinas", forwardedTo: dinas } : a
      ));
      setLoadingAction(null);
    }, 1000);
  };

  const handleReject = (id: string) => {
    if(confirm("Apakah Anda yakin ingin menolak aspirasi ini?")) {
      setAspirations(prev => prev.map(a => 
        a.id === id ? { ...a, status: "Ditolak/Arsip" } : a
      ));
    }
  };

  const handleDeleteAspiration = (id: string) => {
    if(confirm("Apakah Anda yakin ingin MENGHAPUS aspirasi ini secara permanen?")) {
      setAspirations(prev => prev.filter(a => a.id !== id));
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
    doc.text(aspiration.author, 60, 160);
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

  const sortedAspirations = [...aspirations].sort((a,b) => (b.jarak + b.urgensi) - (a.jarak + a.urgensi));

  const renderModals = () => {
    if (!isClient) return null;
    return createPortal(
      <>
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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8 relative">
      
      {/* Header Info & Logout */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center font-bold text-lg border border-teal-500/30">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">{currentUser.name}</h2>
            <p className="text-xs text-slate-400">{currentUser.role} • {currentUser.instansi}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-2.5 text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-full text-sm font-bold transition-all border border-slate-700">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 md:gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide animate-premium-reveal">
        <button onClick={() => setActiveTab("dashboard")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'}`}>
          <LayoutDashboard className="w-4 h-4" /> Overview Dashboard
        </button>
        <button onClick={() => setActiveTab("aspirasi")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'aspirasi' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'}`}>
          <CheckCircle className="w-4 h-4" /> Approval & Aspirasi
        </button>
        {currentUser.role === "Super Admin" && (
          <>
            <button onClick={() => setActiveTab("users")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'}`}>
              <Users className="w-4 h-4" /> Manajemen User
            </button>
            <button onClick={() => setActiveTab("dinas")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dinas' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'}`}>
              <Building2 className="w-4 h-4" /> Kategori Dinas
            </button>
          </>
        )}
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div className="animate-premium-reveal">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard Utama</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Ringkasan statistik sistem PINTAR TVRI Jawa Tengah.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { title: "Laporan Baru", value: aspirations.filter(a => a.status === "Menunggu Approval").length, icon: FileText, gradient: "from-blue-400 to-blue-600" },
              { title: "Diteruskan ke Dinas", value: aspirations.filter(a => a.status === "Diteruskan ke Dinas").length, icon: Clock, gradient: "from-orange-400 to-orange-500" },
              { title: "Tuntas/Selesai", value: aspirations.filter(a => a.status === "Selesai").length, icon: CheckCircle, gradient: "from-emerald-400 to-emerald-600" },
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

      {/* ASPIRASI TAB (Rich Cards) */}
      {activeTab === "aspirasi" && (
        <div className="flex flex-col gap-6 animate-premium-reveal">
          
          <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-2 shadow-sm">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500" /> Daftar Aspirasi Masuk
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">Urutkan berdasarkan:</span>
              <select className="bg-[#1A2642] border border-[#2A3B61] text-white text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500">
                <option>Skor Gabungan (Tertinggi)</option>
                <option>Terbaru</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {sortedAspirations.map((item, index) => {
              const totalScore = item.jarak + item.urgensi;
              
              return (
                <div key={item.id} className="flex flex-col lg:flex-row bg-[#0B152B] border border-[#1A2642] rounded-3xl overflow-hidden shadow-2xl relative text-white">
                  
                  {/* Left Section: Info */}
                  <div className="flex-1 p-6 lg:p-8 flex items-start gap-4 lg:gap-6 border-b lg:border-b-0 lg:border-r border-[#1A2642]">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#1A2642] text-slate-300 text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full border border-slate-700">
                          {item.category}
                        </span>
                        <span className="text-xs font-medium text-slate-500">• {item.time}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 leading-snug">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm">
                            {(item.author || "A")[0]}
                          </div>
                          <span className="text-sm font-bold text-slate-300">{item.author}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-slate-400 bg-[#1A2642] border border-[#2A3B61] px-3 py-1.5 rounded-lg text-sm font-bold">
                            <Trophy className="w-4 h-4" /> {item.initialUpvotes}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Admin Controls */}
                  <div className="w-full lg:w-[450px] p-6 lg:p-8 bg-[#0B152B] flex flex-col justify-center relative">
                    
                    <div className="absolute right-6 top-8 text-center hidden md:block">
                      <Trophy className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-400 font-bold">Di atas</p>
                      <p className="text-3xl font-black text-white">#{index + 1}</p>
                    </div>

                    <p className="text-sm font-bold text-slate-300 mb-4">Status Admin</p>
                    
                    {item.status === "Menunggu Approval" && currentUser.role === "Super Admin" ? (
                      <>
                        <div className="mb-4">
                          <select 
                            value={selectedDinasForCard[item.id] || ""} 
                            onChange={e => setSelectedDinasForCard({...selectedDinasForCard, [item.id]: e.target.value})} 
                            className="w-full px-4 py-2 bg-[#1A2642] border border-[#2A3B61] rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-white text-sm font-medium"
                          >
                            <option value="">Pilih Dinas Tujuan...</option>
                            {dinasList.map(d => (
                              <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2 mb-6">
                          <button onClick={() => handleApprove(item.id)} disabled={loadingAction === `approve-${item.id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                            {loadingAction === `approve-${item.id}` ? "..." : <><Check className="w-4 h-4" /> Approve</>}
                          </button>
                          <button onClick={() => handleReject(item.id)} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 py-2.5 rounded-xl text-sm font-bold transition-all">
                            <X className="w-4 h-4" /> Reject
                          </button>
                          <button onClick={() => handleDeleteAspiration(item.id)} className="flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-all">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="px-4 py-2.5 rounded-xl text-sm font-bold bg-[#1A2642] text-slate-300 border border-[#2A3B61]">
                          Status: <span className={item.status === "Selesai" ? "text-emerald-400" : item.status === "Diteruskan ke Dinas" ? "text-blue-400" : "text-slate-400"}>{item.status}</span>
                        </div>
                        {(item.status === "Diteruskan ke Dinas" || item.status === "Selesai") && (
                          <button onClick={() => generatePDF(item)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
                            <Printer className="w-4 h-4" /> Cetak PDF
                          </button>
                        )}
                      </div>
                    )}

                    {/* Scores Section */}
                    <div className="flex items-center gap-2 mt-auto">
                      <div className="flex-1 bg-[#1A2642] rounded-xl p-3 border border-[#2A3B61]">
                        <p className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-400" /> Jarak</p>
                        <p className="text-2xl font-black text-white">{item.jarak}</p>
                      </div>
                      <div className="text-slate-500 font-bold">+</div>
                      <div className="flex-1 bg-[#1A2642] rounded-xl p-3 border border-[#2A3B61]">
                        <p className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-orange-400" /> Urgensi</p>
                        <p className="text-2xl font-black text-white">{item.urgensi}</p>
                      </div>
                      <div className="flex-[1.5] bg-blue-500 rounded-xl p-3 shadow-lg shadow-blue-500/20 ml-2">
                        <p className="text-xs text-blue-100 font-bold mb-1">Total Skor</p>
                        <p className="text-2xl font-black text-white">{totalScore}</p>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
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
