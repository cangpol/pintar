import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Home, BarChart2, MessageCircle, LogIn, Bell } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PINTAR - Pusat Interaksi & Aspirasi Rakyat",
  description: "Platform pelaporan, usulan, dan aspirasi publik yang interaktif dan transparan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen relative flex flex-col`}>
        {/* Premium Floating Navbar */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none rounded-2xl md:rounded-full px-4 md:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 transition-all">
            
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <img src="/logo.png" alt="Logo PINTAR" className="h-10 md:h-12 w-auto object-contain" />
              </Link>
            </div>
            
            <div className="flex items-center space-x-1 md:space-x-2">
              <Link href="/" className="group flex items-center gap-2 px-4 py-2 rounded-full hover:bg-teal-50 dark:hover:bg-slate-800 transition-all">
                <Home className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-400">Beranda</span>
              </Link>
              <Link href="/aspirasi" className="group flex items-center gap-2 px-4 py-2 rounded-full hover:bg-teal-50 dark:hover:bg-slate-800 transition-all">
                <MessageCircle className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-400">Aspirasi</span>
              </Link>
              <Link href="/statistik" className="group flex items-center gap-2 px-4 py-2 rounded-full hover:bg-teal-50 dark:hover:bg-slate-800 transition-all">
                <BarChart2 className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-teal-700 dark:group-hover:text-teal-400">Statistik</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                <Bell className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:from-orange-500 hover:to-orange-600 transition-all shadow-md hover:shadow-lg hover:shadow-orange-500/20 active:scale-95">
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
              </button>
            </div>
          </div>
        </nav>
        
        {/* Animated Main Content Wrapper */}
        <main className="pt-28 md:pt-32 flex-1 animate-premium-reveal">{children}</main>

        {/* Global Footer */}
        <footer className="mt-auto py-8 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md animate-premium-reveal" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <img src="/logo.png" alt="Logo" className="h-6 w-auto opacity-50 grayscale" />
            </div>
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              Copyright &copy; 2026 TVRI JAWA TENGAH
            </p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
              By Maria Esfera
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
