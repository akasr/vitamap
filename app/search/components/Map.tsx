'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import { FaLocationArrow } from 'react-icons/fa';

// Dynamic imports to avoid SSR issues
const DynamicMapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false },
);
const DynamicTileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false },
);
const DynamicMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false },
);
const DynamicPopup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false },
);
const DynamicCircle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false },
);

interface MedicineSearchResult {
  medicineName: string;
  quantity: number;
  pricePerUnit: number;
  pharmacy: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    isOpen: boolean;
    location: {
      latitude: number;
      longitude: number;
    } | null;
  };
}

interface MapProps {
  searchResults?: MedicineSearchResult[];
  selectedPharmacy?: any;
}

export function Map({ searchResults = [], selectedPharmacy = null }: MapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<any>(null);
  // Store icon instances to prevent recreation on each render
  const [icons, setIcons] = useState<{ default: any; selected: any } | null>(
    null,
  );
  // Ref to store the highlight marker instance
  const highlightMarkerRef = useRef<any>(null);

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

    // Request location immediately
    requestLocation();

    // Cleanup function to remove any highlight markers when component unmounts
    return () => {
      if (highlightMarkerRef.current && mapRef.current) {
        try {
          highlightMarkerRef.current.remove();
        } catch (e) {
          console.error('Error cleaning up highlight marker:', e);
        }
      }
    };
  }, []);

  // Initialize Leaflet icons
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      // Create icon instances after component mount
      const setupIcons = async () => {
        const L = await import('leaflet');

        // Fix the default icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });

        // Create custom icon for selected pharmacy
        const selectedIcon = new L.Icon({
          iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          iconRetinaUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
          className: 'selected-marker-icon', // CSS can target this
        });

        setIcons({
          default: new L.Icon.Default(),
          selected: selectedIcon,
        });
      };

      setupIcons();
    }
  }, [isClient]);

  // Effect to focus on selected pharmacy when it changes
  useEffect(() => {
    if (!isClient || !position || !mapRef.current) return;

    // Remove previous highlight marker if it exists
    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.remove();
      highlightMarkerRef.current = null;
    }

    if (selectedPharmacy && selectedPharmacy.location) {
      // Focus map on the selected pharmacy
      const L = require('leaflet');
      const pharmacyPos = L.latLng(
        selectedPharmacy.location.latitude,
        selectedPharmacy.location.longitude,
      );

      // Use flyTo for smooth animation to the pharmacy location
      mapRef.current.flyTo(pharmacyPos, 15);

      // Create a permanent highlight at the selected location
      highlightMarkerRef.current = L.circleMarker(pharmacyPos, {
        radius: 25,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.3,
        weight: 2,
        opacity: 0.8,
        className: 'pharmacy-highlight-circle',
      }).addTo(mapRef.current);

      // Add a pulsing animation effect to the highlight circle
      document.documentElement.style.setProperty('--pulse-color', '#3b82f6');
    }
  }, [isClient, selectedPharmacy, position]);

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

  // Group pharmacies to prevent duplicates
  const uniquePharmacies = searchResults.reduce(
    (acc: Record<string, MedicineSearchResult>, item) => {
      if (!acc[item.pharmacy.id]) {
        acc[item.pharmacy.id] = item;
      }
      return acc;
    },
    {},
  );

  return (
    <div className="h-full w-full relative">
      {/* Include custom styling for markers */}
      <style jsx global>{`
        .selected-marker-icon {
          filter: hue-rotate(120deg) saturate(2);
          transform: scale(1.2);
          z-index: 1000 !important;
        }

        .pharmacy-highlight-circle {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
        }
      `}</style>

      <DynamicMapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
        ref={mapRef}
      >
        <DynamicTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User's position */}
        <DynamicMarker position={position}>
          <DynamicPopup>
            <div className="text-center">
              <strong>Your Location</strong>
              <p className="text-xs text-gray-500">
                {position[0].toFixed(6)}, {position[1].toFixed(6)}
              </p>
            </div>
          </DynamicPopup>
        </DynamicMarker>

        {/* User's approximate area */}
        <DynamicCircle
          center={position}
          radius={300}
          pathOptions={{
            fillColor: 'blue',
            fillOpacity: 0.1,
            color: 'blue',
            weight: 1,
          }}
        />

        {/* Pharmacy markers */}
        {Object.values(uniquePharmacies).map((result) => {
          if (!result.pharmacy.location) return null;

          const pharmacyPosition: [number, number] = [
            result.pharmacy.location.latitude,
            result.pharmacy.location.longitude,
          ];

          // Check if this is the selected pharmacy
          const isSelected =
            selectedPharmacy && selectedPharmacy.id === result.pharmacy.id;

          return (
            <DynamicMarker
              key={result.pharmacy.id}
              position={pharmacyPosition}
              icon={icons && isSelected ? icons.selected : undefined}
              eventHandlers={{
                click: () => {
                  // Open popup when marker is clicked
                  const marker = document.querySelector(
                    `[data-pharmacy-id="${result.pharmacy.id}"]`,
                  );
                  if (marker) {
                    (marker as HTMLElement).click();
                  }
                },
              }}
            >
              <DynamicPopup>
                <div className="max-w-[200px]">
                  <h3 className="font-medium text-base">
                    {result.pharmacy.name}
                    {isSelected && (
                      <span className="text-blue-600 ml-2">★</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">
                    {result.pharmacy.address}
                  </p>
                  <p className="text-xs mb-1">
                    <span className="font-semibold">Phone:</span>{' '}
                    {result.pharmacy.phone}
                  </p>

                  <div className="flex items-center mt-2">
                    <div
                      className={`w-2 h-2 rounded-full mr-1 ${
                        result.pharmacy.isOpen ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        result.pharmacy.isOpen
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {result.pharmacy.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>

                  <div className="mt-2 text-xs grid grid-cols-2 gap-1">
                    <div>
                      <span className="font-semibold">Latitude:</span>
                      <br />
                      {result.pharmacy.location.latitude.toFixed(6)}
                    </div>
                    <div>
                      <span className="font-semibold">Longitude:</span>
                      <br />
                      {result.pharmacy.location.longitude.toFixed(6)}
                    </div>
                  </div>
                </div>
              </DynamicPopup>
            </DynamicMarker>
          );
        })}
      </DynamicMapContainer>

      {/* Optional UI controls */}
      <div className="absolute bottom-4 right-4 z-10 bg-white p-2 rounded-md shadow-md">
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.setView(position, 13);
            }
          }}
          className="flex items-center justify-center bg-blue-600 text-white p-2 rounded"
          title="Center on your location"
        >
          <FaLocationArrow />
        </button>
      </div>
    </div>
  );
}
