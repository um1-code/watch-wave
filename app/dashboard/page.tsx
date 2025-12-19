"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieCard from "@/components/ui/MovieCard";
import StatsDashboard from "@/components/ui/StatsDashboard";
import Sidebar from "@/components/ui/Sidebar";
import { useWatchlist } from "@/context/WatchlistContext";
import { useAuth } from "@/context/AuthContext";
import { X, Star, Check, Plus } from "lucide-react";

const BACKEND_URL = "https://watch-wave-5es6.onrender.com";

export default function DashboardPage() {
  const { toggleWatchlist, toast, setToast, watchlist } = useWatchlist();
  const { user } = useAuth();

  const [currentView, setCurrentView] = useState<"home" | "search" | "watchlist" | "library">("home");

  const [currentTab, setCurrentTab] = useState<"trending" | "top-rated" | "upcoming">("trending");
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);

  // Filters
  const [genres, setGenres] = useState<any[]>([{ id: 0, name: "All" }]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<"All" | "movie" | "tv">("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedSort, setSelectedSort] = useState<string>("popularity.desc");

  const endpoints = {
    trending: "/api/tmdb/trending",
    "top-rated": "/api/tmdb/top-rated",
    upcoming: "/api/tmdb/upcoming",
  };

  // Basic genres fallback
  useEffect(() => {
    setGenres([
      { id: 0, name: "All" },
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 18, name: "Drama" },
      { id: 27, name: "Horror" },
      { id: 878, name: "Sci-Fi" },
      { id: 53, name: "Thriller" },
    ]);
  }, []);

  const fetchMovies = async (reset = false) => {
    setIsLoading(true);
    let url = `${BACKEND_URL}${endpoints[currentTab]}?page=${reset ? 1 : page}`;

    if (selectedGenre !== "All") {
      const genreId = genres.find(g => g.name === selectedGenre)?.id;
      if (genreId && genreId !== 0) url += `&with_genres=${genreId}`;
    }
    if (selectedType !== "All") url += `&media_type=${selectedType}`;
    if (selectedYear !== "All") url += `&year=${selectedYear}`;
    if (selectedSort) url += `&sort_by=${selectedSort}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const newMovies = data.results || [];

      if (reset) {
        setMovies(newMovies);
        setPage(2);
      } else {
        setMovies(prev => [...prev, ...newMovies]);
        setPage(prev => prev + 1);
      }
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      setToast({ msg: "Failed to load movies", type: "info" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(true);
  }, [currentTab, selectedGenre, selectedType, selectedYear, selectedSort]);

  // Check if movie is in watchlist
  const isInWatchlist = (movieId: number) => {
    return watchlist?.some((item: any) => item.tmdb_id === movieId || item.id === movieId);
  };

  // Add to watchlist
  const handleAddToWatchlist = async (movie: any) => {
    if (isAddingToWatchlist) return;
    
    setIsAddingToWatchlist(true);
    
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

      const data = await res.json();

      if (res.ok) {
        toggleWatchlist(movie);
        setToast({ msg: "Added to Watchlist!", type: "success" });
      } else {
        if (data.message?.includes("already exists")) {
          setToast({ msg: "Already in watchlist", type: "info" });
        } else {
          setToast({ msg: data.message || "Failed to add", type: "info" });
        }
      }
    } catch (err) {
      console.error("Watchlist error:", err);
      setToast({ msg: "Network error", type: "info" });
    } finally {
      setIsAddingToWatchlist(false);
    }
  };

  const displayMovies = movies;
  const heroMovie = displayMovies[0];
  const gridMovies = displayMovies.slice(1);

  return (
    <div className="grid grid-cols-[280px_1fr] h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 px-12 py-6">
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex gap-12">
              {(["trending", "top-rated", "upcoming"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`text-xl font-black uppercase tracking-widest transition ${
                    currentTab === tab ? "text-red-600" : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="p-12">
          {/* Welcome Message */}
          {user && (
            <div className="mb-12">
              <h1 className="text-5xl font-black uppercase tracking-wider text-red-600">
                Welcome {user.firstName} {user.lastName}
              </h1>
              <p className="text-white/60 text-xl mt-4">Discover what's trending today</p>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-16 border border-white/10">
            <h3 className="text-2xl font-black uppercase tracking-widest text-red-600 mb-8">Quick Filter</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-black/50 border border-white/20 rounded-xl px-6 py-4 text-white focus:border-red-600 outline-none uppercase tracking-wider"
              >
                {genres.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="bg-black/50 border border-white/20 rounded-xl px-6 py-4 text-white focus:border-red-600 outline-none uppercase tracking-wider"
              >
                <option value="All">Type: All</option>
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-black/50 border border-white/20 rounded-xl px-6 py-4 text-white focus:border-red-600 outline-none uppercase tracking-wider"
              >
                <option value="All">Year: All</option>
                {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-black/50 border border-white/20 rounded-xl px-6 py-4 text-white focus:border-red-600 outline-none uppercase tracking-wider"
              >
                <option value="popularity.desc">Popularity ↓</option>
                <option value="vote_average.desc">Rating ↓</option>
                <option value="primary_release_date.desc">Release Date ↓</option>
              </select>
            </div>

            <button
              onClick={() => fetchMovies(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-lg shadow-2xl transition"
            >
              Apply Filter
            </button>
          </div>

          {/* <StatsDashboard /> */}

          {/* Hero */}
          {heroMovie && (
            <div className="mb-20 relative rounded-3xl overflow-hidden h-[70vh]">
              <img
                src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path || heroMovie.poster_path}`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="relative z-10 h-full flex items-end p-16">
                <div className="max-w-4xl">
                  <h1 className="text-7xl font-black uppercase leading-tight mb-8">
                    {heroMovie.title || heroMovie.name}
                  </h1>
                  <button
                    onClick={() => setSelectedMovie(heroMovie)}
                    className="bg-red-600 hover:bg-red-700 text-white px-14 py-5 rounded-full font-black uppercase tracking-widest text-xl shadow-2xl transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-20">
            {gridMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-end mb-12">
              <button
                onClick={() => fetchMovies(false)}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-lg shadow-2xl transition"
              >
                {isLoading ? "Loading..." : "More"}
              </button>
            </div>
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
                    src={`https://image.tmdb.org/t/p/w1280${selectedMovie.poster_path || selectedMovie.backdrop_path}`}
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
                    disabled={isAddingToWatchlist || isInWatchlist(selectedMovie.id)}
                    className={`flex items-center justify-center gap-4 px-14 py-6 rounded-full font-black uppercase tracking-widest text-xl shadow-2xl transition ${
                      isInWatchlist(selectedMovie.id)
                        ? "bg-green-600 hover:bg-green-700 shadow-green-600/40"
                        : "bg-red-600 hover:bg-red-700 shadow-red-600/40"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isAddingToWatchlist ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : isInWatchlist(selectedMovie.id) ? (
                      <>
                        <Check size={24} strokeWidth={3} />
                        In Watchlist
                      </>
                    ) : (
                      <>
                        <Plus size={24} strokeWidth={3} />
                        Add to Watchlist
                      </>
                    )}
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
              <div className={`w-3 h-3 rounded-full animate-pulse ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`} />
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