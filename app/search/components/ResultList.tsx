'use client';

import { FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MedicineSearchResult {
  medicineName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  pricePerUnit: number;
  pharmacy: {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    isOpen: boolean;
    location: {
      latitude: number;
      longitude: number;
    } | null;
  };
}

type SearchResultsProps = {
  searchResults: MedicineSearchResult[];
  onShowOnMap: (pharmacy: any) => void;
};

export function ResultList({
  searchResults = [],
  onShowOnMap,
}: SearchResultsProps) {
  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No results found. Try a different search term.
      </div>
    );
  }

  // Group by pharmacy to prevent duplicate entries
  const groupedByPharmacy = searchResults.reduce(
    (acc: Record<string, MedicineSearchResult>, item) => {
      if (!acc[item.pharmacy.id]) {
        acc[item.pharmacy.id] = item;
      }
      return acc;
    },
    {},
  );

  const uniqueResults = Object.values(groupedByPharmacy);

  return (
    <ul className="space-y-3">
      {uniqueResults.map((result) => (
        <li
          key={result.pharmacy.id}
          className={`p-4 rounded-md border hover:shadow-md transition bg-white`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-lg">{result.pharmacy.name}</h4>
              <p className="text-sm text-muted-foreground">
                {result.pharmacy.address}
              </p>
            </div>
            <div className="flex space-x-2">
              {result.pharmacy.location && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  onClick={() => onShowOnMap(result.pharmacy)}
                >
                  <FaMapMarkerAlt className="mr-1" /> Show on Map
                </Button>
              )}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <span className="text-gray-500 w-16">Email:</span>
              <span>{result.pharmacy.email}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-16">Phone:</span>
              <span>{result.pharmacy.phone}</span>
            </div>
            {result.pharmacy.location && (
              <>
                <div className="flex items-center">
                  <span className="text-gray-500 w-16">Latitude:</span>
                  <span>{result.pharmacy.location.latitude}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-16">Longitude:</span>
                  <span>{result.pharmacy.location.longitude}</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-3 flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                result.pharmacy.isOpen ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></div>
            <span
              className={`text-xs font-medium ${
                result.pharmacy.isOpen ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {result.pharmacy.isOpen ? 'Open Now' : 'Closed'}
            </span>
            {result.quantity > 0 ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-3 flex items-center text-xs font-medium text-blue-600">
                    <FaInfoCircle className="mr-1" /> Medicine Available
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {result.medicineName}: {result.quantity} units at $
                    {result.pricePerUnit}/unit
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <span className="ml-3 text-xs font-medium text-red-500">
                Out of Stock
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
