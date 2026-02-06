'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (c: string | null) => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  return (
    <SearchContext.Provider
      value={{ searchQuery, setSearchQuery, categoryFilter, setCategoryFilter }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  return (
    ctx ?? {
      searchQuery: '',
      setSearchQuery: () => {},
      categoryFilter: null as string | null,
      setCategoryFilter: () => {},
    }
  );
}
