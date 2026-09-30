"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, CheckCircle, Clock, LayoutDashboard, Check, X, Printer, UserPlus, Settings, LogOut, Trash2, Building2, Plus, Trophy, MapPin, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
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

  const [aspirations, setAspirations] = useState<any[]>([]);

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

    const storedAsp = localStorage.getItem("pintar_aspirations");
    if (storedAsp) {
      setAspirations(JSON.parse(storedAsp));
    } else {
      setAspirations(MOCK_ASPIRATIONS_DATA);
      localStorage.setItem("pintar_aspirations", JSON.stringify(MOCK_ASPIRATIONS_DATA));
    }
  }, [router]);

  useEffect(() => {
    if (aspirations.length > 0) {
      localStorage.setItem("pintar_aspirations", JSON.stringify(aspirations));
    }
  }, [aspirations]);

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

  const handleUpdateUrgensi = (id: string, newUrgensi: number) => {
    setAspirations(prev => prev.map(a => 
      a.id === id ? { ...a, urgensi: newUrgensi } : a
    ));
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
    doc.text(`Prioritas SPK: Urgensi (${aspiration.urgensi}) | Jarak Lokasi (${aspiration.jarak} km)`, 20, 91);
    
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

  const [aspirasiStatusFilter, setAspirasiStatusFilter] = useState<"aktif" | "arsip">("aktif");
  const [editingUrgensi, setEditingUrgensi] = useState<Record<string, number>>({});
  const [currentPageAspirasi, setCurrentPageAspirasi] = useState(1);
  const itemsPerPageAspirasi = 3;
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  if (!currentUser) return null;

  const handleTabClick = (tab: string) => {
    // Ultimate Super Admin check
    const isUltimate = currentUser.email === "mariaesfera@pintar.com";
    if ((tab === "users" || tab === "dinas") && !isUltimate) {
      setShowSubscriptionModal(true);
      return;
    }
    setActiveTab(tab);
  };

  const filteredByStatusAspirations = aspirations.filter(a => 
    aspirasiStatusFilter === "aktif" 
      ? (a.status !== "Selesai" && a.status !== "Ditolak/Arsip") 
      : (a.status === "Selesai" || a.status === "Ditolak/Arsip")
  );

  const sortedAspirations = [...filteredByStatusAspirations].sort((a,b) => {
    if (aspirasiStatusFilter === "aktif") {
      return b.urgensi - a.urgensi;
    }
    // For arsip, sort by newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPagesAspirasi = Math.ceil(sortedAspirations.length / itemsPerPageAspirasi);
  const currentAdminAspirations = sortedAspirations.slice(
    (currentPageAspirasi - 1) * itemsPerPageAspirasi,
    currentPageAspirasi * itemsPerPageAspirasi
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPageAspirasi(1);
  }, [aspirasiStatusFilter]);

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
        <button onClick={() => handleTabClick("dashboard")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'}`}>
          <LayoutDashboard className="w-4 h-4" /> Overview Dashboard
        </button>
        <button onClick={() => handleTabClick("aspirasi")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'aspirasi' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'}`}>
          <CheckCircle className="w-4 h-4" /> Approval & Aspirasi
        </button>
        <button onClick={() => handleTabClick("users")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'}`}>
          <Users className="w-4 h-4" /> Manajemen User
        </button>
        <button onClick={() => handleTabClick("dinas")} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dinas' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'}`}>
          <Building2 className="w-4 h-4" /> Kategori Dinas
        </button>
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

          {/* Monthly Trend Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 mb-10 animate-premium-reveal">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-teal-500" /> Grafik Tren Bulanan
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Statistik aspirasi berdasarkan status setiap bulannya
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500"></div> Menunggu</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-orange-500"></div> Diteruskan</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500"></div> Selesai</div>
              </div>
            </div>

            <div className="h-64 flex items-end gap-2 sm:gap-4 md:gap-8 justify-between relative mt-4 pt-10">
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 dark:opacity-10">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="w-full border-t border-slate-400 border-dashed"></div>
                ))}
              </div>
              
              {/* Chart Bars */}
              {[
                { month: "Jan", menunggu: 12, diteruskan: 18, selesai: 20 },
                { month: "Feb", menunggu: 15, diteruskan: 12, selesai: 28 },
                { month: "Mar", menunggu: 8, diteruskan: 25, selesai: 35 },
                { month: "Apr", menunggu: 20, diteruskan: 15, selesai: 40 },
                { month: "Mei", menunggu: 25, diteruskan: 30, selesai: 45 },
                { month: "Jun", menunggu: 10, diteruskan: 20, selesai: 50 },
              ].map((data, i) => {
                const total = data.menunggu + data.diteruskan + data.selesai;
                const hMenunggu = (data.menunggu / 100) * 100; // max ~100
                const hDiteruskan = (data.diteruskan / 100) * 100;
                const hSelesai = (data.selesai / 100) * 100;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group z-10">
                    <div className="w-full max-w-[40px] h-full flex flex-col-reverse justify-start rounded-t-lg overflow-hidden bg-slate-100 dark:bg-slate-700/30 group-hover:bg-slate-200 dark:group-hover:bg-slate-700/50 transition-colors relative">
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                        Total: {total}
                      </div>
                      
                      <div style={{ height: `${hSelesai}%` }} className="bg-emerald-500 w-full transition-all duration-700 hover:brightness-110"></div>
                      <div style={{ height: `${hDiteruskan}%` }} className="bg-orange-500 w-full transition-all duration-700 hover:brightness-110"></div>
                      <div style={{ height: `${hMenunggu}%` }} className="bg-blue-500 w-full transition-all duration-700 hover:brightness-110"></div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ASPIRASI TAB (Rich Cards) */}
      {activeTab === "aspirasi" && (
        <div className="flex flex-col gap-6 animate-premium-reveal">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-2 shadow-sm gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-500" />
              <h2 className="text-xl font-bold text-white">
                {aspirasiStatusFilter === "aktif" ? "Daftar Aspirasi Masuk" : "Arsip Aspirasi (Selesai/Ditolak)"}
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex bg-[#1A2642] p-1 rounded-xl border border-[#2A3B61] w-full sm:w-auto">
                <button 
                  onClick={() => setAspirasiStatusFilter("aktif")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${aspirasiStatusFilter === "aktif" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Aktif
                </button>
                <button 
                  onClick={() => setAspirasiStatusFilter("arsip")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${aspirasiStatusFilter === "arsip" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Arsip
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-slate-400 hidden sm:block">Urutkan:</span>
                <select className="bg-[#1A2642] border border-[#2A3B61] text-white text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto">
                  <option>Urgensi (Tertinggi)</option>
                  <option>Terbaru</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {currentAdminAspirations.map((item, index) => {
              const globalIndex = (currentPageAspirasi - 1) * itemsPerPageAspirasi + index;
              
              return (
                <div key={item.id} className="flex flex-col lg:flex-row bg-[#0B152B] border border-[#1A2642] rounded-3xl overflow-hidden shadow-2xl relative text-white">
                  
                  {/* Left Section: Info */}
                  <div className="flex-1 p-6 lg:p-8 flex items-start gap-4 lg:gap-6 border-b lg:border-b-0 lg:border-r border-[#1A2642]">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20">
                      {globalIndex + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#1A2642] text-slate-300 text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full border border-slate-700">
                          {item.category}
                        </span>
                        <span className="text-xs font-medium text-slate-500">• {item.time}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 leading-snug">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.description}</p>
                      
                      {/* Submitter Info */}
                      <div className="bg-[#1A2642] p-4 rounded-xl border border-[#2A3B61] mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-slate-400 w-16">Pengirim:</span>
                          <span className="text-sm font-bold text-slate-200">{item.author}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-slate-400 w-16">Telepon:</span>
                          <span className="text-sm font-bold text-slate-200">{item.phone || "-"}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-slate-400 w-16 mt-0.5">Alamat:</span>
                          <span className="text-sm font-bold text-slate-200 flex-1">{item.address || "-"}</span>
                        </div>
                      </div>
                      
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
                    
                    {aspirasiStatusFilter === "aktif" && (
                      <div className="absolute right-6 top-8 text-center hidden md:block">
                        <Trophy className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                        <p className="text-xs text-slate-400 font-bold">Ranking</p>
                        <p className="text-3xl font-black text-white">#{globalIndex + 1}</p>
                      </div>
                    )}

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
                    <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto">
                      <div className="flex-1 w-full bg-[#1A2642] rounded-xl p-3 border border-[#2A3B61]">
                        <p className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-400" /> Jarak ke TVRI</p>
                        <p className="text-xl font-black text-white">{item.jarak} km</p>
                      </div>
                      
                      <div className="flex-[1.5] w-full bg-orange-500/10 rounded-xl p-3 border border-orange-500/20 shadow-lg shadow-orange-500/5">
                        <p className="text-xs text-orange-400 font-bold mb-1 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Urgensi</p>
                        {currentUser.role === "Super Admin" ? (
                           <div className="flex items-center gap-2">
                             <input 
                               type="number" 
                               value={editingUrgensi[item.id] !== undefined ? editingUrgensi[item.id] : item.urgensi}
                               onChange={(e) => setEditingUrgensi({...editingUrgensi, [item.id]: Number(e.target.value)})}
                               className="w-16 bg-[#0B152B] border border-orange-500/50 text-white font-black text-xl px-2 py-1 rounded outline-none focus:ring-2 focus:ring-orange-500"
                               min="0" max="100"
                             />
                             <span className="text-xs text-orange-400 hidden lg:inline">/ 100</span>
                             {editingUrgensi[item.id] !== undefined && editingUrgensi[item.id] !== item.urgensi && (
                               <button 
                                 onClick={() => {
                                   handleUpdateUrgensi(item.id, editingUrgensi[item.id]);
                                   const newEditing = { ...editingUrgensi };
                                   delete newEditing[item.id];
                                   setEditingUrgensi(newEditing);
                                 }}
                                 className="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-orange-500/20"
                               >
                                 <Check className="w-3.5 h-3.5" /> Confirm
                               </button>
                             )}
                           </div>
                        ) : (
                          <p className="text-xl font-black text-white">{item.urgensi} <span className="text-xs font-normal text-slate-400">/ 100</span></p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPagesAspirasi > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button 
                onClick={() => setCurrentPageAspirasi(p => Math.max(1, p - 1))}
                disabled={currentPageAspirasi === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-sm font-bold text-slate-400">
                Halaman {currentPageAspirasi} dari {totalPagesAspirasi}
              </div>
              
              <button 
                onClick={() => setCurrentPageAspirasi(p => Math.min(totalPagesAspirasi, p + 1))}
                disabled={currentPageAspirasi === totalPagesAspirasi}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
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
      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Fitur Premium</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed text-sm">
              Akun admin Anda saat ini hanya memiliki akses ke fitur dasar. Jika ingin memiliki program ini sepenuhnya beserta seluruh fitur manajemen, Anda dapat beralih ke paket langganan (subscription) atau dapat menghubungi <strong className="text-amber-600 dark:text-amber-400">Maria Esfera</strong>.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowSubscriptionModal(false)}
                className="w-full py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
