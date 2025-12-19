// components/ui/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, Library, LogOut } from "lucide-react";

interface SidebarProps {
  currentView: "home" | "search" | "watchlist" | "library";
  onViewChange: (view: "home" | "search" | "watchlist" | "library") => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { id: "home", label: "Dashboard", icon: Home, href: "/dashboard" },
    { id: "search", label: "Search", icon: Search, href: "/search" },
    { id: "watchlist", label: "Watchlist", icon: Bookmark, href: "/watchlist" },
    { id: "library", label: "Library", icon: Library, href: "/library" },
  ];

  return (
    <aside className="bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-8 border-b border-white/10">
        <h1 className="text-3xl font-black uppercase tracking-widest text-red-600">
          WatchWave
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-6">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-wider text-sm transition ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={22} strokeWidth={2.5} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-white/10">
        <button className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-wider text-sm text-white/60 hover:text-white hover:bg-white/5 w-full transition">
          <LogOut size={22} strokeWidth={2.5} />
          Logout
        </button>
      </div>
    </aside>
  );
}