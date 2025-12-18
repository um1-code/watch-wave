"use client";
import { useState } from 'react';
import MovieCard from '../../components/ui/MovieCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="px-6 md:px-12">
      <div className="mb-12 pt-10">
        <h1 className="text-4xl font-bold mb-4">Find your next favorite.</h1>
        <div className="max-w-2xl flex gap-2">
          <input 
            className="input-field flex-1"
            placeholder="Search movies, TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn-primary">Search</button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {/* Map results here */}
      </div>
    </div>
  );
}