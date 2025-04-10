"use client";
import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [startWeekOnMonday, setStartWeekOnMonday] = useState(false);
  const [autoTimezone, setAutoTimezone] = useState(true);
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#1a1a1a] w-full max-w-5xl rounded-lg shadow-lg flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 p-4 border-r border-gray-700 bg-[#111]">
          <div className="mb-8 flex justify-between items-center">
            <div className="text-lg font-bold">yuvrajmishra</div>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>
          <nav className="space-y-2 text-sm">
            <div className="font-semibold text-gray-400">Account</div>
            <button
              onClick={() => router.push("/settings/preferences")}
              className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
            >
              Preferences
            </button>
            <button
              onClick={() => router.push("/settings/notifications")}
              className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
            >
              Notifications
            </button>
            <button
              onClick={() => router.push("/settings/connections")}
              className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded"
            >
              Connections
            </button>

            <div className="mt-6 font-semibold text-gray-400">Workspace</div>
            <button onClick={() => router.push("/settings/general")} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">General</button>
            <button onClick={() => router.push("/settings/people")} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">People</button>
            <button onClick={() => router.push("/settings/teamspaces")} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">Teamspaces</button>
            <button onClick={() => router.push("/settings/security")} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">Security</button>
            <button onClick={() => router.push("/settings/identity")} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">Identity</button>

            <div className="mt-6 font-semibold text-gray-400">Other</div>
            <button onClick={() => router.push("/settings/sites")} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">Sites</button>
            <button onClick={() => router.push("/settings/emoji")} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">Emoji</button>
            <button onClick={() => router.push("/settings/import")} className="w-full text-left px-2 py-1 hover:bg-gray-700 rounded">Import</button>
          </nav>

          <button className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 rounded text-white">
            Upgrade plan
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-6">Preferences</h2>

          <div className="mb-10">
            <h3 className="text-md font-semibold mb-2">Appearance</h3>
            <p className="text-sm text-gray-400 mb-1">Customize how Notion looks on your device.</p>
            <div className="text-sm text-blue-400 cursor-pointer">Use system setting ▾</div>
          </div>

          <div className="mb-10">
            <h3 className="text-md font-semibold mb-2">Language & Time</h3>

            <div className="mb-4">
              <div className="text-sm font-medium">Language</div>
              <p className="text-sm text-gray-400">Change the language used in the UI.</p>
              <div className="text-sm text-blue-400 mt-1 cursor-pointer">English ▾</div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-medium">Start week on Monday</div>
                <p className="text-sm text-gray-400">Affects all calendars.</p>
              </div>
              <Switch
                checked={startWeekOnMonday}
                onChange={setStartWeekOnMonday}
                className={`${startWeekOnMonday ? "bg-blue-600" : "bg-gray-600"} relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="inline-block h-4 w-4 transform bg-white rounded-full transition" />
              </Switch>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-medium">Set timezone automatically</div>
                <p className="text-sm text-gray-400">Based on your location.</p>
              </div>
              <Switch
                checked={autoTimezone}
                onChange={setAutoTimezone}
                className={`${autoTimezone ? "bg-blue-600" : "bg-gray-600"} relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="inline-block h-4 w-4 transform bg-white rounded-full transition" />
              </Switch>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              Timezone: <span className="text-white">(GMT+05:30) Calcutta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
