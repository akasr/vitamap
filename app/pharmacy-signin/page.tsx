'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import Particles from 'react-tsparticles';

export default function PharmacyLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/pharmacy/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
      } else {
        setMessage(data.message);
        // Redirect using pharmacyId from response
        console.log('Router object:', router);
        console.log(
          'Redirecting to:',
          `/pharmacy/${data.pharmacyId}/medicines-list`,
        );
        router.push(`/pharmacy/${data.pharmacyId}/medicines-list`);
        console.log('Redirection attempted');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(30, 27, 75, 0.7), rgba(30, 27, 75, 0.7)), url('https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Particle Background */}
      <Particles
        id="tsparticles"
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
            color: { value: ['#ffffff', '#0d9488', '#7e22ce', '#fefcbf'] },
            links: {
              color: '#ffffff',
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 80,
            },
            opacity: { value: 0.5 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 5 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-md w-full mx-4 p-8 bg-white bg-opacity-10 backdrop-blur-xl border border-yellow-500/20 rounded-3xl shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-purple-600/20 rounded-3xl -z-10" />
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-center text-black-100 mb-6 drop-shadow-[0_2px_2px_rgba(254,252,191,0.5)]"
        >
          Pharmacy Login
        </motion.h2>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm mb-4 text-center bg-red-500/20 p-2 rounded-md"
            >
              {error}
            </motion.p>
          )}
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-teal-400 text-sm mb-4 text-center bg-teal-500/20 p-2 rounded-md"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-violet-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl   text-violet-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300"
            />
          </div>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 20px rgba(13, 148, 136, 0.5)',
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-purple-700 text-gray-100 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-teal-600 hover:to-purple-800 transition-all duration-300"
          >
            <FaSignInAlt /> Login
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-blue-900 mt-6 text-m"
        >
          Don’t have an account?{' '}
          <a
            href="/pharmacy/signup"
            className="text-teal-400 font-semibold hover:underline hover:text-teal-600 transition-colors duration-300"
          >
            Register
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
