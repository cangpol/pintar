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
  time,
  category,
  status,
  initialUpvotes,
  comments: initialComments,
}: AspirationCardProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // Normalize initial comments to always be an array internally if we want to add to it,
  // or just handle the count. Let's just create an empty array if it's a number.
  const [comments, setComments] = useState<Comment[]>(
    Array.isArray(initialComments) ? initialComments : []
  );
  
  // Keep track of the initial number if it was just a count
  const baseCommentCount = Array.isArray(initialComments) ? 0 : initialComments;

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes((prev) => prev - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: "Anda (Warga)",
      text: commentText,
      time: "Baru saja"
    };
    
    setComments([...comments, newComment]);
    setCommentText("");
  };

  const config = statusConfig[status] || { icon: AlertCircle, color: "text-slate-600", bg: "bg-slate-50 border-slate-100", cardBorder: "border-slate-100 dark:border-slate-700/50" };
  const StatusIcon = config.icon;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate some dummy comments if none exist and baseCommentCount > 0
  const displayComments = comments.length > 0 ? comments : (baseCommentCount > 0 ? Array.from({ length: Math.min(baseCommentCount, 3) }).map((_, i) => ({
    id: `dummy-${i}`,
    author: "Warga Sekitar",
    text: "Semoga cepat ditangani oleh pihak berwenang.",
    time: "Beberapa saat lalu"
  })) : []);

  return (
    <>
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-teal-600 flex items-center justify-center shadow-sm">
            <span className="text-sm font-bold text-white">{author.charAt(0)}</span>
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{author}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${
              hasUpvoted ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? "fill-current" : ""}`} />
            <span>{upvotes}</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${
              isModalOpen ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <MessageSquare className={`w-4 h-4 ${isModalOpen ? "fill-current opacity-20" : ""}`} />
            <span>{baseCommentCount + comments.length}</span>
          </button>
        </div>
      </div>

      {/* Up to 3 Comments */}
      {displayComments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col gap-3">
          {displayComments.slice(0, 3).map(comment => (
            <div key={comment.id} className="flex gap-2">
              <div className="w-5 h-5 shrink-0 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center mt-0.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300">{comment.author.charAt(0)}</span>
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-xl rounded-tl-none p-2 border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{comment.author}</span>
                  <span className="text-[9px] font-medium text-slate-400">{comment.time}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{comment.text}</p>
              </div>
            </div>
          ))}
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline self-center mt-1"
          >
            Selengkapnya...
          </button>
        </div>
      )}
      
      {!displayComments.length && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 text-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Beri Komentar
          </button>
        </div>
      )}
    </div>

    {/* Detail Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-500" /> Detail Aspirasi
            </h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              &times;
            </button>
          </div>
          
          <div className="p-4 md:p-6 overflow-y-auto flex-1">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="font-bold text-slate-700 dark:text-slate-200">Pengirim: {author}</span>
                <span>•</span>
                <span>{time}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wider">{category}</span>
              </div>
            </div>

            <h4 className="font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Komentar ({baseCommentCount + comments.length})</h4>
            <div className="flex flex-col gap-4 mb-4">
              {displayComments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-300">{comment.author.charAt(0)}</span>
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-2xl rounded-tl-none p-3 border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{comment.author}</span>
                      <span className="text-[10px] font-medium text-slate-400">{comment.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
              {!displayComments.length && (
                <p className="text-sm text-center text-slate-500 py-2">Belum ada komentar. Jadilah yang pertama!</p>
              )}
            </div>
          </div>

          <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700">
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Tulis komentar..."
                className="flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white transition-all shadow-sm"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 text-white p-3 rounded-xl transition-colors shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
