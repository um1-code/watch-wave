"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average?: number;
  personalNote?: string;
}

interface WatchlistContextType {
  watchlist: Movie[];
  watched: Movie[];

  toggleWatchlist: (movie: Movie) => void;
  toggleWatched: (movie: Movie) => void;

  isInWatchlist: (id: number) => boolean;
  isWatched: (id: number) => boolean;

  updateNote: (id: number, note: string) => void;

  toast: { msg: string; type: "success" | "info" } | null;
  setToast: React.Dispatch<
    React.SetStateAction<{ msg: string; type: "success" | "info" } | null>
  >;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [watched, setWatched] = useState<Movie[]>([]);
  const [toast, setToast] = useState<WatchlistContextType["toast"]>(null);

  /* ---------------- LOAD FROM STORAGE ---------------- */
  useEffect(() => {
    const wl = localStorage.getItem("watchlist");
    const wd = localStorage.getItem("watched");
    if (wl) setWatchlist(JSON.parse(wl));
    if (wd) setWatched(JSON.parse(wd));
  }, []);

  /* ---------------- SAVE TO STORAGE ---------------- */
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  /* ---------------- HELPERS ---------------- */
  const isInWatchlist = (id: number) =>
    watchlist.some((movie) => movie.id === id);

  const isWatched = (id: number) =>
    watched.some((movie) => movie.id === id);

  /* ---------------- ACTIONS ---------------- */
  const toggleWatchlist = (movie: Movie) => {
    setWatchlist((prev) =>
      isInWatchlist(movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );

    setToast({
      msg: isInWatchlist(movie.id)
        ? "Removed from Watchlist"
        : "Added to Watchlist",
      type: "success",
    });
  };

  const toggleWatched = (movie: Movie) => {
    if (isWatched(movie.id)) {
      setWatched((prev) => prev.filter((m) => m.id !== movie.id));
      setToast({ msg: "Removed from Library", type: "info" });
    } else {
      setWatched((prev) => [...prev, { ...movie, personalNote: "" }]);
      setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
      setToast({ msg: "Marked as Watched", type: "success" });
    }
  };

  const updateNote = (id: number, note: string) => {
    setWatched((prev) =>
      prev.map((m) => (m.id === id ? { ...m, personalNote: note } : m))
    );
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        watched,
        toggleWatchlist,
        toggleWatched,
        isInWatchlist,
        isWatched,
        updateNote,
        toast,
        setToast,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
};
