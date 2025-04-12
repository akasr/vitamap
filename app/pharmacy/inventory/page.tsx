'use client';

import { useEffect, useState } from 'react';

type Medicine = {
  medicineId: string;
  medicineName: string;
  batchNumber: string;
  manufacturedDate: string;
  expiryDate: string;
  quantity: number;
  pricePerUnit: number;
  pharmacyId: string;
};

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch('/api/medicines');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch medicines');
        }
        setMedicines(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">All Medicines</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && medicines.length === 0 && <p>No medicines found.</p>}

      {!loading && medicines.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Medicine Name</th>
                <th className="p-2 border">Manufactured Date</th>
                <th className="p-2 border">Expiry Date</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price per Unit</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med.medicineId} className="text-center">
                  <td className="p-2 border">{med.medicineName}</td>
                  <td className="p-2 border">{new Date(med.manufacturedDate).toLocaleDateString()}</td>
                  <td className="p-2 border">{new Date(med.expiryDate).toLocaleDateString()}</td>
                  <td className="p-2 border">{med.quantity}</td>
                  <td className="p-2 border">₹{med.pricePerUnit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
