import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function FilterPanel({
  filters,
  setFilters,
}: {
  filters: { openNow: boolean; needsPrescription: boolean };
  setFilters: (f: typeof filters) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="open-now"
          checked={filters.openNow}
          onCheckedChange={(val) =>
            setFilters({ ...filters, openNow: Boolean(val) })
          }
        />
        <Label htmlFor="open-now">Open Now</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="prescription"
          checked={filters.needsPrescription}
          onCheckedChange={(val) =>
            setFilters({ ...filters, needsPrescription: Boolean(val) })
          }
        />
        <Label htmlFor="prescription">Needs Prescription</Label>
      </div>
    </div>
  );
}