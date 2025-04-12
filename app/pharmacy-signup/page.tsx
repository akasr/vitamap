'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaIdCard,
  FaStore,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaMapMarkerAlt,
  FaLock,
  FaUserPlus,
} from 'react-icons/fa';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

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
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  // const particlesInit = async (engine: Engine) => {
  //   await loadFull(engine);
  // };

  const inputFields = [
    {
      name: 'id',
      type: 'text',
      placeholder: 'Pharmacy ID',
      icon: <FaIdCard className="text-blue-600" />,
    },
    {
      name: 'name',
      type: 'text',
      placeholder: 'Pharmacy Name',
      icon: <FaStore className="text-blue-600" />,
    },
    {
      name: 'phone',
      type: 'tel',
      placeholder: 'Phone Number',
      icon: <FaPhone className="text-blue-600" />,
    },
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email Address',
      icon: <FaEnvelope className="text-blue-600" />,
    },
    {
      name: 'username',
      type: 'text',
      placeholder: 'Username',
      icon: <FaUser className="text-blue-600" />,
    },
    {
      name: 'address',
      type: 'text',
      placeholder: 'Address',
      icon: <FaMapMarkerAlt className="text-blue-600" />,
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password (min 8 characters)',
      icon: <FaLock className="text-blue-600" />,
    },
  ];

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(30, 58, 138, 0.7), rgba(30, 58, 138, 0.7)), url('https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
      }}
    >
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
            color: { value: ['#ffffff', '#60a5fa', '#fefcbf'] },
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
        className="relative z-10 max-w-lg w-full mx-4 p-8 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-3xl shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-3xl -z-10" />
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-center text-gray-800 mb-6 drop-shadow-lg"
        >
          Pharmacy Registration
        </motion.h2>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-600 text-sm mb-4 text-center bg-red-500/20 p-2 rounded-md"
            >
              {error}
            </motion.p>
          )}
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-green-600 text-sm mb-4 text-center bg-green-500/20 p-2 rounded-md"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {inputFields.map(({ name, type, placeholder, icon }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className="relative"
            >
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                {icon}
              </div>
              <input
                type={type}
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              />
            </motion.div>
          ))}

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-gray-100 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
          >
            <FaUserPlus /> Register
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-700 mt-6 text-sm"
        >
          Already have an account?{' '}
          <a
            href="/pharmacy/signin"
            className="text-blue-500 font-semibold hover:underline hover:text-blue-700 transition-all duration-300"
          >
            Login
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
