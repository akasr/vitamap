'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Medicine {
  medicineName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  pricePerUnit: number;
  createdAt: string;
  updatedAt: string;
}

export default function MedicineListPage() {
  const { 'pharmacy-id': pharmacyId } = useParams();
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [error, setError] = useState('');

  const fetchMedicines = async () => {
    try {
      const res = await fetch(`/api/pharmacy/${pharmacyId}/medicines-list`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to load medicines');
      } else {
        setMedicines(data.medicines || []);
      }
    } catch (err) {
      setError('Failed to fetch medicines');
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [pharmacyId]);

  const handleAdd = () => {
    router.push(`/pharmacy/${pharmacyId}/add-medicine`);
  };

  const handleEdit = (medicineName: string, batchNumber: string) => {
    router.push(`/pharmacy/${pharmacyId}/edit-medicine?medicineName=${medicineName}&batchNumber=${batchNumber}`);
  };

  const handleDelete = async (medicineName: string, batchNumber: string) => {
    const confirmDelete = confirm(`Are you sure you want to delete ${medicineName} (${batchNumber})?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/pharmacy/${pharmacyId}/medicines-list`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName, batchNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to delete');
      } else {
        fetchMedicines(); // Refresh list
      }
    } catch (err) {
      alert('Server error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Medicine Inventory</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleAdd}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Add Medicine
      </button>

      {medicines.length === 0 ? (
        <p>No medicines found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Medicine</th>
              <th className="p-2 text-left">Batch</th>
              <th className="p-2 text-left">Expiry</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((med) => (
              <tr key={`${med.medicineName}-${med.batchNumber}`} className="border-t">
                <td className="p-2">{med.medicineName}</td>
                <td className="p-2">{med.batchNumber}</td>
                <td className="p-2">{new Date(med.expiryDate).toLocaleDateString()}</td>
                <td className="p-2">{med.quantity}</td>
                <td className="p-2">₹{med.pricePerUnit.toFixed(2)}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(med.medicineName, med.batchNumber)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(med.medicineName, med.batchNumber)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
