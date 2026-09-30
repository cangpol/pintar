"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, LayoutDashboard } from "lucide-react";

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem("pintar_session");
    if (session) {
      setIsLoggedIn(true);
    }
  }, []);

  if (isLoggedIn) {
    return (
      <Link href="/admin" className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white p-2.5 md:px-5 md:py-2.5 rounded-full text-sm font-bold hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg hover:shadow-teal-500/20 active:scale-95">
        <LayoutDashboard className="w-5 h-5 md:w-4 md:h-4" />
        <span className="hidden md:block">Dashboard</span>
      </Link>
    );
  }

  return (
    <Link href="/login" className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white p-2.5 md:px-5 md:py-2.5 rounded-full text-sm font-bold hover:from-orange-500 hover:to-orange-600 transition-all shadow-md hover:shadow-lg hover:shadow-orange-500/20 active:scale-95">
      <LogIn className="w-5 h-5 md:w-4 md:h-4" />
      <span className="hidden md:block">Masuk</span>
    </Link>
  );
}
