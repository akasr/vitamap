import { Input } from '@/components/ui/input';

export function SearchBar({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (q: string) => void;
}) {
  return (
    <div>
      <Input
        type="text"
        placeholder="Search medicine..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />
    </div>
  );
}
