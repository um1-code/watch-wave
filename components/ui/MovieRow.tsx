// components/ui/MovieRow.tsx
"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

export default function MovieRow({
  title,
  movies,
  onMovieClick,
}: {
  title: string;
  movies: any[];
  onMovieClick: (movie: any) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    // Scroll by ~5 cards at a time for smooth feel
    const cardWidth = 216; // approx width of one card (200px + gap)
    const scrollAmount = cardWidth * 5;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mb-20">
      <h2 className="text-2xl font-black uppercase tracking-widest text-white/90 mb-8 px-4">
        {title}
      </h2>

      <div className="relative group">
        {/* Left Button - only visible on hover */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-32 bg-gradient-to-r from-[#050505] to-transparent flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto"
          aria-label="Scroll left"
        >
          <ChevronLeft size={36} className="text-white/70 hover:text-red-600 transition" />
        </button>

        {/* Right Button - only visible on hover */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-32 bg-gradient-to-l from-[#050505] to-transparent flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto"
          aria-label="Scroll right"
        >
          <ChevronRight size={36} className="text-white/70 hover:text-red-600 transition" />
        </button>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 pb-4"
          style={{ scrollPadding: "0 1rem" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-none w-52" // fixed width for consistent scrolling
            >
              <MovieCard movie={movie} onClick={() => onMovieClick(movie)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}