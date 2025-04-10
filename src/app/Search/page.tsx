'use client';

import React, { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Search() {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Load suggestions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentPages');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const titles = parsed.map((p: any) => decodeURIComponent(p.title));
        setSuggestions(titles);
      } catch (e) {
        console.error('Error parsing recentPages:', e);
      }
    }
  }, []);

  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  // Close modal on click outside or Escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        router.push('/Home');
      }
    };
    const handleEscape = (e: KeyboardEvent | KeyboardEventInit) => {
      if (e.key === 'Escape') router.push('/');
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [router]);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (filteredSuggestions[activeIndex]) {
        const encodedTitle = encodeURIComponent(filteredSuggestions[activeIndex]);
        router.push(`/page/${encodedTitle}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-10 z-50">
      <AnimatePresence>
        <motion.div
          ref={modalRef}
          className="relative bg-[#1e1e1e] rounded-xl p-4 shadow-lg w-full max-w-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Close Button */}
          <button
            onClick={() => router.push('/')}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white rounded-full"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Search Input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search or ask a question..."
              className="w-full px-4 py-2 pr-10 rounded-lg bg-[#2c2c2c] text-white outline-none placeholder:text-gray-500"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white  hover:text-white focus:outline-none focus:ring-1 focus:ring-white rounded-full"
                aria-label="Clear"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Suggestions List */}
          {filteredSuggestions.length > 0 && (
            <ul className="mt-4 max-h-64 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`px-4 py-2 rounded cursor-pointer text-gray-500 ${
                    index === activeIndex ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                  }`}
                  onClick={() =>
                    router.push(`/page/${encodeURIComponent(suggestion)}`)
                  }
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
