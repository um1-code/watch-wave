// app/watchlist/page.tsx
"use client";

import MovieCard from "@/components/ui/MovieCard";
import StatsDashboard from "@/components/ui/StatsDashboard";
import { useWatchlist } from "@/context/WatchlistContext";

export default function WatchlistPage() {
  const { watched } = useWatchlist();

  return (
    <div className="p-10">
      <h1 className="text-4xl font-black uppercase mb-8">My Library</h1>
      <StatsDashboard />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {watched.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}