'use client';

import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { ResultList } from './ResultList';

export function SearchSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    openNow: false,
    needsPrescription: false,
  });

  return (
    <div className="space-y-6">
      <SearchBar query={searchQuery} setQuery={setSearchQuery} />
      <div>
        <h3 className="text-lg font-medium mb-2">Filters</h3>
        <FilterPanel filters={filters} setFilters={setFilters} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Search Results</h3>
        <ResultList query={searchQuery} filters={filters} />
      </div>
    </div>
  );
}
