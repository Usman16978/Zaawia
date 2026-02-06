'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearch } from '@/context/SearchContext';
import { STORY_CATEGORIES } from '@/lib/categories';

export function Header() {
  const [logoError, setLogoError] = useState(false);
  const [query, setQuery] = useState('');
  const { setSearchQuery, categoryFilter, setCategoryFilter } = useSearch();

  return (
    <header className="relative z-10 border-b border-stone-700/50 bg-stone-900/98 shadow-[0_1px_0_0_rgba(251,191,36,0.08)] backdrop-blur-md px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center gap-3 sm:gap-4">
        <Link
          href="/"
          className="flex items-center shrink-0 order-1"
          aria-label="Zaawiya home"
        >
          {!logoError ? (
            <Image
              src="/logo.png"
              alt=""
              width={72}
              height={40}
              className="h-9 w-auto object-contain sm:h-10"
              onError={() => setLogoError(true)}
              unoptimized
            />
          ) : (
            <span className="text-2xl font-bold text-amber-500/80">Z</span>
          )}
        </Link>
        <Link
          href="/"
          className="flex flex-col shrink-0 min-w-0 order-2"
          aria-label="Zaawiya home"
        >
          <span className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-rose-400 sm:text-xl md:text-2xl">
            Zaawiya
          </span>
          <span className="text-xs text-stone-400 mt-0.5">
            Yahan sirf kahani bolti hai
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 order-3 w-full min-w-0 sm:order-3 sm:w-auto sm:ml-auto">
          <nav className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/write"
              className="px-3 py-2 rounded-lg border border-amber-700/50 bg-stone-800/90 hover:bg-amber-900/20 text-amber-200/90 hover:text-amber-100 text-sm font-medium transition-colors whitespace-nowrap min-h-[40px] sm:min-h-[44px] inline-flex items-center justify-center touch-manipulation"
              title="Tumhari kahani, tumhara control"
            >
              Write
            </Link>
            <Link
              href="/delete"
              className="px-3 py-2 rounded-lg border border-amber-700/50 bg-stone-800/90 hover:bg-amber-900/20 text-amber-200/90 hover:text-amber-100 text-sm transition-colors whitespace-nowrap min-h-[40px] sm:min-h-[44px] inline-flex items-center justify-center touch-manipulation"
            >
              Take my story back
            </Link>
          </nav>
          <div className="flex-1 min-w-[120px] sm:flex-initial sm:w-[200px] md:w-[240px] shrink-0">
            <input
              type="search"
              placeholder="Kis dard ki kahani dhoondh rahe ho?"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchQuery(e.target.value.trim());
              }}
              className="w-full rounded-lg bg-stone-800/90 border border-amber-700/50 text-amber-200/90 placeholder-amber-200/60 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600/50 min-h-[40px] sm:min-h-[44px]"
            />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs sm:text-sm text-amber-400/90 font-medium whitespace-nowrap hidden sm:inline">Filter</span>
            <select
              id="header-filter"
              value={categoryFilter ?? ''}
              onChange={(e) => setCategoryFilter(e.target.value.trim() || null)}
              className="rounded-lg bg-stone-800/90 border border-stone-600/60 text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600/60 min-w-[90px] sm:min-w-[100px] min-h-[40px] sm:min-h-[44px] touch-manipulation"
              aria-label="Filter by category"
            >
              <option value=""> </option>
              {STORY_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
