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
    <header className="relative z-10 border-b border-amber-900/30 bg-gradient-to-r from-stone-900 via-stone-800/95 to-stone-900 backdrop-blur-sm px-3 py-3 sm:px-4">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        {/* Logo + title */}
        <Link
          href="/"
          className="flex items-center gap-3 min-w-0 shrink-0 sm:mr-0 mr-auto"
          aria-label="Zaawiya home"
        >
          {!logoError ? (
            <Image
              src="/logo.png"
              alt=""
              width={80}
              height={44}
              className="h-10 w-auto object-contain sm:h-11"
              onError={() => setLogoError(true)}
              unoptimized
            />
          ) : (
            <span className="text-2xl font-bold text-amber-500/80">Z</span>
          )}
          <div className="flex flex-col shrink-0 min-w-0">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-rose-400">
              Zaawiya
            </span>
            <span className="text-xs text-stone-400 mt-0.5 hidden sm:block">
              Yahan sirf kahani bolti hai
            </span>
          </div>
        </Link>

        {/* Nav, search, filter — full width row on mobile, pushed right on desktop */}
        <div className="flex flex-col gap-3 w-full min-w-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:ml-auto sm:w-auto">
          <nav className="flex items-center gap-2 shrink-0 sm:order-1">
            <Link
              href="/write"
              className="px-3 py-2.5 sm:px-4 rounded-lg border border-amber-700/60 bg-stone-800/80 hover:bg-amber-900/30 text-amber-200/90 hover:text-amber-100 text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] inline-flex items-center justify-center"
              title="Tumhari kahani, tumhara control"
            >
              Write
            </Link>
            <Link
              href="/delete"
              className="px-3 py-2.5 sm:px-4 rounded-lg border border-amber-700/60 bg-stone-800/80 hover:bg-amber-900/30 text-amber-200/90 hover:text-amber-100 text-sm transition-colors whitespace-nowrap min-h-[44px] inline-flex items-center justify-center"
            >
              Take my story back
            </Link>
          </nav>
          <div className="w-full min-w-0 sm:max-w-[280px] sm:order-2">
            <input
              type="search"
              placeholder="Kis dard ki kahani dhoondh rahe ho?"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchQuery(e.target.value.trim());
              }}
              className="w-full rounded-lg bg-stone-800/90 border border-amber-800/50 text-amber-200/90 placeholder-amber-200/60 px-3 py-2.5 text-sm focus:outline-none focus:ring 1px focus:ring-amber-500/60 focus:border-amber-600/50 min-h-[44px]"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 sm:order-3">
            <span className="text-sm text-amber-400/90 font-medium whitespace-nowrap">Filter</span>
            <select
              id="header-filter"
              value={categoryFilter ?? ''}
              onChange={(e) => setCategoryFilter(e.target.value.trim() || null)}
              className="rounded-lg bg-stone-800/90 border border-amber-800/50 text-stone-100 px-3 py-2.5 text-sm focus:outline-none focus:ring 1px focus:ring-amber-500/60 focus:border-amber-600/50 min-w-[100px] min-h-[44px]"
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
