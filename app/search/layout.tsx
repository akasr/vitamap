'use client';

import { useState } from 'react';
import { SearchSidebar } from './components/SearchSidebar';
import { Map } from './components/Map';
import { MapPinned } from 'lucide-react';

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <main className="h-screen flex flex-col md:flex-row overflow-hidden relative">
      {/* Sidebar — always visible */}
      <aside className="w-full md:w-[30vw] lg:w-[20vw] h-[100vh] md:h-full border-r border-gray-200 p-4 overflow-y-auto bg-white z-40">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">VitaMap</h1>
        </div>
        <SearchSidebar />
      </aside>

      {/* Map Toggle Button — only visible on mobile */}
      <button
        className="md:hidden absolute bottom-4 right-4 z-60 bg-white p-4 rounded-full shadow-md"
        onClick={() => {
          setMapOpen((prev) => !prev);
          console.log('Map button clicked');
        }}
        aria-label="Toggle Map"
      >
        <MapPinned className="w-5 h-5" />
      </button>

      {/* Map section */}
      <section
        className={`
          ${
            mapOpen ? 'translate-x-0' : 'translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out
          flex-1 overflow-hidden bg-gray-100 fixed md:relative top-0 right-0 
          w-full h-[100vh] md:h-full z-50
        `}
        aria-hidden={!mapOpen}
      >
        <Map />
      </section>
    </main>
  );
}
