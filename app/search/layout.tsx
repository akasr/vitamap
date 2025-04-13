'use client';

import { useState } from 'react';
import { SearchSidebar } from './components/SearchSidebar';
import { Map } from './components/Map';
import { MapPinned } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);

  const handleShowOnMap = (pharmacy: any) => {
    setSelectedPharmacy(pharmacy);
    setMapOpen(true);
  };

  return (
    <main className="h-screen flex flex-col md:flex-row overflow-hidden relative bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-[#0f0f0f] dark:to-[#1a1a1a]">
      {/* Background Blur Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[600px] h-[600px] bg-purple-300 opacity-20 rounded-full filter blur-3xl top-[-100px] left-[-150px] dark:bg-purple-900"></div>
        <div className="absolute w-[500px] h-[500px] bg-pink-300 opacity-20 rounded-full filter blur-3xl bottom-[-100px] right-[-100px] dark:bg-pink-900"></div>
      </div>

      {/* Sidebar */}
      <aside className="relative z-40 w-full md:w-[35vw] lg:w-[25vw] h-screen border-r border-gray-200 px-6 py-6 overflow-y-auto bg-white dark:bg-[#111111] shadow-xl backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-primary tracking-tight drop-shadow-md">
            VitaMap
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SearchSidebar onShowOnMap={handleShowOnMap} />
        </motion.div>
      </aside>

      {/* Toggle Button (Mobile) */}
      <motion.button
        className="md:hidden absolute bottom-6 right-4 z-50 bg-white dark:bg-[#222222] p-4 rounded-full shadow-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-[#333333] transition"
        onClick={() => setMapOpen((prev) => !prev)}
        aria-label="Toggle Map"
        whileTap={{ scale: 0.9 }}
      >
        <MapPinned className="w-6 h-6 text-primary" />
      </motion.button>

      {/* Map */}
      <AnimatePresence>
        <motion.section
          key="map"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`
            ${mapOpen ? 'translate-x-0' : 'translate-x-full'}
            md:translate-x-0 transition-transform duration-300 ease-in-out
            flex-1 overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] fixed md:relative top-0 right-0 
            w-full h-screen z-30 md:z-0
          `}
          aria-hidden={!mapOpen}
        >
          <Map selectedPharmacy={selectedPharmacy} />
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
