"use client";
import { useState } from "react";
import { useWatchlist } from "@/context/WatchlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Check, Clock } from "lucide-react";

// Mock components - replace with your actual imports
const Sidebar = ({ currentView, onViewChange }: any) => (
  <div className="bg-black/50 border-r border-white/10 p-6">
    <h2 className="text-2xl font-black mb-6">CINEMAVAULT</h2>
    <div className="space-y-2">
      <div className="text-white/60 text-sm font-bold">MENU</div>
    </div>
  </div>
);

const MovieCard = ({ movie, onClick, badge }: any) => (
  <div
    onClick={onClick}
    className="cursor-pointer group relative overflow-hidden rounded-2xl"
  >
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title || movie.name}
      className="w-full aspect-[2/3] object-cover transition-transform group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
      <p className="text-white font-bold text-sm">{movie.title || movie.name}</p>
    </div>
    {badge && (
      <div className="absolute top-2 right-2 bg-red-600 p-2 rounded-full">
        {badge}
      </div>
    )}
  </div>
);

export default function WatchlistPage() {
  const {
    watchlist,
    watched,
    toggleWatchlist,
    toggleWatched,
    isInWatchlist,
    isWatched,
    updateNote,
  } = useWatchlist();

  const [selected, setSelected] = useState<any>(null);
  const [note, setNote] = useState("");
  const [activeTab, setActiveTab] = useState<"watchlist" | "watched">("watchlist");
  const [sortBy, setSortBy] = useState<"date" | "rating" | "alpha">("date");

  const openMovie = (movie: any) => {
    setSelected(movie);
    setNote(movie.personalNote || "");
  };

  const saveNote = () => {
    if (!selected) return;
    updateNote(selected.id, note);
    setSelected({ ...selected, personalNote: note });
  };

  const handleToggleStatus = () => {
    if (!selected) return;
    
    if (isWatched(selected.id)) {
      toggleWatched(selected);
    } else if (isInWatchlist(selected.id)) {
      // Move from watchlist to watched
      toggleWatched(selected);
    } else {
      // Add to watchlist
      toggleWatchlist(selected);
    }
  };

  const handleRemove = () => {
    if (!selected) return;
    
    if (isWatched(selected.id)) {
      toggleWatched(selected);
    } else if (isInWatchlist(selected.id)) {
      toggleWatchlist(selected);
    }
    
    setSelected(null);
  };

  // Sort function
  const sortMovies = (movies: any[]) => {
    const sorted = [...movies];
    
    if (sortBy === "alpha") {
      return sorted.sort((a, b) => 
        (a.title || a.name || "").localeCompare(b.title || b.name || "")
      );
    }
    
    if (sortBy === "rating") {
      return sorted.sort((a, b) => 
        (b.vote_average || 0) - (a.vote_average || 0)
      );
    }
    
    // Default: keep original order (date added)
    return sorted.reverse();
  };

  const currentList = activeTab === "watchlist" ? watchlist : watched;
  const sortedList = sortMovies(currentList);

  return (
    <div className="grid grid-cols-[280px_1fr] h-screen bg-[#050505] text-white">
      <Sidebar currentView="watchlist" onViewChange={() => {}} />

      <main className="p-12 overflow-y-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-5xl font-black uppercase tracking-wider text-red-600">
            My Collection
          </h1>

          {/* SORT */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-red-600 transition-colors"
          >
            <option value="date">Recently Added</option>
            <option value="rating">Highest Rated</option>
            <option value="alpha">A-Z</option>
          </select>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`px-6 py-3 font-bold uppercase transition-colors flex items-center gap-2 ${
              activeTab === "watchlist"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Clock size={20} />
            Want to Watch ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab("watched")}
            className={`px-6 py-3 font-bold uppercase transition-colors flex items-center gap-2 ${
              activeTab === "watched"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Check size={20} />
            Watched ({watched.length})
          </button>
        </div>

        {/* EMPTY STATE */}
        {sortedList.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 text-xl mb-4">
              {activeTab === "watchlist"
                ? "Your watchlist is empty."
                : "You haven't watched any movies yet."}
            </p>
            <p className="text-white/30 text-sm">
              Start adding movies from the search page!
            </p>
          </div>
        )}

        {/* MOVIE GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {sortedList.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => openMovie(movie)}
              badge={
                activeTab === "watched" && movie.vote_average ? (
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                ) : null
              }
            />
          ))}
        </div>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-[#0a0a0a] max-w-4xl w-full rounded-3xl border border-white/20 overflow-hidden relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 bg-black/70 p-3 rounded-full z-10 hover:bg-black transition-colors"
              >
                <X />
              </button>

              <div className="grid md:grid-cols-2">
                {/* POSTER */}
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w780${selected.poster_path}`}
                    alt={selected.title || selected.name}
                    className="w-full h-full object-cover"
                  />
                  {selected.vote_average && (
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                      <Star size={20} className="fill-yellow-500 text-yellow-500" />
                      <span className="font-black text-xl">
                        {selected.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* DETAILS */}
                <div className="p-10 flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-4xl font-black uppercase mb-4 leading-tight">
                      {selected.title || selected.name}
                    </h2>

                    {/* STATUS BADGES */}
                    <div className="flex gap-2 mb-6">
                      {isInWatchlist(selected.id) && (
                        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Clock size={14} />
                          WATCHLIST
                        </span>
                      )}
                      {isWatched(selected.id) && (
                        <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Check size={14} />
                          WATCHED
                        </span>
                      )}
                    </div>

                    {/* NOTES (only for watched movies) */}
                    {isWatched(selected.id) && (
                      <div className="mb-6">
                        <label className="block text-sm font-bold mb-2 text-white/70 uppercase tracking-wide">
                          Your Notes
                        </label>
                        <textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="What did you think about this movie?"
                          className="w-full min-h-[140px] bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-red-600 focus:bg-white/10 transition-all resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="space-y-3">
                    {isWatched(selected.id) && (
                      <button
                        onClick={saveNote}
                        className="w-full bg-red-600 px-8 py-4 rounded-full font-black uppercase hover:bg-red-700 transition-colors"
                      >
                        Save Notes
                      </button>
                    )}

                    {isInWatchlist(selected.id) && !isWatched(selected.id) && (
                      <button
                        onClick={handleToggleStatus}
                        className="w-full bg-green-600 px-8 py-4 rounded-full font-black uppercase hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Check size={20} />
                        Mark as Watched
                      </button>
                    )}

                    <button
                      onClick={handleRemove}
                      className="w-full bg-white/10 px-8 py-4 rounded-full font-black uppercase hover:bg-white/20 transition-colors"
                    >
                      Remove from {isWatched(selected.id) ? "Library" : "Watchlist"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}