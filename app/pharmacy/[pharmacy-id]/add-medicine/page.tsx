'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function AddMedicinePage() {
  const { 'pharmacy-id': pharmacyId } = useParams();
  const [formData, setFormData] = useState({
    medicineName: '',
    batchNumber: '',
    expiryDate: '',
    quantity: 0,
    pricePerUnit: 0,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' || name === 'pricePerUnit' ? +value : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch(`/api/pharmacy/${pharmacyId}/add-medicine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, pharmacyId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setMessage(data.message);
        setFormData({
          medicineName: '',
          batchNumber: '',
          expiryDate: '',
          quantity: 0,
          pricePerUnit: 0,
        });
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Medicine</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="medicineName" placeholder="Medicine Name" value={formData.medicineName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
        <input type="text" name="batchNumber" placeholder="Batch Number" value={formData.batchNumber} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
        <input type="date" name="expiryDate" placeholder="Expiry Date" value={formData.expiryDate} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
        <input type="number" step="0.01" name="pricePerUnit" placeholder="Price per Unit" value={formData.pricePerUnit} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />

        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Add Medicine
        </button>
      </form>
    </div>
  );
}
