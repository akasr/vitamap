'use client';

import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultList } from './components/ResultList';
import { FilterPanel } from './components/FilterPanel';
import { useMedicineSearch } from '../hooks/useMedicineSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map } from './components/Map';
import { motion } from 'framer-motion';
import { Sparkles, MapPinned, ListTree } from 'lucide-react';

export default function SearchPage() {
  const { loading, results, error, search } = useMedicineSearch();
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);

  const handleSearch = (query: string) => {
    search(query);
  };

  const handleShowOnMap = (pharmacy: any) => {
    setSelectedPharmacy(pharmacy);
    setActiveTab('map');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-[#0f0f0f] dark:to-[#1a1a1a] px-4 py-10 overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center text-primary mb-8 drop-shadow-lg tracking-tight"
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          Search Pharmacies
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-screen-xl mx-auto"
      >
        <div className="backdrop-blur-lg bg-white/80 dark:bg-black/30 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-6 md:p-10">
          <SearchBar onSearch={handleSearch} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Filters */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-1"
            >
              <div className="rounded-2xl border border-gray-200 dark:border-white/10 p-4 bg-white dark:bg-[#111111] shadow-xl">
                <FilterPanel />
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-2"
            >
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as 'list' | 'map')}
                className="space-y-4"
              >
                <TabsList className="grid grid-cols-2 w-full rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:to-purple-900 p-1">
                  <TabsTrigger
                    value="list"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ListTree className="w-4 h-4" /> List View
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="map"
                    className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
                  >
                    <span className="inline-flex items-center gap-2">
                      <MapPinned className="w-4 h-4" /> Map View
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="mt-6">
                  {loading ? (
                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                      Loading results...
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center text-sm text-red-500">
                      {error}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <ResultList
                        searchResults={results}
                        onShowOnMap={handleShowOnMap}
                      />
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent
                  value="map"
                  className="mt-6 h-[500px] overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10"
                >
                  <Map
                    searchResults={results}
                    selectedPharmacy={selectedPharmacy}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[600px] h-[600px] bg-pink-200 opacity-30 rounded-full filter blur-3xl top-[-100px] left-[-150px] dark:bg-pink-800"></div>
        <div className="absolute w-[400px] h-[400px] bg-indigo-200 opacity-20 rounded-full filter blur-2xl bottom-[-100px] right-[-100px] dark:bg-indigo-800"></div>
      </div>
    </div>
  );
}
