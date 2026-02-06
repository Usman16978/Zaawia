'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { StoryCard } from './StoryCard';
import { useSearch } from '@/context/SearchContext';
import { STORY_CATEGORIES } from '@/lib/categories';

type Prompt = { id: string; text: string; slug: string };
type Story = {
  id: string;
  content: string;
  promptId: string | null;
  createdAt: string;
  prompt?: Prompt | null;
  _count?: { comments: number };
};

type StoryFeedProps = {
  categoryFilter?: string | null;
  onClearCategory?: () => void;
};

export function StoryFeed({ categoryFilter = null, onClearCategory }: StoryFeedProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const pathname = usePathname();
  const { searchQuery } = useSearch();

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter) params.set('promptId', filter);
    if (categoryFilter && categoryFilter.trim()) params.set('category', categoryFilter.trim());
    const url = params.toString() ? `/api/stories?${params}` : '/api/stories';
    setLoading(true);
    fetch(url, { cache: 'no-store' })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setStories(data);
        else setStories([]);
      })
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, [filter, categoryFilter, pathname]);

  const filteredStories = searchQuery
    ? stories.filter(
        (s) =>
          s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.prompt?.text?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      )
    : stories;

  if (loading) {
    return (
      <p className="text-stone-500 text-sm">Loading stories…</p>
    );
  }

  if (stories.length === 0) {
    return (
      <p className="text-stone-500 text-sm">
        No stories yet. Be the first to write.
      </p>
    );
  }

  if (filteredStories.length === 0) {
    return (
      <p className="text-stone-500 text-sm">
        No stories match &quot;{searchQuery}&quot;. Try another search or show all.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {(filter || categoryFilter) && (
        <p className="text-sm text-stone-500">
          {categoryFilter && (
            <span>
              Category: {STORY_CATEGORIES.find((c) => c.value === categoryFilter)?.label ?? categoryFilter}.{' '}
            </span>
          )}
          {filter && <span>Prompt filter. </span>}
          <button
            type="button"
            onClick={() => { setFilter(null); onClearCategory?.(); }}
            className="text-amber-500/90 hover:text-amber-400 underline"
          >
            Clear filters
          </button>
        </p>
      )}
      {searchQuery && (
        <p className="text-sm text-stone-500">
          Showing {filteredStories.length} result{filteredStories.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
        </p>
      )}
      {filteredStories.map((s) => (
        <StoryCard
          key={s.id}
          story={s}
          onFilterByPrompt={setFilter}
          activeFilter={filter}
        />
      ))}
    </div>
  );
}
