'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CAROUSEL_IMAGES } from '@/lib/carousel-images';

export function ImageCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 280;
    const gap = 16;
    const step = (cardWidth + gap) * 2;
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
    setTimeout(updateScrollState, 300);
  }

  return (
    <section className="mb-10 w-full">
      <h3 className="text-lg font-semibold text-stone-100 mb-3">More to explore</h3>
      <div className="relative group/carousel">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Previous images"
          disabled={!canScrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-stone-900/95 border border-stone-600 shadow-xl flex items-center justify-center text-stone-300 hover:bg-amber-600 hover:text-stone-950 hover:border-amber-500 transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide py-2 -mx-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CAROUSEL_IMAGES.map((img, i) => (
            <Link
              key={i}
              href="/write"
              className="flex-shrink-0 w-[260px] sm:w-[280px] group block rounded-xl overflow-hidden border border-stone-700/50 bg-stone-800/50 shadow-lg hover:shadow-amber-900/20 hover:border-amber-700/40 transition-all duration-300 hover:scale-[1.03]"
            >
              <div className="aspect-[16/9] relative">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-2 left-2 right-2 text-sm font-medium text-stone-200 group-hover:text-amber-200 transition-colors">
                  {img.caption}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Next images"
          disabled={!canScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-stone-900/95 border border-stone-600 shadow-xl flex items-center justify-center text-stone-300 hover:bg-amber-600 hover:text-stone-950 hover:border-amber-500 transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
