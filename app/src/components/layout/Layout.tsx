import type { ReactNode } from 'react';
import NavBar from './NavBar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-mil-bg">
      <NavBar />
      <main className="flex-1 p-4 max-w-[1400px] w-full mx-auto">
        {children}
      </main>
      <footer className="text-center text-mil-muted text-xs py-2 border-t border-[#2a3818] font-mono">
        Axis &amp; Allies Global 1940 Tracker — ide1_alfa
      </footer>
    </div>
  );
}
