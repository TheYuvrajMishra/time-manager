'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type PageItem = {
  title: string;
  date: string;
};

export default function NewPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      alert('Please enter a title for your page.');
      return;
    }
  
    const newPage = {
      title,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      }),
    };
  
    const existing = localStorage.getItem('recentPages');
    const updated = existing ? JSON.parse(existing) : [];
  
    // Avoid duplicates
    const filtered = updated.filter((item: any) => item.title !== title);
    filtered.unshift(newPage);
  
    localStorage.setItem('recentPages', JSON.stringify(filtered));
    localStorage.setItem(`page-${title}`, description); // store content
  
    router.push(`/page/${encodeURIComponent(title)}`);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex items-center justify-center px-4">
      <div className="bg-[#2c2c2c] rounded-2xl shadow-lg p-8 max-w-xl w-full">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6 text-center">📝 Create a New Page</h1>

        {/* Title */}
        <div className="mb-5">
          <label htmlFor="title" className="block text-sm text-gray-400 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your page title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm text-gray-400 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 transition font-semibold"
          >
            Create Page
          </button>
        </div>
      </div>
    </div>
  );
}
