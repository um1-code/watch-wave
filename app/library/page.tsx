"use client";

import Sidebar from "@/components/ui/Sidebar";
import MovieCard from "@/components/ui/MovieCard";
import StatsDashboard from "@/components/ui/StatsDashboard";
import { useWatchlist } from "@/context/WatchlistContext";

export default function LibraryPage() {
  const { watched } = useWatchlist();

  return (
    <div className="grid grid-cols-[280px_1fr] h-screen bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar currentView="library" onViewChange={() => {}} />

      {/* Main */}
      <main className="overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 px-12 py-6">
          <h1 className="text-5xl font-black uppercase tracking-wider text-red-600">
            My Library
          </h1>
        </header>

        <div className="p-12">
          {/* Stats */}
          <StatsDashboard />

          {/* Empty State */}
          {watched.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <h2 className="text-4xl font-black uppercase tracking-wider text-white/60 mb-4">
                No Watched Titles Yet
              </h2>
              <p className="text-xl text-white/40 max-w-md">
                Movies and shows you finish watching will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-black uppercase tracking-wider text-white/80">
                  {watched.length} Watched
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {watched.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
