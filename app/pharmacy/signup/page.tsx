'use client';

import { useState } from 'react';

export default function PharmacyRegisterPage() {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    username: '',
    address: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/pharmacy/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setMessage(data.message);
        setFormData({
          id: '',
          name: '',
          phone: '',
          email: '',
          username: '',
          address: '',
          password: '',
        });
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Pharmacy Registration</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {message && <p className="text-green-600 text-sm mb-2">{message}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'id', type: 'text', placeholder: 'Pharmacy ID' },
          { name: 'name', type: 'text', placeholder: 'Pharmacy Name' },
          { name: 'phone', type: 'tel', placeholder: 'Phone Number' },
          { name: 'email', type: 'email', placeholder: 'Email Address' },
          { name: 'username', type: 'text', placeholder: 'Username' },
          { name: 'address', type: 'text', placeholder: 'Address' },
          { name: 'password', type: 'password', placeholder: 'Password (min 8 characters)' },
        ].map(({ name, type, placeholder }) => (
          <div key={name}>
            <input
              type={type}
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
              placeholder={placeholder}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        ))}
        
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
