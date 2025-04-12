'use client';

export function ResultList() {
  // Temporary mock data
  const results = [
    {
      id: 'ph1',
      name: 'GreenLife Pharmacy',
      distance: '1.2 km',
      available: true,
    },
    {
      id: 'ph2',
      name: 'HealthMart',
      distance: '2.8 km',
      available: false,
    },
  ];

  return (
    <ul className="space-y-2">
      {results.map((pharmacy) => (
        <li
          key={pharmacy.id}
          className={`p-3 rounded-md border hover:shadow transition ${
            pharmacy.available ? 'bg-green-50' : 'bg-gray-100'
          }`}
        >
          <h4 className="font-semibold">{pharmacy.name}</h4>
          <p className="text-sm text-muted-foreground">
            {pharmacy.distance} away
          </p>
          {!pharmacy.available && (
            <p className="text-xs text-red-500 font-medium">Out of Stock</p>
          )}
        </li>
      ))}
    </ul>
  );
}
