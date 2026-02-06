'use client';

import { useSearch } from '@/context/SearchContext';
import { StoryFeed } from './StoryFeed';

export function StoriesSection() {
  const { categoryFilter, setCategoryFilter } = useSearch();

  return (
    <section className="w-full">
      <h2 className="text-xl font-bold text-stone-100 mb-3">
        Stories
      </h2>
      <div className="max-w-2xl mx-auto">
        <StoryFeed
          categoryFilter={categoryFilter}
          onClearCategory={() => setCategoryFilter(null)}
        />
      </div>
    </section>
  );
}
