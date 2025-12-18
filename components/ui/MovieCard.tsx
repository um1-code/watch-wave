// components/ui/MovieCard.tsx
"use client";

import { Plus, Check, Star } from "lucide-react";
import { useWatchlist } from "@/context/WatchlistContext";

export default function MovieCard({ movie, onClick }: { movie: any; onClick?: () => void }) {
  const { toggleWatchlist, toggleWatched, isInWatchlist, isWatched, watched } = useWatchlist();

  const inWatchlist = isInWatchlist(movie.id);
  const inWatched = isWatched(movie.id);
  const rating = Math.round(movie.vote_average / 2);

  const watchedMovie = watched.find((m) => m.id === movie.id);
  const hasNote = watchedMovie?.personalNote ? watchedMovie.personalNote.trim().length > 0 : false;

  return (
    // This div is the GROUP — hover only triggers on THIS card
    <div className="group/card relative w-full">
      <div
        className="relative overflow-hidden rounded-xl border border-white/10 bg-black/30 transition-all duration-500 group-hover/card:border-red-600/70 group-hover/card:shadow-2xl group-hover/card:shadow-red-600/30"
        onClick={onClick}
      >
        {/* Fixed poster ratio to prevent small images */}
        <div className="aspect-[2/3] relative">
          <img
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt={movie.title || movie.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover/card:brightness-30"
          />
        </div>

        {/* Note Badge */}
        {hasNote && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg pointer-events-none">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            NOTED
          </div>
        )}

        {/* HOVER OVERLAY — ONLY on this card */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex gap-6 mb-4 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(movie);
              }}
              className={`p-3 rounded-full border-2 backdrop-blur-sm transition-all ${
                inWatchlist
                  ? "bg-red-600 border-red-600 shadow-lg shadow-red-600/50"
                  : "bg-white/20 border-white/60 hover:bg-white/40"
              }`}
            >
              <Plus size={20} strokeWidth={3} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatched(movie);
              }}
              className={`p-3 rounded-full border-2 backdrop-blur-sm transition-all ${
                inWatched
                  ? "bg-green-600 border-green-600 shadow-lg shadow-green-600/50"
                  : "bg-white/20 border-white/60 hover:bg-white/40"
              }`}
            >
              <Check size={20} strokeWidth={3} />
            </button>
          </div>

          <p className="text-red-500 font-black uppercase tracking-widest text-sm pointer-events-none">
            {inWatched ? "EDIT NOTE" : "VIEW DETAILS"}
          </p>
        </div>
      </div>

      {/* Title & Rating */}
      <div className="mt-4 text-center pointer-events-none">
        <p className="font-bold text-sm truncate text-white group-hover/card:text-red-500 transition">
          {movie.title || movie.name}
        </p>
        <div className="flex justify-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < rating ? "#dc2626" : "none"}
              className={i < rating ? "text-red-600" : "text-white/30"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}