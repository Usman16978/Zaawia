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
    <header className="relative z-10 border-b border-amber-900/30 bg-gradient-to-r from-stone-900 via-stone-800/95 to-stone-900 backdrop-blur-sm px-4 py-3">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center gap-4">
        {/* Extreme left: logo only */}
        <Link
          href="/"
          className="flex items-center shrink-0"
          aria-label="Zaawiya home"
        >
          {!logoError ? (
            <Image
              src="/logo.png"
              alt=""
              width={80}
              height={44}
              className="h-11 w-auto object-contain"
              onError={() => setLogoError(true)}
              unoptimized
            />
          ) : (
            <span className="text-2xl font-bold text-amber-500/80">Z</span>
          )}
        </Link>

        {/* Zaawiya large + tagline small */}
        <Link
          href="/"
          className="flex flex-col shrink-0 min-w-0"
          aria-label="Zaawiya home"
        >
          <span className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-rose-400">
            Zaawiya
          </span>
          <span className="text-xs text-stone-400 mt-0.5">
            Yahan sirf kahani bolti hai
          </span>
        </Link>

        {/* Right group: Write, Take my story back, Search, Filter — pushed to the right */}
        <div className="flex flex-wrap items-center gap-4 ml-auto">
          <nav className="flex items-center gap-2 shrink-0">
            <Link
              href="/write"
              className="px-4 py-2 rounded-lg border border-amber-700/60 bg-stone-800/80 hover:bg-amber-900/30 text-amber-200/90 hover:text-amber-100 text-sm font-medium transition-colors whitespace-nowrap"
              title="Tumhari kahani, tumhara control"
            >
              Write
            </Link>
            <Link
              href="/delete"
              className="px-4 py-2 rounded-lg border border-amber-700/60 bg-stone-800/80 hover:bg-amber-900/30 text-amber-200/90 hover:text-amber-100 text-sm transition-colors whitespace-nowrap"
            >
              Take my story back
            </Link>
          </nav>

          <div className="min-w-[320px] flex-1 max-w-md">
            <input
              type="search"
              placeholder="Kis dard ki kahani dhoondh rahe ho?"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchQuery(e.target.value.trim());
              }}
              className="w-full rounded-lg bg-stone-800/90 border border-amber-800/50 text-amber-200/90 placeholder-amber-200/60 px-3 py-2 text-sm focus:outline-none focus:ring 1px focus:ring-amber-500/60 focus:border-amber-600/50"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-amber-400/90 font-medium whitespace-nowrap">Filter</span>
            <select
              id="header-filter"
              value={categoryFilter ?? ''}
              onChange={(e) => setCategoryFilter(e.target.value.trim() || null)}
              className="rounded-lg bg-stone-800/90 border border-amber-800/50 text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring 1px focus:ring-amber-500/60 focus:border-amber-600/50 min-w-[100px]"
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
