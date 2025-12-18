// context/WatchlistContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  media_type?: "movie" | "tv";
  personalNote?: string;
}

interface WatchlistContextType {
  watchlist: Movie[];
  watched: Movie[];
  toast: { msg: string; type: "success" | "info" } | null;
  toggleWatchlist: (movie: Movie) => void;
  toggleWatched: (movie: Movie) => void;
  updateNote: (movieId: number, note: string) => void;
  isInWatchlist: (id: number) => boolean;
  isWatched: (id: number) => boolean;
  setToast: (toast: { msg: string; type: "success" | "info" } | null) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [watched, setWatched] = useState<Movie[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "info" } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("tamo-watchlist");
    const savedWatched = localStorage.getItem("tamo-watched");
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedWatched) setWatched(JSON.parse(savedWatched));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("tamo-watchlist", JSON.stringify(watchlist));
    localStorage.setItem("tamo-watched", JSON.stringify(watched));
  }, [watchlist, watched]);

  const showToast = (msg: string, type: "success" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) {
        showToast("Removed from Watchlist", "info");
        return prev.filter((m) => m.id !== movie.id);
      } else {
        showToast("Added to Watchlist!", "success");
        return [movie, ...prev];
      }
    });
  };

  const toggleWatched = (movie: Movie) => {
    setWatched((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) {
        showToast("Removed from Library", "info");
        return prev.filter((m) => m.id !== movie.id);
      } else {
        showToast("Marked as Watched!", "success");
        // Remove from watchlist if present
        setWatchlist((pw) => pw.filter((m) => m.id !== movie.id));
        return [{ ...movie, personalNote: "" }, ...prev];
      }
    });
  };

  const updateNote = (movieId: number, note: string) => {
    setWatched((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, personalNote: note } : m))
    );
    showToast("Note saved", "success");
  };

  const isInWatchlist = (id: number) => watchlist.some((m) => m.id === id);
  const isWatched = (id: number) => watched.some((m) => m.id === id);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        watched,
        toast,
        toggleWatchlist,
        toggleWatched,
        updateNote,
        isInWatchlist,
        isWatched,
        setToast,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error("useWatchlist must be used within WatchlistProvider");
  return context;
};