import { useState } from 'react';

export function useMedicineSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch(`/api/search/medicine?q=${query}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch data');

      // The API returns the array directly, not nested under a 'pharmacies' property
      setResults(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, results, error, search };
}
