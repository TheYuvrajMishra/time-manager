'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';

type RoutineItem = { time: string; activity: string };
type Routine = Record<string, RoutineItem[]>;

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [routine, setRoutine] = useState<Routine>({});

  useEffect(() => {
    const rawData = searchParams.get('data');
    if (!rawData) return;

    try {
      const decoded = decodeURIComponent(rawData);
      const parsed = JSON.parse(decoded);
      if (typeof parsed === 'object') {
        setRoutine(parsed);
      }
    } catch (err) {
      console.error('Failed to parse routine:', err);
    }
  }, [searchParams]);

  const handleReset = () => {
    const confirmed = confirm('Are you sure you want to reset your routine?');
    if (confirmed) {
      setRoutine({});
      router.push('/routine');
    }
  };
  

  return (
    <main className="flex flex-col ml-[20%] h-screen bg-[#202020] text-white">
      {/* Header */}
      <header className="px-6 py-4 bg-[#101010] border-b border-[#303030]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-white">
            🗓️ Your Daily Routine
          </h1>
          <button
            onClick={handleReset}
            className="bg-black hover:bg-white/50 cursor-pointer text-white hover:text-black border border-dashed border-white/20 px-4 py-2 rounded-xl transition-all drop-shadow-[0_0_6px_rgba(255,0,0,0.3)]"
          >
            Go Back
          </button>
        </div>
      </header>

      {/* Routine Table */}
      <section className="flex-1 overflow-y-auto px-6 py-8">
        {Object.keys(routine).length === 0 ? (
          <p className="text-gray-300 text-center text-lg mt-10">
            No routine data available.
          </p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse shadow-md text-sm">
              <thead>
                <tr className="bg-[#101010] text-white border-b border-white/10">
                  <th className="px-6 py-3 text-left font-semibold border-b border-white/10">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left font-semibold border-b border-white/10">
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(routine).map(([partOfDay, tasks]) => (
                  <React.Fragment key={partOfDay}>
                    <tr className="bg-[#2a2a2a] border-t border-white/10">
                      <td
                        colSpan={2}
                        className="px-6 py-3 font-bold uppercase text-cyan-400 tracking-wide border-b border-white/10"
                      >
                        {partOfDay}
                      </td>
                    </tr>
                    {tasks.map((task, i) => (
                      <tr key={i} className="hover:bg-[#2e2e2e] transition">
                        <td className="px-6 py-2 border-b border-white/10">
                          <input type="checkbox" name="" id="" /> 🕒 {task.time}
                        </td>
                        <td className="px-6 py-2 border-b border-white/10">
                          📌 {task.activity}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
