"use client";
import { useState } from 'react';
import { Movie } from '@/lib/types';

interface Props {
  movie: Movie;
  onClose: () => void;
  onSave: (id: number, updates: Partial<Movie>) => void;
}

export default function EditMovieModal({ movie, onClose, onSave }: Props) {
  const [rating, setRating] = useState(movie.userRating || 5);
  const [notes, setNotes] = useState(movie.notes || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="bg-[#181818] w-full max-w-md rounded-lg border border-gray-700 shadow-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Edit {movie.title}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Your Rating (1-10)</label>
            <input 
              type="range" min="1" max="10" 
              className="w-full accent-[#E50914]"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <div className="text-center font-bold text-xl text-yellow-500">{rating} / 10</div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Personal Notes</label>
            <textarea 
              className="w-full bg-[#2F2F2F] border-none rounded p-3 text-sm focus:ring-2 focus:ring-red-600 outline-none"
              rows={4}
              placeholder="What did you think of the ending?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button 
            onClick={() => onSave(movie.id, { userRating: rating, notes })}
            className="flex-1 bg-[#E50914] hover:bg-[#b20710] py-2 rounded font-bold transition"
          >
            Save Changes
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded font-bold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}