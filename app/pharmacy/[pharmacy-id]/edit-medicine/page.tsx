'use client';

import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditMedicinePage() {
  const { 'pharmacy-id': pharmacyId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const medicineName = searchParams.get('medicineName') || '';
  const batchNumber = searchParams.get('batchNumber') || '';

  const [formData, setFormData] = useState({
    expiryDate: '',
    quantity: 0,
    pricePerUnit: 0,
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMedicine = async () => {
      const res = await fetch(`/api/pharmacy/${pharmacyId}/medicine/${medicineName}/${batchNumber}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch medicine');
      } else {
        setFormData({
          expiryDate: data.expiryDate?.slice(0, 10), // format for input date
          quantity: data.quantity,
          pricePerUnit: data.pricePerUnit,
        });
      }
    };

    if (medicineName && batchNumber) fetchMedicine();
  }, [medicineName, batchNumber, pharmacyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'pricePerUnit' ? +value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/pharmacy/${pharmacyId}/edit-medicine`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName, batchNumber, ...formData }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update medicine');
      } else {
        setMessage(data.message);
        router.push(`/pharmacy/${pharmacyId}/medicines-list`);
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Medicine</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Price Per Unit</label>
          <input
            type="number"
            step="0.01"
            name="pricePerUnit"
            value={formData.pricePerUnit}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update
        </button>
      </form>
    </div>
  );
}
