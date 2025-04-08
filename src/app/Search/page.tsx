import React from 'react'
export default function Search() {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-10 z-50">
      <div className="bg-[#1e1e1e] rounded-xl p-4 shadow-lg w-full max-w-2xl">
        {/* Search Input */}
        <input
          type="text"
          autoFocus
          placeholder="Search or ask a question..."
          className="w-full px-4 py-2 rounded-lg bg-[#2c2c2c] text-white outline-none placeholder:text-gray-500"
        />

        {/* Recent Results List */}
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-400">Today</div>
          <div className="bg-[#2c2c2c] rounded-md p-2 text-white hover:bg-[#3a3a3a] cursor-pointer">
            That Month Of The Year
          </div>
          <div className="bg-[#2c2c2c] rounded-md p-2 text-white hover:bg-[#3a3a3a] cursor-pointer">
            New page
          </div>
          <div className="bg-[#2c2c2c] rounded-md p-2 text-white hover:bg-[#3a3a3a] cursor-pointer">
            Commerce Helper
          </div>
        </div>
      </div>
    </div>
  );
}

