'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  FaSearch,
  FaPills,
  FaStore,
  FaRobot,
  FaMapMarkerAlt,
  FaComment,
} from 'react-icons/fa';

// Mock data for demo search
type Pharmacy = {
  name: string;
  distance: string;
};

const mockPharmacies: Pharmacy[] = [
  { name: 'HealthPlus Pharmacy', distance: '0.5 miles' },
  { name: 'CareRx', distance: '1.2 miles' },
  { name: 'MediMart', distance: '2.0 miles' },
];

// Slides data
type Slide = {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  icon: JSX.Element;
  image: string;
};

const slides: Slide[] = [
  {
    id: 'location',
    title: 'Find Pharmacies Near You',
    description:
      'Discover nearby pharmacies with real-time medicine availability in just a few clicks.',
    ctaText: 'Explore Pharmacies',
    ctaLink: '/search',
    icon: <FaMapMarkerAlt className="text-teal-500 text-6xl mb-6" />,
    image: '/images/pharmacy.jpg',
  },
  {
    id: 'order',
    title: 'Order Medicines with Ease',
    description:
      'Browse and order medicines from trusted pharmacies, delivered to your door.',
    ctaText: 'Shop Now',
    ctaLink: '/order',
    icon: <FaPills className="text-purple-500 text-6xl mb-6" />,
    image: '/images/medicine.jpg',
  },
  {
    id: 'inventory',
    title: 'Manage Your Pharmacy',
    description:
      'Effortlessly track and update your medicine inventory with our powerful tools.',
    ctaText: 'Join as Pharmacy',
    ctaLink: '/pharmacy/register',
    icon: <FaStore className="text-yellow-500 text-6xl mb-6" />,
    image: '/images/manage.png',
  },
  {
    id: 'chatbot',
    title: 'Ask Our Medicine Chatbot',
    description:
      'Get instant answers about medicines, dosages, and more from our AI assistant.',
    ctaText: 'Try Chatbot',
    ctaLink: '#chatbot',
    icon: <FaRobot className="text-teal-500 text-6xl mb-6" />,
    image: '/images/chatbot.png',
  },
  {
    id: 'cta',
    title: 'Join VitaMap Today',
    description:
      'Whether you’re finding medicines or running a pharmacy, VitaMap has you covered.',
    ctaText: 'Get Started',
    ctaLink: '/signup',
    icon: <FaPills className="text-purple-500 text-6xl mb-6" />,
    image: '/images/logo.jpg',
  },
];

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockPharmacies);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle scroll to slide
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      slideRefs.current.forEach((ref, index) => {
        if (
          ref &&
          ref.offsetTop <= scrollPosition &&
          ref.offsetTop + ref.offsetHeight > scrollPosition
        ) {
          setCurrentSlide(index);
          window.removeEventListener('scroll', handleScroll); // Remove listener after first trigger
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = mockPharmacies.filter((pharmacy) =>
          pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setSearchResults(filtered);
        setIsSearchOpen(true);
      } else {
        setSearchResults(mockPharmacies);
        setIsSearchOpen(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Particles init
  const particlesInit = async (engine: Engine) => {
    await loadFull(engine);
  };

  // Navigate to slide
  const goToSlide = (index: number) => {
    slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    setCurrentSlide(index);
  };

  // Mock chatbot interaction
  const handleChatbotClick = () => {
    setIsChatOpen(true);
    setTimeout(() => {
      setIsChatOpen(false);
    }, 5000);
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200 min-h-screen">
      {/* Particle Background */}
      <AnimatePresence>
        {currentSlide === 0 && (
          <motion.div
            initial={{ y: 0, height: '100vh' }}
            animate={{
              y: 0,
              height: '13vh',
            }}
            transition={{
              // delay: 0,
              duration: 1.3,
              ease: 'easeInOut',
            }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 py-4"
          >
            <h1 className="text-5xl sm:text-4xl font-extrabold text-gray-100 tracking-wide text-center">
              WELCOME TO <span className="text-teal-500">VITAMAP</span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      <Particles
        id="tsparticles"
        init={particlesInit}
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

      {/* Slides */}
      {slides.map((slide, index) => (
        <motion.section
          key={slide.id}
          ref={(el) => {
            slideRefs.current[index] = el as HTMLDivElement | null;
          }}
          className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 snap-start"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Text and CTA */}
            <motion.div
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {slide.icon}
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-100 mb-6">
                {slide.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-md mx-auto lg:mx-0">
                {slide.description}
              </p>
              {slide.id === 'location' && (
                <div className="relative max-w-md mx-auto lg:mx-0 mb-8">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
                    <Input
                      type="text"
                      placeholder="Find pharmacies near you..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white bg-opacity-10 border-teal-500/30 text-gray-200 rounded-xl focus:ring-teal-500"
                    />
                  </div>
                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-2"
                      >
                        <Card className="bg-gray-900 bg-opacity-90 border-teal-500/30 rounded-xl">
                          <CardContent className="p-4">
                            {searchResults.length ? (
                              searchResults.map((pharmacy) => (
                                <div
                                  key={pharmacy.name}
                                  className="text-gray-200 hover:bg-teal-500/20 p-2 rounded cursor-pointer"
                                  onClick={() => router.push('/search')}
                                >
                                  {pharmacy.name} - {pharmacy.distance}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-400">
                                No pharmacies found.
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  className="bg-teal-600 text-gray-100 hover:bg-teal-700 rounded-xl px-6 py-3 text-lg"
                  onClick={() => router.push(slide.ctaLink)}
                >
                  {slide.ctaText}
                </Button>
              </motion.div>
            </motion.div>
            {/* Right: Image */}
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-64 sm:h-96 object-cover rounded-xl"
              />
            </motion.div>
          </div>
        </motion.section>
      ))}

      {/* Navigation Dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-3">
        {slides.map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentSlide === index ? 'bg-teal-500' : 'bg-gray-400'
            }`}
            whileHover={{ scale: 1.2 }}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Chatbot Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          className="bg-purple-600 text-gray-100 hover:bg-purple-700 rounded-full p-4"
          onClick={handleChatbotClick}
        >
          <FaComment size={24} />
        </Button>
      </motion.div>

      {/* Chatbot Preview */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-20 right-6 z-50"
          >
            <Card className="bg-white bg-opacity-10 backdrop-blur-md border-teal-500/30 w-80">
              <CardContent className="p-4">
                <p className="text-gray-200">Hi! Ask me about medicines...</p>
                <p className="text-gray-400 italic">
                  e.g., "What is Paracetamol?"
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
