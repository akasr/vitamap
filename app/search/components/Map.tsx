'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const DynamicMapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false },
);
const DynamicTileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false },
);

export function Map() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const requestLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          setError(
            'Location access is required to view nearby pharmacies. Please enable it in your browser settings.',
          );
        },
      );
    };

    // Request location on user interaction
    document.addEventListener('click', requestLocation, { once: true });

    return () => {
      document.removeEventListener('click', requestLocation);
    };
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server
  }

  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          Location Access Denied
        </h2>
        <p className="text-gray-600">
          {error} Please enable it in your browser settings and reload the page.
        </p>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Getting your location...
      </div>
    );
  }

  return (
    <DynamicMapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full z-0"
    >
      <DynamicTileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </DynamicMapContainer>
  );
}
