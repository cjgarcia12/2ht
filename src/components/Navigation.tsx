'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-pink-400 hover:text-pink-300 transition-colors">
            2HTSounds
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-200 hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-gray-200 hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </Link>
              <Link href="/shows" className="text-gray-200 hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Shows
              </Link>
              <Link href="/songs" className="text-gray-200 hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Songs
              </Link>
              <Link href="/book" className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Book Us
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white hover:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
            <Link href="/" className="text-gray-200 hover:text-pink-400 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-200 hover:text-pink-400 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              About
            </Link>
            <Link href="/shows" className="text-gray-200 hover:text-pink-400 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Shows
            </Link>
            <Link href="/songs" className="text-gray-200 hover:text-pink-400 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Songs
            </Link>
            <Link href="/book" className="bg-pink-600 hover:bg-pink-500 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Book Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 