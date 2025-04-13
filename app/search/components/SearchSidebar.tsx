'use client';

import { useState } from 'react';
import { useMedicineSearch } from '@/app/hooks/useMedicineSearch';

export function SearchSidebar() {
  const [query, setQuery] = useState('');
  const { search, results, loading, error } = useMedicineSearch();
  const [expandedPharmacyId, setExpandedPharmacyId] = useState<string | null>(
    null,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    search(query.trim());
    // Debug log to check what results we're getting
    console.log('Search initiated for:', query.trim());
  };

  const togglePharmacyDetails = (pharmacyId: string) => {
    setExpandedPharmacyId(
      expandedPharmacyId === pharmacyId ? null : pharmacyId,
    );
  };

  // Format expiry date to a readable format
  const formatExpiryDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Debug: Log results when they change
  console.log('Current search results:', results);

  return (
    <div className="p-4 flex flex-col gap-4">

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medicine..."
          className="w-full p-2 border rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-sm text-gray-500">Searching...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Results count display */}
      {results && results.length > 0 && (
        <p className="text-sm text-green-500">Found {results.length} results</p>
      )}

      <div className="mt-2 flex flex-col gap-2">
        {results && results.length > 0 ? (
          results.map((item) => (
            <div
              key={`${item.pharmacyId}-${item.medicineName}-${item.batchNumber}`}
              className="p-3 border rounded-md bg-white shadow"
            >
              <h2 className="font-semibold">{item.medicineName}</h2>
              <div className="grid grid-cols-2 gap-1 text-sm text-gray-600 mt-1">
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.pricePerUnit}</p>
                <p>Expires: {formatExpiryDate(item.expiryDate)}</p>
              </div>

              {/* Display pharmacy information if available */}
              {item.pharmacy && (
                <div className="mt-2 pt-2 border-t">
                  <h3 className="font-medium">{item.pharmacy.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.pharmacy.address}
                  </p>

                  <button
                    onClick={() => togglePharmacyDetails(item.pharmacyId)}
                    className="text-blue-600 text-sm underline mt-1"
                  >
                    {expandedPharmacyId === item.pharmacyId
                      ? 'Hide Details'
                      : 'View Pharmacy'}
                  </button>

                  {expandedPharmacyId === item.pharmacyId && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <p>
                        <span className="font-medium">Phone:</span>{' '}
                        {item.pharmacy.phone}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{' '}
                        {item.pharmacy.email}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            {results && results.length === 0
              ? 'No medicines found matching your search'
              : 'Search for medicines to see results'}
          </p>
        )}
      </div>

      {/* Debug section to show raw data structure */}
      {/* {results && results.length > 0 && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <p className="text-xs font-bold">Debug - First Result Structure:</p>
          <pre className="text-xs overflow-auto max-h-40">
            {JSON.stringify(results[0], null, 2)}
          </pre>
        </div>
      )} */}
    </div>
  );
}
