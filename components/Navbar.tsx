"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/dashboard' },
    { name: 'My List', href: '/watchlist' },
    { name: 'Browse', href: '/search' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#141414]/90 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-4 flex justify-between items-center">
      <div className="flex items-center gap-10">
        <Link href="/" className="text-[#E50914] text-3xl font-black italic tracking-tighter hover:scale-105 transition">
          WATCHWAVE
        </Link>
        {user && (
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm transition ${pathname === link.href ? 'text-white font-bold' : 'text-gray-400 hover:text-gray-200'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {user ? (
          <button onClick={logout} className="text-sm font-medium hover:underline text-gray-300">
            Sign Out
          </button>
        ) : (
          <Link href="/login" className="btn-primary text-xs py-1.5 px-4">Sign In</Link>
        )}
      </div>
    </nav>
  );
}