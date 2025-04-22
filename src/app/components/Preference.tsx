"use client";
import { useRouter } from "next/navigation"; // ✅ Correct import for App Router
import React, { useState } from "react";

const PreferencesPage = () => {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("english");
  const [emailUpdates, setEmailUpdates] = useState(false);

  const router = useRouter(); // ✅ Initialize router

  const handleSave = () => {
    alert("Preferences saved!");
    router.push("/Home"); // ✅ This works with next/navigation
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] p-6 rounded-xl shadow-xl border border-gray-700 space-y-6">
        <h1 className="text-xl font-semibold">Preferences</h1>

        {/* Theme */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Theme</label>
          <select
            className="w-full px-3 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 ring-blue-500"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Language</label>
          <select
            className="w-full px-3 py-2 rounded bg-gray-800 text-white outline-none focus:ring-2 ring-blue-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="french">French</option>
          </select>
        </div>

        {/* Email Updates */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="emailUpdates"
            checked={emailUpdates}
            onChange={(e) => setEmailUpdates(e.target.checked)}
            className="accent-blue-600"
          />
          <label htmlFor="emailUpdates" className="text-sm text-gray-300">
            Enable email updates
          </label>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default PreferencesPage;
