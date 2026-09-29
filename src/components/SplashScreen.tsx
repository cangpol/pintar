"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fading out almost immediately after mount
    const timer = setTimeout(() => {
      setFade(true); // Trigger opacity transition
      setTimeout(() => setShow(false), 500); // Remove from DOM after fade completes
    }, 100); // 100ms delay to ensure browser paints the initial state

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-900 transition-opacity duration-500 ease-out pointer-events-none ${
        fade ? 'opacity-0' : 'opacity-100'
      }`}
    />
  );
}
