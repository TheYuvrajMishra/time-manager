'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [timePerDay, setTimePerDay] = useState('');
  const [busyTime, setBusyTime] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePrompt = () => {
    return `I want to learn ${topic}, within ${duration}. I can invest ${timePerDay} daily. I am usually busy during ${busyTime}.`;
  };

  const handleSend = async () => {
    setLoading(true);
    const message = generatePrompt();

    const res = await fetch('/api/routineApi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    let replyText = data.reply || '';

    const firstBrace = replyText.indexOf('{');
    const lastBrace = replyText.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      console.error('Could not find valid JSON braces in the response');
      setLoading(false);
      return;
    }

    const jsonString = replyText.slice(firstBrace, lastBrace + 1);

    try {
      const routine = JSON.parse(jsonString);
      router.push(`/result?data=${encodeURIComponent(JSON.stringify(routine))}`);
    } catch (error) {
      console.error('Failed to parse cleaned JSON:', error);
      console.log('Here is the extracted JSON string:', jsonString);
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col ml-[20%] h-screen bg-[#202020] text-white">
      {/* Header */}
      <header className="px-6 py-4 bg-[#101010] border-b border-[#303030]">
        <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-white">
          🧠 Routine Generator
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-xl bg-[#1a1a1a] p-8 rounded-2xl shadow-lg border border-dashed border-white/10 backdrop-blur-sm">
          <h2 className="text-lg font-medium mb-4">Fill your learning details</h2>

          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-xl bg-[#101010] text-white border border-white/20"
            placeholder="Which topic do you want to learn?"
          />
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-xl bg-[#101010] text-white border border-white/20"
            placeholder="In the duration of? (e.g., 2 months)"
          />
          <input
            value={timePerDay}
            onChange={(e) => setTimePerDay(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-xl bg-[#101010] text-white border border-white/20"
            placeholder="How much time can you invest daily? (e.g., 2 hours)"
          />
          <input
            value={busyTime}
            onChange={(e) => setBusyTime(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-xl bg-[#101010] text-white border border-white/20"
            placeholder="When are you usually busy? (e.g., 9 AM - 5 PM)"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full py-2 rounded-xl bg-yellow-500/20 border border-dashed border-yellow-300 text-white font-semibold hover:brightness-150 cursor-pointer transition drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]"
          >
            {loading ? 'Loading...' : '✨ Generate Routine'}
          </button>
        </div>
      </div>
    </main>
  );
}
