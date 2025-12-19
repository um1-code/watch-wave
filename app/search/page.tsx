"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieCard from "@/components/ui/MovieCard";
import Sidebar from "@/components/ui/Sidebar";
import { useWatchlist } from "@/context/WatchlistContext";
import { Search as SearchIcon, Loader2, X, Star } from "lucide-react";

const BACKEND_URL = "https://watch-wave-5es6.onrender.com";

export default function SearchPage() {
  const { toast, setToast } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  // Search with debounce
useEffect(() => {
  if (!searchQuery.trim()) {
    setSearchResults([]);
    return;
  }

  const timer = setTimeout(async () => {
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=97ca10f5cde769f2a4954342ecad7b02&query=${encodeURIComponent(
          searchQuery
        )}&include_adult=false&language=en-US&page=1`
      );

      if (!res.ok) throw new Error("TMDB search failed");

      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
      setToast({ msg: "Search failed", type: "info" });
    } finally {
      setIsSearching(false);
    }
  }, 600);

  return () => clearTimeout(timer);
}, [searchQuery]);


  // Add to watchlist
  const handleAddToWatchlist = async (movie: any) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/watchlist/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tmdb_id: movie.id,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          overview: movie.overview,
          release_date: movie.release_date || movie.first_air_date,
        }),
      });

      if (res.ok) {
        toggleWatchlist(movie);
        setToast({ msg: "Added to Watchlist!", type: "success" });
      } else {
        setToast({ msg: "Already in watchlist or error", type: "info" });
      }
    } catch (err) {
      setToast({ msg: "Network error", type: "info" });
    }
  };

  return (
    <div className="grid grid-cols-[280px_1fr] h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar currentView="search" onViewChange={() => {}} />

      <main className="overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 px-12 py-6">
          <h1 className="text-5xl font-black uppercase tracking-wider text-red-600 mb-6">
            Search Movies & Shows
          </h1>

          {/* Search Bar */}
          <div className="relative w-full max-w-3xl">
            {isSearching ? (
              <Loader2
                className="absolute left-6 top-1/2 -translate-y-1/2 animate-spin text-red-600"
                size={24}
              />
            ) : (
              <SearchIcon
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40"
                size={24}
              />
            )}
            <input
              type="text"
              placeholder="Search for movies, TV shows, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-white/10 border border-white/20 rounded-full pl-16 pr-8 py-6 text-xl text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </header>

        <div className="p-12">
          {/* Empty State */}
          {!searchQuery && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <SearchIcon size={100} className="text-white/20 mb-8" strokeWidth={1} />
              <h2 className="text-4xl font-black uppercase tracking-wider text-white/60 mb-4">
                Start Searching
              </h2>
              <p className="text-xl text-white/40 max-w-md">
                Enter a movie title, TV show, or actor name to discover amazing content
              </p>
            </div>
          )}

          {/* Searching State */}
          {isSearching && (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <Loader2 size={80} className="text-red-600 animate-spin mb-6" />
              <p className="text-2xl font-black uppercase tracking-wider text-white/60">
                Searching...
              </p>
            </div>
          )}

          {/* No Results */}
          {searchQuery && !isSearching && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <X size={100} className="text-red-600/40 mb-8" strokeWidth={1} />
              <h2 className="text-4xl font-black uppercase tracking-wider text-white/60 mb-4">
                No Results Found
              </h2>
              <p className="text-xl text-white/40 max-w-md">
                Try searching with different keywords or check your spelling
              </p>
            </div>
          )}

          {/* Results */}
          {searchQuery && !isSearching && searchResults.length > 0 && (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-black uppercase tracking-wider text-white/80">
                  Found {searchResults.length} Result{searchResults.length !== 1 ? "s" : ""}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => setSelectedMovie(movie)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Movie Details Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 overflow-y-auto"
            onClick={() => setSelectedMovie(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl border border-white/20 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-6 right-6 z-10 bg-black/70 hover:bg-red-600 text-white p-4 rounded-full transition shadow-lg"
              >
                <X size={32} strokeWidth={3} />
              </button>

              <div className="grid md:grid-cols-2">
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w1280${
                      selectedMovie.poster_path || selectedMovie.backdrop_path
                    }`}
                    alt=""
                    className="w-full h-full object-cover max-h-[80vh]"
                  />
                </div>

                <div className="p-10 md:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-red-600 font-black uppercase tracking-widest text-sm mb-4">
                    <Star size={18} fill="currentColor" />
                    {selectedMovie.vote_average?.toFixed(1)} / 10
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black uppercase mb-6 leading-tight">
                    {selectedMovie.title || selectedMovie.name}
                  </h1>
                  <p className="text-white/70 text-lg leading-relaxed mb-10 italic">
                    "{selectedMovie.overview}"
                  </p>

                  <button
                    onClick={() => handleAddToWatchlist(selectedMovie)}
                    className="bg-red-600 hover:bg-red-700 text-white px-14 py-6 rounded-full font-black uppercase tracking-widest text-xl shadow-2xl shadow-red-600/40 transition"
                  >
                    Add to Watchlist
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-5 px-10 py-5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  toast.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="font-black uppercase tracking-wider text-xl">{toast.msg}</span>
              <button onClick={() => setToast(null)}>
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function toggleWatchlist(movie: any) {
  throw new Error("Function not implemented.");
}
