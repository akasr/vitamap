'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Dynamically import Leaflet components to avoid SSR issues
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

interface PharmacyMapProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: {
    name: string;
    address: string;
    location?: {
      latitude: number;
      longitude: number;
    } | null;
  } | null;
}

export function PharmacyMap({ isOpen, onClose, pharmacy }: PharmacyMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fix for Leaflet marker icon issue
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      // This needs to be imported dynamically after component mount
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl:
            'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
      });
    }
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  const hasLocation =
    pharmacy?.location?.latitude && pharmacy?.location?.longitude;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] h-[450px]">
        <DialogHeader>
          <DialogTitle>{pharmacy?.name} Location</DialogTitle>
        </DialogHeader>

        {hasLocation ? (
          <div className="h-[360px] w-full">
            <DynamicMapContainer
              center={[
                pharmacy.location!.latitude,
                pharmacy.location!.longitude,
              ]}
              zoom={15}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <DynamicTileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <DynamicMarker
                position={[
                  pharmacy.location!.latitude,
                  pharmacy.location!.longitude,
                ]}
              >
                <DynamicPopup>
                  <div>
                    <strong>{pharmacy.name}</strong>
                    <p>{pharmacy.address}</p>
                    <p className="text-xs text-gray-500">
                      {pharmacy.location!.latitude},{' '}
                      {pharmacy.location!.longitude}
                    </p>
                  </div>
                </DynamicPopup>
              </DynamicMarker>
            </DynamicMapContainer>
          </div>
        ) : (
          <div className="h-[360px] w-full flex items-center justify-center bg-gray-100 rounded-md">
            <p className="text-gray-500">
              No location data available for this pharmacy
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
