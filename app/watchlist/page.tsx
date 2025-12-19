"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import MovieCard from "@/components/ui/MovieCard";
import { useWatchlist } from "@/context/WatchlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, updateNote } = useWatchlist();
  const [selected, setSelected] = useState<any>(null);
  const [note, setNote] = useState("");

  const openMovie = (movie: any) => {
    setSelected(movie);
    setNote(movie.note || "");
  };

  const saveNote = () => {
    updateNote(selected.id, note);
  };

  return (
    <div className="grid grid-cols-[280px_1fr] h-screen bg-[#050505] text-white">
      <Sidebar currentView="watchlist" onViewChange={() => {}} />

      <main className="p-12 overflow-y-auto">
        <h1 className="text-5xl font-black uppercase tracking-wider mb-10 text-red-600">
          My Watchlist
        </h1>

        {watchlist.length === 0 && (
          <p className="text-white/40 text-xl">Your watchlist is empty.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => openMovie(movie)}
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
              className="bg-[#0a0a0a] max-w-4xl w-full rounded-3xl border border-white/20 overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 bg-black/70 p-3 rounded-full"
              >
                <X />
              </button>

              <div className="grid md:grid-cols-2">
                <img
                  src={`https://image.tmdb.org/t/p/w780${selected.poster_path}`}
                  className="w-full h-full object-cover"
                />

                <div className="p-10">
                  <h2 className="text-4xl font-black uppercase mb-4">
                    {selected.title || selected.name}
                  </h2>

                  <p className="text-white/60 italic mb-6">
                    {selected.overview}
                  </p>

                  {/* NOTE EDITOR */}
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a personal note..."
                    className="w-full min-h-[140px] bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:outline-none"
                  />

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={saveNote}
                      className="bg-red-600 px-8 py-4 rounded-full font-black uppercase"
                    >
                      Save Note
                    </button>

                    <button
                      onClick={() => {
                        removeFromWatchlist(selected.id);
                        setSelected(null);
                      }}
                      className="bg-white/10 px-8 py-4 rounded-full font-black uppercase"
                    >
                      Remove
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
