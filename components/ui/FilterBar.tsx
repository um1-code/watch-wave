// components/ui/FilterBar.tsx
"use client";

import { useState } from "react";

const genres = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
];

const types = ["All", "Movie", "TV Show"];

const years = ["All", ...Array.from({ length: new Date().getFullYear() - 1980 + 1 }, (_, i) => (1980 + i).toString()).reverse()];

const sortOptions = ["Popularity Desc", "Rating Desc", "Release Date Desc", "Title A-Z"];

export default function FilterBar({ onFilter }: { onFilter: (filters: any) => void }) {
  const [genre, setGenre] = useState("All");
  const [type, setType] = useState("All");
  const [year, setYear] = useState("All");
  const [sort, setSort] = useState("Popularity Desc");

  const applyFilter = () => {
    onFilter({ genre, type, year, sort });
  };

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 mb-12 border border-white/10">
      <h3 className="text-xl font-black uppercase tracking-wider mb-6 text-red-600">Quick Filter</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none">
          <option value="All">Genre: All</option>
          {genres.filter(g => g !== "All").map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none">
          {types.map(t => <option key={t} value={t}>Type: {t}</option>)}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none">
          {years.map(y => <option key={y} value={y}>Year: {y}</option>)}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-red-600 outline-none">
          {sortOptions.map(s => <option key={s} value={s}>Sort: {s}</option>)}
        </select>
      </div>

      <button
        onClick={applyFilter}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-full font-black uppercase tracking-wider transition shadow-lg"
      >
        Apply Filter
      </button>
    </div>
  );
}