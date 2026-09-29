"use client";

import { Check, Clock, AlertCircle } from "lucide-react";

interface Step {
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

export default function ProgressTracker({ steps }: { steps: Step[] }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mt-8 relative overflow-hidden">
      
      {/* Premium Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-1">Status Laporan</h3>
          <p className="text-sm text-slate-500 font-medium">#REP-84920</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Sedang Diproses</span>
        </div>
      </div>

      <div className="relative">
        {/* Animated Connecting Line */}
        <div className="absolute left-[19px] top-4 bottom-8 w-[2px] bg-slate-100 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-teal-500 to-transparent" />
        </div>

        <div className="flex flex-col gap-6">
          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            
            return (
              <div key={index} className="relative z-10 flex gap-5 group">
                {/* Node Icon */}
                <div className="flex-none pt-1">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted 
                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30" 
                        : isCurrent 
                          ? "bg-white border-2 border-teal-500 text-teal-600 shadow-[0_0_0_4px_rgba(20,184,166,0.1)] relative" 
                          : "bg-white border-2 border-slate-200 text-slate-300"
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute w-10 h-10 rounded-full border-2 border-teal-500 animate-ping opacity-30" />
                    )}
                    {isCompleted ? <Check className="w-5 h-5 font-bold" /> : <span className="text-sm font-bold">{index + 1}</span>}
                  </div>
                </div>
                
                {/* Content */}
                <div className={`flex-1 pt-1.5 pb-2 transition-opacity duration-300 ${isCompleted || isCurrent ? "opacity-100" : "opacity-40"}`}>
                  <h4 className={`text-base font-bold mb-1 ${isCurrent ? "text-teal-700" : isCompleted ? "text-slate-900" : "text-slate-600"}`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-3 bg-slate-50/50 p-4 rounded-xl">
        <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs font-medium text-slate-500 leading-relaxed">
          Notifikasi perkembangan akan dikirim ke email Anda. Tim kami berusaha menyelesaikan laporan ini secepatnya.
        </p>
      </div>
    </div>
  );
}
