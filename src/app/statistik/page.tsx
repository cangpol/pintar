import { BarChart3, TrendingUp, Users, CheckCircle, Clock, LayoutDashboard, Activity } from "lucide-react";

export default function StatistikPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative bg-slate-900 pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[3rem] shadow-2xl shadow-teal-900/10 mb-12">
        <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10 animate-premium-reveal" style={{ animationFillMode: 'both' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-teal-300 text-sm font-bold mb-6 backdrop-blur-md">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Transparansi Publik</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Statistik & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">Kinerja.</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Pantau secara langsung kinerja kami dalam menyelesaikan setiap pelaporan dan aspirasi masyarakat untuk mewujudkan lingkungan yang lebih baik.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-24 relative z-20">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-premium-reveal" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
          {[
            { title: "Total Aspirasi", value: "8.459", icon: Users, gradient: "from-teal-400 to-teal-600" },
            { title: "Selesai", value: "6.120", icon: CheckCircle, gradient: "from-emerald-400 to-emerald-600" },
            { title: "Diproses", value: "1.204", icon: Activity, gradient: "from-orange-400 to-orange-500" },
            { title: "Rata-rata Respon", value: "3 Mnt", icon: Clock, gradient: "from-blue-400 to-blue-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-2 transition-transform duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform relative z-10`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="relative z-10">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mt-1 tracking-wider">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden animate-premium-reveal" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-2xl -z-10" />
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Kategori Terbanyak</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Berdasarkan laporan bulan ini</p>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <div className="space-y-6">
              {[
                { label: "Infrastruktur", percent: 45, color: "bg-teal-500" },
                { label: "Fasilitas Umum", percent: 25, color: "bg-orange-500" },
                { label: "Lingkungan", percent: 20, color: "bg-emerald-500" },
                { label: "Pelayanan Publik", percent: 10, color: "bg-blue-500" },
              ].map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <span>{cat.label}</span>
                    <span>{cat.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                    <div className={`${cat.color} h-3 rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-center min-h-[350px] text-center relative overflow-hidden group animate-premium-reveal" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-500/5 to-teal-500/5 dark:from-orange-500/5 dark:to-teal-500/5 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
              <TrendingUp className="w-10 h-10 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Grafik Tren Bulanan</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
              Area ini disiapkan untuk integrasi grafik visual menggunakan Chart.js atau Recharts untuk menampilkan pertumbuhan penyelesaian laporan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
