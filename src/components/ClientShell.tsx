'use client';

import { SearchProvider } from '@/context/SearchContext';
import { Header } from './Header';

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <div className="min-h-screen flex flex-col relative">
        <Header />
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {children}
        </main>
        <footer className="relative z-10 border-t border-stone-700/50 bg-stone-900/60 backdrop-blur-sm px-4 py-3 text-center text-stone-500 text-sm">
          No name, no face. Just the story.
        </footer>
      </div>
    </SearchProvider>
  );
}
