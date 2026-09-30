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

const statusConfig: Record<string, { icon: any, color: string, bg: string }> = {
  "Menunggu Approval": { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50 border-red-100" },
  "Diteruskan ke Dinas": { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  "Diproses": { icon: Clock, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  "Selesai": { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  "Ditolak/Arsip": { icon: AlertCircle, color: "text-slate-600", bg: "bg-slate-50 border-slate-100" }
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
  const [showComments, setShowComments] = useState(false);
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

  const config = statusConfig[status] || { icon: AlertCircle, color: "text-slate-600", bg: "bg-slate-50 border-slate-100" };
  const StatusIcon = config.icon;

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-all duration-300 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 group">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              {category}
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{time}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {title}
          </h3>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.bg} dark:bg-transparent dark:border-current`}>
          <StatusIcon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-xs font-bold ${config.color}`}>{status}</span>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
        {description}
      </p>

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
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${
              showComments ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <MessageSquare className={`w-4 h-4 ${showComments ? "fill-current opacity-20" : ""}`} />
            <span>{baseCommentCount + comments.length}</span>
          </button>
        </div>
      </div>

      {/* Expandable Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-4 mb-4">
            {baseCommentCount > 0 && comments.length === 0 && (
               <p className="text-sm text-center text-slate-500 py-2">Ada {baseCommentCount} komentar terdahulu (Data disembunyikan dalam mode demo).</p>
            )}
            {comments.length > 0 ? comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-6 h-6 shrink-0 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-300">{comment.author.charAt(0)}</span>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-2xl rounded-tl-none p-3 border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{comment.author}</span>
                    <span className="text-[10px] font-medium text-slate-400">{comment.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-center text-slate-500 py-2">Belum ada komentar. Jadilah yang pertama!</p>
            )}
          </div>
          
          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tulis komentar..."
              className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white transition-all"
            />
            <button 
              type="submit"
              disabled={!commentText.trim()}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 text-white p-2.5 rounded-xl transition-colors active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
