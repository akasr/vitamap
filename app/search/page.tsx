'use client';

import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultList } from './components/ResultList';
import { FilterPanel } from './components/FilterPanel';
import { useMedicineSearch } from '../hooks/useMedicineSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map } from './components/Map';

export default function SearchPage() {
  const { loading, results, error, search } = useMedicineSearch();
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);

  const handleSearch = (query: string) => {
    search(query);
  };

  // Function to show a pharmacy on the map
  const handleShowOnMap = (pharmacy: any) => {
    setSelectedPharmacy(pharmacy);
    setActiveTab('map');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Search Pharmacies</h1>

      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-1">
          <FilterPanel />
        </div>

        <div className="md:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'list' | 'map')}
            className="mb-6"
          >
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-4">
              {loading ? (
                <div className="p-4 text-center">Loading results...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : (
                <ResultList
                  searchResults={results}
                  onShowOnMap={handleShowOnMap}
                />
              )}
            </TabsContent>

            <TabsContent value="map" className="mt-4 h-[500px]">
              <Map
                searchResults={results}
                selectedPharmacy={selectedPharmacy}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
