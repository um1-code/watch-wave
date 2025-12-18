// components/ui/Sidebar.tsx
"use client";

import { Home, Bookmark, Library, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  currentView: "home" | "watchlist" | "library";
  onViewChange: (view: "home" | "watchlist" | "library") => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const menuItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "watchlist", label: "Watchlist", icon: <Bookmark size={20} /> },
    { id: "library", label: "Library", icon: <Library size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col p-8">
      {/* Logo */}
      <h1 className="text-3xl font-black text-red-600 mb-16 tracking-tighter italic">TAMO</h1>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-lg transition-all ${
                  currentView === item.id
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/40"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-8 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-red-600 hover:bg-red-600/20 transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}