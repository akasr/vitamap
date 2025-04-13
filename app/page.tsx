'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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

type Pharmacy = {
  name: string;
  distance: string;
};

const mockPharmacies: Pharmacy[] = [
  // { name: 'HealthPlus Pharmacy', distance: '0.5 miles' },
  // { name: 'CareRx', distance: '1.2 miles' },
  // { name: 'MediMart', distance: '2.0 miles' },
];

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
    ctaText: 'Find medicines . .',
    ctaLink: '/search',
    icon: <FaMapMarkerAlt className="text-teal-500 text-6xl mb-6" />,
    image: '/images/pharmacy.jpg',
  },
  {
    id: 'inventory',
    title: 'Manage Your Pharmacy',
    description:
      'Effortlessly track and update your medicine inventory with our powerful tools.',
    ctaText: 'Login as Pharmacy',
    ctaLink: '/pharmacy/signin',
    icon: <FaStore className="text-yellow-500 text-6xl mb-6" />,
    image: '/images/manage.png',
  },
  {
    id: 'chatbot',
    title: 'Ask Our Medicine Chatbot',
    description:
      'Get instant answers about medicines, dosages, and more from our AI assistant.',
    ctaText: 'Try Chatbot',
    ctaLink: '/chat',
    icon: <FaRobot className="text-teal-500 text-6xl mb-6" />,
    image: '/images/chatbot.png',
  },
  {
    id: 'cta',
    title: 'Join VitaMap Today',
    description:
      "Whether you're finding medicines or running a pharmacy, VitaMap has you covered.",
    ctaText: 'Get Started',
    ctaLink: '/pharmacy/signup',
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
  const [hasAnimated, setHasAnimated] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

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
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

  const goToSlide = (index: number) => {
    const element = slideRefs.current[index];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setCurrentSlide(index);
    }
  };

  const handleChatbotClick = () => {
    setIsChatOpen(true);
    setTimeout(() => {
      setIsChatOpen(false);
    }, 5000);
  };

  // Handle navigation with proper event handling
  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(path);
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-700 to-gray-800 text-gray-200 min-h-screen">
      {/* Particle Background - moved to bottom to prevent z-index issues */}
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

      {/* Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 py-4 ${
          !hasAnimated ? 'h-screen' : 'h-[13vh]'
        }`}
        style={{
          transition: 'height 1.3s ease-in-out',
        }}
      >
        <h1 className="text-5xl sm:text-4xl font-extrabold text-gray-100 tracking-wide text-center">
          WELCOME TO <span className="text-teal-500">VITAMAP</span>
        </h1>
      </div>

      {/* Permanent Join Now Button */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          className="bg-purple-600 text-gray-100 hover:bg-purple-700 rounded-xl px-4 py-2 shadow-lg transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(slides.length - 1);
          }}
        >
          Join Now
        </Button>
      </div>

      {/* Slides */}
      <div className="relative z-10 pt-[13vh]">
        {slides.map((slide, index) => (
          <section
            key={slide.id}
            ref={(el) => {
              slideRefs.current[index] = el as HTMLDivElement | null;
            }}
            className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 snap-start"
          >
            <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
              {/* Left: Text and CTA */}
              <div className="lg:w-1/2 text-center lg:text-left">
                {slide.icon}
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-100 mb-6">
                  {slide.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-md mx-auto lg:mx-0">
                  {slide.description}
                </p>
                <Button
                  className="bg-teal-600 text-gray-100 hover:bg-teal-700 rounded-xl px-6 py-3 text-lg transition-colors duration-300"
                  onClick={(e) => handleNavigation(e, slide.ctaLink)}
                >
                  {slide.ctaText}
                </Button>
              </div>
              {/* Right: Image */}
              <div className="lg:w-1/2">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-64 sm:h-96 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Chatbot Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="bg-purple-600 text-gray-100 hover:bg-purple-700 rounded-full p-4 shadow-lg transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleChatbotClick();
            router.push('/chat');
          }}
        >
          <FaComment size={24} />
        </Button>
      </div>
    </div>
  );
}
