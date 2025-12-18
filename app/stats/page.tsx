"use client";
import { useWatchlist } from "@/context/WatchlistContext";

export default function StatsDashboard() {
  const { watched, watchlist } = useWatchlist();

  const stats = [
    { label: "MEDIA_COMPLETED", value: watched.length, color: "text-red-600" },
    { label: "PENDING_QUEUE", value: watchlist.length, color: "text-white/40" },
    { label: "SYSTEM_UPTIME", value: "99.2%", color: "text-white/40" },
  ];

  return (
    <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/[0.03] pb-16">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col gap-2">
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20">
            {stat.label}
          </span>
          <span className={`text-4xl font-black italic tracking-tighter ${stat.color}`}>
            {String(stat.value).padStart(2, '0')}
          </span>
        </div>
      ))}
    </div>
  );
}