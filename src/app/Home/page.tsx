'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type PageItem = {
  title: string;
  date: string;
};

export default function HomePage() {
  const router = useRouter();
  const [recentlyVisited, setRecentlyVisited] = useState<PageItem[]>([]);

  // Load pages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentPages');
    const parsed: PageItem[] = stored ? JSON.parse(stored) : [];
  
    // Always ensure Welcome Page is there if nothing else
    if (parsed.length === 0) {
      const defaultPage = {
        title: "Welcome Page",
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        }),
      };
      localStorage.setItem('recentPages', JSON.stringify([defaultPage]));
      localStorage.setItem(
        'page-Welcome Page',
        `
        <h2 style="font-size: 40px; font-weight: bold; color: #4ade80;">Welcome to Time-Manager</h2>
        <p style="font-size: 18px; margin-top: 10px; text-decoration:underline;">
          We are <strong>excited</strong> to help you take control of your time and <em>boost your productivity</em>.
        </p>
        <p style="font-size: 18px; margin-top: 10px;">
          Whether you're managing <u>daily tasks</u> or planning <u>long-term goals</u>, we have the tools you need to stay 
          <span style="color: #60a5fa;">organized</span> and <span style="color: #f87171;">stress-free</span>.
        </p>
        <p style="font-size: 18px; margin-top: 10px;">
          <strong>Let's make every minute count.</strong> ⏳
        </p>
        `
      );
      
      setRecentlyVisited([defaultPage]);
    } else {
      setRecentlyVisited(parsed);
    }
  }, []);

  const handleCardClick = (title: string) => {
    router.push(`/page/${encodeURIComponent(title)}`);
  };

  const handleAddNewPage = () => {
    router.push('/new');
  };
  return (
    <div className="flex min-h-screen bg-[#1e1e1e] text-white ml-[20%]">
      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold underline">Good Evening, Yuvraj Mishra</h1>
        </div>

        {/* Recently Visited */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Recently Visited:</h2>
          {recentlyVisited.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {recentlyVisited.map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleCardClick(item.title)}
                  className="bg-[#2c2c2c] p-4 hover:bg-[#3c3c3c] rounded-lg shadow hover:shadow-xl cursor-pointer transition duration-300"
                >
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400 mb-6">No pages visited yet.</div>
          )}
        </div>

        {/* Welcome Box */}
        {/* <div
          onClick={() => handleCardClick("Welcome Page")}
          className="bg-[#2c2c2c] p-6 rounded-lg shadow-md max-w-2xl cursor-pointer hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold flex items-center gap-2">
            📄 Welcome Page
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            This is your first page. You can create documents, take notes,
            organize tasks, and more. Click to start editing.
          </p>
        </div> */}

        {/* Add New Page */}
        <div
          onClick={handleAddNewPage}
          className="mt-4 text-sm text-blue-400 hover:underline cursor-pointer"
        >
          + Add a new page
        </div>
      </main>
    </div>
  );
}
