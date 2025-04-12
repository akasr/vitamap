'use client';

import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPills, FaSave, FaTimes, FaUndo } from 'react-icons/fa';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';

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
  const [initialFormData, setInitialFormData] = useState({
    expiryDate: '',
    quantity: 0,
    pricePerUnit: 0,
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    expiryDate: '',
    quantity: '',
    pricePerUnit: '',
  });

  const expiryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        const res = await fetch(`
          /api/pharmacy/${pharmacyId}/medicine/${medicineName}/${batchNumber}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to fetch medicine');
        } else {
          const fetchedData = {
            expiryDate: data.expiryDate?.slice(0, 10) || '',
            quantity: data.quantity || 0,
            pricePerUnit: data.pricePerUnit || 0,
          };
          setFormData(fetchedData);
          setInitialFormData(fetchedData);
        }
      } catch (err) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    if (medicineName && batchNumber) fetchMedicine();
  }, [medicineName, batchNumber, pharmacyId]);

  useEffect(() => {
    if (!loading && expiryInputRef.current) {
      expiryInputRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const validateForm = () => {
    const errors = {
      expiryDate: '',
      quantity: '',
      pricePerUnit: '',
    };
    let isValid = true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.expiryDate);
    if (selectedDate < today) {
      errors.expiryDate = 'Expiry date must be today or in the future';
      isValid = false;
    }

    if (formData.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
      isValid = false;
    }

    if (formData.pricePerUnit < 0) {
      errors.pricePerUnit = 'Price cannot be negative';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'pricePerUnit' ? +value : value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/pharmacy/${pharmacyId}/edit-medicine`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName, batchNumber, ...formData }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update medicine');
      } else {
        setMessage(data.message || 'Medicine updated successfully');
        router.push(`/pharmacy/${pharmacyId}/medicines-list`);
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setValidationErrors({ expiryDate: '', quantity: '', pricePerUnit: '' });
  };

  const handleCancel = () => {
    router.push(`/pharmacy/${pharmacyId}/medicines-list`);
  };

  // const particlesInit = async (engine: Engine) => {
  //   await loadFull(engine);
  // };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center py-12 px-4">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        // init={particlesInit}
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'repulse' },
              onClick: { enable: true, mode: 'push' },
              resize: true,
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { quantity: 4 },
            },
          },
          particles: {
            color: { value: ['#ffffff', '#0d9488', '#7e22ce'] },
            links: {
              color: '#ffffff',
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              random: false,
              speed: 1.5,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 60,
            },
            opacity: { value: 0.4 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-auto bg-white bg-opacity-10 backdrop-blur-2xl border border-teal-500/30 rounded-3xl shadow-2xl"
      >
        <Card className="bg-transparent border-none">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold text-gray-900 text-center">
              Edit Medicine
            </CardTitle>
            <p className="text-gray-600 text-center font-semibold">
              {medicineName} ({batchNumber})
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4"
                >
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4"
                >
                  <Alert className="bg-green-500/20 text-green-600 border-green-500/50">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full bg-white/10 rounded-xl" />
                <Skeleton className="h-12 w-full bg-white/10 rounded-xl" />
                <Skeleton className="h-12 w-full bg-white/10 rounded-xl" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label
                            htmlFor="expiryDate"
                            className="text-gray-900 font-semibold"
                          >
                            Expiry Date
                          </Label>
                          <Input
                            id="expiryDate"
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                            ref={expiryInputRef}
                            className="mt-1 bg-white bg-opacity-10 border-teal-500/30 text-gray-800 rounded-xl focus:ring-teal-500"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-gray-200">
                        <p>Enter a future date for expiry</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {validationErrors.expiryDate && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.expiryDate}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label
                            htmlFor="quantity"
                            className="text-gray-900 font-semibold"
                          >
                            Quantity
                          </Label>
                          <Input
                            id="quantity"
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            className="mt-1 bg-white bg-opacity-10 border-teal-500/30 text-gray-800 rounded-xl focus:ring-teal-500"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-gray-200">
                        <p>Enter the available stock quantity</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {validationErrors.quantity && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.quantity}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Label
                            htmlFor="pricePerUnit"
                            className="text-gray-900 font-semibold"
                          >
                            Price Per Unit
                          </Label>
                          <Input
                            id="pricePerUnit"
                            type="number"
                            step="0.01"
                            name="pricePerUnit"
                            value={formData.pricePerUnit}
                            onChange={handleChange}
                            required
                            className="mt-1 bg-white bg-opacity-10 border-teal-500/30 text-gray-800 rounded-xl focus:ring-teal-500"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-gray-200">
                        <p>Enter the price per unit in rupees</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {validationErrors.pricePerUnit && (
                    <p className="text-red-600 text-sm mt-1">
                      {validationErrors.pricePerUnit}
                    </p>
                  )}
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1"
                  >
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-teal-600 text-gray-100 hover:bg-teal-700 rounded-xl transition-colors"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          Update
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      onClick={handleReset}
                      className="w-full bg-purple-600 text-gray-100 hover:bg-purple-700 rounded-xl transition-colors"
                    >
                      <FaUndo className="mr-2" />
                      Reset
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1"
                  >
                    <Button
                      type="button"
                      onClick={handleCancel}
                      className="w-full bg-red-600 text-gray-100 hover:bg-red-700 rounded-xl transition-colors"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// 'use client';

// import { useSearchParams, useParams, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function EditMedicinePage() {
//   const { 'pharmacy-id': pharmacyId } = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const medicineName = searchParams.get('medicineName') || '';
//   const batchNumber = searchParams.get('batchNumber') || '';

//   const [formData, setFormData] = useState({
//     expiryDate: '',
//     quantity: 0,
//     pricePerUnit: 0,
//   });

//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const fetchMedicine = async () => {
//       const res = await fetch(`/api/pharmacy/${pharmacyId}/medicine/${medicineName}/${batchNumber}`);
//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || 'Failed to fetch medicine');
//       } else {
//         setFormData({
//           expiryDate: data.expiryDate?.slice(0, 10), // format for input date
//           quantity: data.quantity,
//           pricePerUnit: data.pricePerUnit,
//         });
//       }
//     };

//     if (medicineName && batchNumber) fetchMedicine();
//   }, [medicineName, batchNumber, pharmacyId]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'quantity' || name === 'pricePerUnit' ? +value : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');

//     try {
//       const res = await fetch(`/api/pharmacy/${pharmacyId}/edit-medicine`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ medicineName, batchNumber, ...formData }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.error || 'Failed to update medicine');
//       } else {
//         setMessage(data.message);
//         router.push(`/pharmacy/${pharmacyId}/medicines-list`);
//       }
//     } catch (err) {
//       setError('Server error');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
//       <h2 className="text-xl font-bold mb-4 text-center">Edit Medicine</h2>
//       {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//       {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm">Expiry Date</label>
//           <input
//             type="date"
//             name="expiryDate"
//             value={formData.expiryDate}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm">Quantity</label>
//           <input
//             type="number"
//             name="quantity"
//             value={formData.quantity}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <div>
//           <label className="block text-sm">Price Per Unit</label>
//           <input
//             type="number"
//             step="0.01"
//             name="pricePerUnit"
//             value={formData.pricePerUnit}
//             onChange={handleChange}
//             required
//             className="w-full px-3 py-2 border rounded"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           Update
//         </button>
//       </form>
//     </div>
//   );
// }
