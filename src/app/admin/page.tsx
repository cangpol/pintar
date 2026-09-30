"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, CheckCircle, Clock, Search, Filter, MoreVertical, LayoutDashboard, ShieldCheck, Download, Check, X, Printer, UserPlus, Settings, LogOut, Trash2 } from "lucide-react";
import jsPDF from "jspdf";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "aspirasi" | "users">("dashboard");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  // Modal State for CRUD User
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ email: "", password: "", name: "", role: "Operator Dinas", instansi: "", status: "Aktif" });

  const [aspirations, setAspirations] = useState([
    { id: "ASP-001", user: "Budi Santoso", category: "Infrastruktur", description: "Jalan berlubang parah di ruas jalan protokol depan pasar induk yang menyebabkan kecelakaan.", status: "Menunggu Approval", date: "Hari ini, 09:30", color: "text-orange-500 bg-orange-500/10" },
    { id: "ASP-002", user: "Siti Aminah", category: "Pelayanan Publik", description: "Antrean panjang dan pelayanan lambat di Disdukcapil kota.", status: "Selesai", date: "Kemarin, 14:15", color: "text-emerald-500 bg-emerald-500/10" },
    { id: "ASP-003", user: "Agus Pratama", category: "Lingkungan", description: "Sampah menumpuk tidak diangkut selama 4 hari di TPS dekat perumahan warga.", status: "Menunggu Approval", date: "28 Sep, 08:45", color: "text-orange-500 bg-orange-500/10" },
    { id: "ASP-004", user: "Dewi Lestari", category: "Fasilitas Umum", description: "Lampu penerangan jalan (PJU) mati total di sepanjang jalan merdeka barat.", status: "Diteruskan ke Dinas", date: "27 Sep, 16:20", color: "text-blue-500 bg-blue-500/10" },
  ]);

  useEffect(() => {
    const session = localStorage.getItem("pintar_session");
    if (!session) {
      router.push("/login");
      return;
    }
    setCurrentUser(JSON.parse(session));
    setUsers(JSON.parse(localStorage.getItem("pintar_users") || "[]"));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("pintar_session");
    router.push("/login");
  };

  // CRUD USER FUNCTIONS
  const handleOpenUserModal = (userId: string | null = null) => {
    if (userId) {
      const u = users.find(x => x.id === userId);
      if (u) {
        setUserForm(u);
        setEditingUserId(u.id);
      }
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
      const newId = `USR-00${users.length + 1}`;
      updatedUsers.push({ ...userForm, id: newId });
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

  const generatePDF = (aspiration: any) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("PINTAR - PUSAT INTERAKSI & ASPIRASI RAKYAT", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("TVRI Jawa Tengah", 105, 27, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SURAT PENGANTAR ASPIRASI MASYARAKAT", 105, 45, { align: "center" });
    
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
    doc.text(currentUser?.name || "Administrator", 140, 245);
    doc.text("PINTAR TVRI Jawa Tengah", 140, 252);
    
    doc.save(`Surat_Pengantar_Aspirasi_${aspiration.id}.pdf`);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative">
      
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
        
        {/* Only Super Admin can see User Management */}
        {currentUser.role === "Super Admin" && (
          <button 
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            <Users className="w-4 h-4" /> Manajemen User
          </button>
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
              { title: "Laporan Baru", value: "24", icon: FileText, gradient: "from-blue-400 to-blue-600", trend: "Menunggu Approval" },
              { title: "Total Diteruskan", value: "145", icon: Clock, gradient: "from-orange-400 to-orange-500", trend: "Sedang diproses dinas" },
              { title: "Tuntas/Selesai", value: "8.120", icon: CheckCircle, gradient: "from-emerald-400 to-emerald-600", trend: "Solusi ditemukan" },
              { title: "Total Pengguna", value: users.length, icon: Users, gradient: "from-teal-400 to-teal-600", trend: "Admin & Publik" },
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

      {/* ASPIRASI TAB */}
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
                        {item.status === "Menunggu Approval" && currentUser.role === "Super Admin" ? (
                          <>
                            <button onClick={() => handleApprove(item.id)} disabled={loadingAction === item.id} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/10 dark:hover:bg-emerald-500 rounded-lg transition-colors group relative" title="Setujui & Teruskan">
                              {loadingAction === item.id ? <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" /> : <Check className="w-5 h-5" />}
                            </button>
                            <button className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-500 rounded-lg transition-colors group relative" title="Tolak / Arsipkan">
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : item.status === "Diteruskan ke Dinas" || item.status === "Selesai" ? (
                          <button onClick={() => generatePDF(item)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-800 hover:text-white dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-xl transition-all text-xs font-bold" title="Export Pengantar ke Dinas (PDF)">
                            <Printer className="w-4 h-4" />
                            <span>Cetak PDF</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Menunggu Super Admin</span>
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

      {/* USER MANAGEMENT TAB (Super Admin Only) */}
      {activeTab === "users" && currentUser.role === "Super Admin" && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-premium-reveal relative">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-500" />
              Manajemen Hak Akses & Pengguna
            </h3>
            <button onClick={() => handleOpenUserModal(null)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-teal-700 transition-colors shadow-md">
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
                      <p className="text-xs text-slate-400">{item.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{item.role}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{item.instansi}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'Aktif' ? 'text-teal-600 bg-teal-50 dark:bg-teal-500/10 dark:text-teal-400' : 'text-slate-500 bg-slate-100 dark:bg-slate-700 dark:text-slate-400'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenUserModal(item.id)} className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
                          <Settings className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteUser(item.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD User Modal Overlay */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 animate-premium-reveal">
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
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Role / Peran</label>
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
                <input required type="text" value={userForm.instansi} onChange={e => setUserForm({...userForm, instansi: e.target.value})} placeholder="Contoh: Dinas PU" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700 mt-6">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Batal</button>
                <button type="submit" className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-md">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
