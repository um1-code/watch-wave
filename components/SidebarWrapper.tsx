"use client";
import { usePathname } from 'next/navigation';
import Sidebar from './ui/Sidebar';

export default function SidebarWrapper() {
  const pathname = usePathname();
  const hideSidebar = pathname === '/login' || pathname === '/register' || pathname === '/';

  if (hideSidebar) return null;
  return <Sidebar currentView={'watchlist'} onViewChange={function (view: 'home' | 'watchlist' | 'library'): void {
      throw new Error('Function not implemented.');
  } }  />;
}