"use client";
import { X } from 'lucide-react';

export default function ReviewModal({ movieTitle, onClose }: { movieTitle: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111] w-full max-w-lg rounded-2xl border border-white/10 p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold uppercase tracking-tight mb-1">Personal Review</h2>
        <p className="text-xs text-gray-500 uppercase mb-6">{movieTitle}</p>

        <div className="relative">
          <textarea 
            className="w-full bg-black border border-red-900/30 rounded-xl p-4 text-sm h-40 focus:ring-2 focus:ring-[#E50914] outline-none transition-all placeholder:text-gray-700"
            placeholder="Write your thoughts here..."
          />
        </div>

        <button className="w-full bg-[#E50914] hover:bg-[#b20710] text-white font-bold py-4 rounded-xl mt-6 shadow-lg shadow-red-900/40 transition-all uppercase tracking-widest text-sm">
          Save Review
        </button>
      </div>
    </div>
  );
}