// app/dashboard/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieRow from "@/components/ui/MovieRow";
import MovieCard from "@/components/ui/MovieCard";
import StatsDashboard from "@/components/ui/StatsDashboard";
import Sidebar from "@/components/ui/Sidebar";
import { useWatchlist } from "@/context/WatchlistContext";
import { Search, Loader2, Flame, X, Star } from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "97ca10f5cde769f2a4954342ecad7b02";
const BASE_URL = "https://api.themoviedb.org/3";

export default function DashboardPage() {
  const { watchlist, watched, toggleWatchlist, updateNote, isWatched, toast, setToast } = useWatchlist();

  const [currentView, setCurrentView] = useState<"home" | "watchlist" | "library">("home");
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  // Home view data
  const [heroMovie, setHeroMovie] = useState<any>(null);
  const [displayedMovies, setDisplayedMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Filters
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<"All" | "movie" | "tv">("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedSort, setSelectedSort] = useState<string>("popularity.desc");

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch genres
  useEffect(() => {
    fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setGenres([{ id: 0, name: "All" }, ...data.genres]));
  }, []);

  // Load initial data or apply filters
  const loadMovies = async (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    let url = `${BASE_URL}/discover/${selectedType === "tv" ? "tv" : "movie"}?api_key=${API_KEY}&sort_by=${selectedSort}&page=${reset ? 1 : page}`;

    if (selectedGenre !== "All") {
      const genreId = genres.find((g) => g.name === selectedGenre)?.id;
      if (genreId && genreId !== 0) url += `&with_genres=${genreId}`;
    }

    if (selectedYear !== "All") {
      url += `&primary_release_year=${selectedYear}&first_air_date_year=${selectedYear}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      const newMovies = data.results || [];

      if (reset) {
        setDisplayedMovies(newMovies);
        setHeroMovie(newMovies[0]);
        setPage(2);
        setHasMore(data.page < data.total_pages);
      } else {
        setDisplayedMovies((prev) => [...prev, ...newMovies]);
        setPage((prev) => prev + 1);
        setHasMore(data.page < data.total_pages);
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load & filter change
  useEffect(() => {
    loadMovies(true);
  }, [selectedGenre, selectedType, selectedYear, selectedSort]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || currentView !== "home") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMovies();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [isLoading, hasMore, currentView]);

  // Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const renderContent = () => {
    if (searchQuery) {
      return (
        <div className="p-12">
          <h2 className="text-3xl font-black uppercase mb-8 text-white/80">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
            ))}
          </div>
        </div>
      );
    }

    if (currentView === "watchlist") {
      return (
        <div className="p-12">
          <h1 className="text-5xl font-black uppercase mb-12 text-red-600 tracking-tighter">My Watchlist</h1>
          {watchlist.length === 0 ? (
            <p className="text-center text-white/50 text-2xl mt-20">Your watchlist is empty</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {watchlist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (currentView === "library") {
      return (
        <div className="p-12">
          <h1 className="text-5xl font-black uppercase mb-12 text-red-600 tracking-tighter">My Library</h1>
          <StatsDashboard />
          {watched.length === 0 ? (
            <p className="text-center text-white/50 text-2xl mt-20">You haven't watched anything yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {watched.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Home view with filters & infinite scroll
    return (
      <div className="p-8 pb-32">
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
              {Array.from({ length: new Date().getFullYear() - 1980 + 1 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y.toString()}>
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
            onClick={() => loadMovies(true)}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-lg shadow-2xl transition"
          >
            {isLoading ? "Applying..." : "Apply Filter"}
          </button>
        </div>

        {/* Hero */}
        {heroMovie && (
          <div className="relative h-[80vh] mb-20 rounded-3xl overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            <div className="relative z-10 h-full flex items-end p-16">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 text-red-600 font-black uppercase tracking-widest text-sm mb-6">
                  <Flame size={20} fill="currentColor" />
                  Featured Today
                </div>
                <h1 className="text-7xl font-black uppercase leading-tight mb-8">
                  {heroMovie.title || heroMovie.name}
                </h1>
                <button
                  onClick={() => setSelectedMovie(heroMovie)}
                  className="bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition shadow-2xl"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        <StatsDashboard />

        {/* All movies in one big grid with infinite scroll */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {displayedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
          ))}
        </div>

        {/* Loading Spinner & Infinite Scroll Trigger */}
        {isLoading && (
          <div className="text-center py-16">
            <Loader2 size={48} className="animate-spin text-red-600 mx-auto" />
            <p className="text-white/60 mt-4 uppercase tracking-wider text-lg">Loading more...</p>
          </div>
        )}

        {!isLoading && hasMore && <div ref={loadMoreRef} className="h-20" />}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-[280px_1fr] h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="overflow-y-auto">
        <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 px-12 py-6">
          <div className="max-w-2xl ml-auto">
            <div className="relative">
              {isSearching ? (
                <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 animate-spin text-red-600" size={22} />
              ) : (
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={22} />
              )}
              <input
                type="text"
                placeholder="Search movies & shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-full pl-14 pr-8 py-5 text-white placeholder-white/40 focus:outline-none focus:border-red-600 transition text-lg"
              />
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Modal */}
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

                  {isWatched(selectedMovie.id) ? (
                    <div className="space-y-4">
                      <label className="text-red-600 font-black uppercase tracking-wider text-xl">Your Notes</label>
                      <textarea
                        className="w-full h-64 bg-white/5 border border-white/20 rounded-xl p-6 text-white resize-none focus:border-red-600 outline-none text-base leading-relaxed"
                        placeholder="Write your personal thoughts..."
                        value={watched.find((m) => m.id === selectedMovie.id)?.personalNote ?? ""}
                        onChange={(e) => updateNote(selectedMovie.id, e.target.value)}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        toggleWatchlist(selectedMovie);
                        setSelectedMovie(null);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-14 py-6 rounded-full font-black uppercase tracking-widest text-xl shadow-2xl shadow-red-600/40 transition"
                    >
                      Add to Watchlist
                    </button>
                  )}
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