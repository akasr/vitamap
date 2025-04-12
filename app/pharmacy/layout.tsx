'use client';
import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from 'react-icons/fa';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/pharmacy/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        router.push('/pharmacy/signin');
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-700 
                   text-white rounded-lg shadow-lg flex items-center gap-2 hover:from-red-600 
                   hover:to-rose-800 transition-all duration-300 font-medium"
          aria-label="Logout"
        >
          <FaSignOutAlt /> Logout
        </button>

        {children}
      </div>
    </>
  );
}
