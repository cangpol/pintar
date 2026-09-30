"use client";

import { useState } from "react";
import { ThumbsUp, MessageSquare, Clock, CheckCircle2, AlertCircle, Send, MoreHorizontal } from "lucide-react";

export type AspirationStatus = "Menunggu" | "Diproses" | "Selesai";

export interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface AspirationCardProps {
  id: string;
  title: string;
  description: string;
  author: string;
  address?: string;
  phone?: string;
  time: string;
  category: string;
  status: string;
  initialUpvotes: number;
  comments: number | Comment[];
}

const statusConfig: Record<string, { icon: any, color: string, bg: string, cardBorder: string }> = {
  "Menunggu Approval": { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50 border-red-100", cardBorder: "border-red-200 dark:border-red-900/50" },
  "Diteruskan ke Dinas": { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-100", cardBorder: "border-amber-200 dark:border-amber-900/50" },
  "Diproses": { icon: Clock, color: "text-blue-600", bg: "bg-blue-50 border-blue-100", cardBorder: "border-blue-200 dark:border-blue-900/50" },
  "Selesai": { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", cardBorder: "border-emerald-200 dark:border-emerald-900/50" },
  "Ditolak/Arsip": { icon: AlertCircle, color: "text-slate-600", bg: "bg-slate-50 border-slate-100", cardBorder: "border-slate-200 dark:border-slate-700" }
};

export default function AspirationCard({
  title,
  description,
  author,
  address,
  phone,
  time,
  category,
  status,
  initialUpvotes,
  comments: initialComments,
}: AspirationCardProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes((prev) => prev - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    }
  };

  const config = statusConfig[status] || { icon: AlertCircle, color: "text-slate-600", bg: "bg-slate-50 border-slate-100", cardBorder: "border-slate-100 dark:border-slate-700/50" };
  const StatusIcon = config.icon;

  return (
    <div className={`bg-white dark:bg-slate-800/80 rounded-2xl p-6 shadow-sm border ${config.cardBorder} transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500 group flex flex-col h-full`}>
      <div className="flex-1">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex flex-col items-start gap-1">
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              {category}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 pl-0.5">{time}</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded border ${config.bg} dark:bg-transparent dark:border-current`}>
            <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
            <span className={`text-[10px] font-bold ${config.color} uppercase tracking-wider`}>{status}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100/60 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-teal-600 flex items-center justify-center shadow-sm shrink-0">
            <span className="text-sm font-bold text-white">{author.charAt(0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{author}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{address || "Alamat tidak tersedia"}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{phone || "No HP tidak tersedia"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${
              hasUpvoted ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? "fill-current" : ""}`} />
            <span>{upvotes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
