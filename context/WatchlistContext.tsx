// context/WatchlistContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  overview?: string;
  personalNote?: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
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
  setToast: React.Dispatch<React.SetStateAction<{ msg: string; type: "success" | "info" } | null>>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [watched, setWatched] = useState<Movie[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "info" } | null>(null);

  useEffect(() => {
    const savedWatch = localStorage.getItem("watchwave-watchlist");
    const savedWatched = localStorage.getItem("watchwave-watched");
    if (savedWatch) setWatchlist(JSON.parse(savedWatch));
    if (savedWatched) setWatched(JSON.parse(savedWatched));
  }, []);

  useEffect(() => {
    localStorage.setItem("watchwave-watchlist", JSON.stringify(watchlist));
    localStorage.setItem("watchwave-watched", JSON.stringify(watched));
  }, [watchlist, watched]);

  const showToast = (msg: string, type: "success" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      showToast(exists ? "REMOVED FROM WATCHLIST" : "ADDED TO WATCHLIST", exists ? "info" : "success");
      return exists ? prev.filter((m) => m.id !== movie.id) : [movie, ...prev];
    });
  };

  const toggleWatched = (movie: Movie) => {
    setWatched((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      showToast(exists ? "REMOVED FROM LIBRARY" : "MOVED TO LIBRARY", exists ? "info" : "success");
      if (!exists) {
        setWatchlist((pw) => pw.filter((m) => m.id !== movie.id));
      }
      return exists ? prev.filter((m) => m.id !== movie.id) : [{ ...movie, personalNote: "" }, ...prev];
    });
  };

  const updateNote = (movieId: number, note: string) => {
    setWatched((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, personalNote: note } : m))
    );
    showToast("NOTE SAVED", "success");
  };

  const value: WatchlistContextType = {
    watchlist,
    watched,
    toast,
    toggleWatchlist,
    toggleWatched,
    updateNote,
    setToast,
    isInWatchlist: (id: number) => watchlist.some((m) => m.id === id),
    isWatched: (id: number) => watched.some((m) => m.id === id),
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error("useWatchlist must be used within a WatchlistProvider");
  return context;
};