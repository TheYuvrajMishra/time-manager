'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, CalendarCheck } from 'lucide-react'

function AI() {
  const router = useRouter()

  const handleclickChatbot = () => {
    router.push('/AI/chatbot')
  }

  const handleclickRoutine = () => {
    router.push('/AI/Routine/routine')
  }

  useEffect(() => {
    // Create subtle sparkle effect
    const sparkleContainer = document.querySelector('.sparkles-container');

    const createSparkle = () => {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle');
      sparkleContainer?.appendChild(sparkle);

      // Set random position
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;

      // Remove sparkle after animation duration
      setTimeout(() => {
        sparkle.remove();
      }, 2500); // Increased time for slower disappearance
    };

    // Generate sparkles every 150ms (less frequent)
    const interval = setInterval(createSparkle, 150);

    return () => {
      clearInterval(interval); // Cleanup on component unmount
    };
  }, []);

  return (
    <div className="ml-[20%] bg-gradient-to-r from-[#101010] via-[#232323] overflow-hidden to-[#101010] min-h-screen flex flex-col items-center justify-center gap-14 p-12 text-white relative">
      {/* Sparkles Container */}
      <div className="sparkles-container absolute top-0 left-0 w-full h-full pointer-events-none"></div>

      {/* Heading */}
      <div className="text-center mb-12 z-10">
        <h1 className="text-5xl font-bold text-yellow-300 mb-3">"Our AI Tools"</h1>
        <p className="text-lg text-gray-300">Explore innovative solutions powered by AI that will boost your productivity.</p>
      </div>

      {/* Cards */}
      <div className="flex flex-row gap-12 items-center justify-center z-10">
        {/* Chatbot Button */}
        <div
          onClick={handleclickChatbot}
          className="w-80 p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-dashed border-yellow-400/30 hover:border-yellow-400 transition-all cursor-pointer shadow-xl hover:shadow-2xl transform duration-300 ease-in-out"
        >
          <div className="flex items-center gap-4 mb-3">
            <Bot className="text-yellow-300" size={32} />
            <h2 className="text-2xl font-semibold text-white">Chat Bot</h2>
          </div>
          <p className="text-sm text-gray-300">Get instant answers and support from our AI assistant.</p>
        </div>

        {/* Routine Generator Button */}
        <div
          onClick={handleclickRoutine}
          className="w-80 p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-dashed border-yellow-400/30 hover:border-yellow-400 transition-all cursor-pointer shadow-xl hover:shadow-2xl transform duration-300 ease-in-out"
        >
          <div className="flex items-center gap-4 mb-3">
            <CalendarCheck className="text-yellow-300" size={32} />
            <h2 className="text-2xl font-semibold text-white">Routine Generator</h2>
          </div>
          <p className="text-sm text-gray-300">Generate daily routines tailored to your schedule and goals.</p>
        </div>
      </div>
    </div>
  )
}

export default AI
