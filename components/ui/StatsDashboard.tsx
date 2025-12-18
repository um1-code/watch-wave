// components/ui/StatsDashboard.tsx
"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import { Film, Star, Clock } from "lucide-react";

export default function StatsDashboard() {
  const { watched } = useWatchlist();

  const total = watched.length;
  const avg = total > 0 ? (watched.reduce((sum, m) => sum + m.vote_average, 0) / total).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-3 gap-8 mb-16">
      <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/10">
        <Film size={32} className="mx-auto mb-4 text-red-600" />
        <p className="text-4xl font-black">{total}</p>
        <p className="text-white/60 uppercase tracking-wider text-sm mt-2">Movies Watched</p>
      </div>
      <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/10">
        <Star size={32} className="mx-auto mb-4 text-red-600" />
        <p className="text-4xl font-black">{avg}</p>
        <p className="text-white/60 uppercase tracking-wider text-sm mt-2">Average Rating</p>
      </div>
      <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/10">
        <Clock size={32} className="mx-auto mb-4 text-red-600" />
        <p className="text-4xl font-black">{total * 2}+</p>
        <p className="text-white/60 uppercase tracking-wider text-sm mt-2">Hours Watched</p>
      </div>
    </div>
  );
}