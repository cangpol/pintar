"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

// Default seed users if none exist in localStorage
const defaultUsers = [
  { id: "USR-001", email: "admin@tvri.co.id", password: "123", name: "Budi (Admin)", role: "Super Admin", instansi: "TVRI Jawa Tengah", status: "Aktif" },
  { id: "USR-002", email: "operator@dinas.go.id", password: "123", name: "Agus (Operator)", role: "Operator Dinas", instansi: "Dinas Pekerjaan Umum", status: "Aktif" },
  { id: "USR-003", email: "peninjau@tvri.co.id", password: "123", name: "Siti (Peninjau)", role: "Peninjau", instansi: "TVRI Jawa Tengah", status: "Aktif" },
];

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Seed users on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("pintar_users");
    if (!storedUsers) {
      localStorage.setItem("pintar_users", JSON.stringify(defaultUsers));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem("pintar_users") || "[]");
      const user = storedUsers.find((u: any) => u.email === email && u.password === password);

      if (user) {
        if (user.status !== "Aktif") {
          setError("Akun Anda dinonaktifkan. Hubungi Super Admin.");
          setIsLoading(false);
          return;
        }
        // Save session
        localStorage.setItem("pintar_session", JSON.stringify(user));
        router.push("/admin");
      } else {
        setError("Email atau Password salah!");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-4">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 animate-premium-reveal">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 rounded-3xl shadow-2xl p-8 md:p-10">
          
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <img src="/logo.png" alt="Logo PINTAR" className="h-12 w-auto mx-auto object-contain" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
              Masuk ke dasbor PINTAR untuk mengelola aspirasi.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Email / NIP
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tvri.co.id"
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Kata Sandi
                </label>
                <Link href="#" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">
                  Lupa Sandi?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="123"
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Dasbor</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
          


          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-4 h-4" />
            <span>Sistem Terenkripsi & Terlindungi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
