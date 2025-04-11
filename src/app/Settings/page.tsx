"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const SettingsSidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  // Blur background & disable scroll
  useEffect(() => {
    const homePageElement = document.querySelector("#home-page");

    if (isOpen && homePageElement) {
      homePageElement.classList.add("blur-sm", "opacity-40", "pointer-events-none");
      document.body.style.overflow = "hidden";
    } else if (homePageElement) {
      homePageElement.classList.remove("blur-sm", "opacity-40", "pointer-events-none");
      document.body.style.overflow = "auto";
    }

    return () => {
      if (homePageElement) {
        homePageElement.classList.remove("blur-sm", "opacity-40", "pointer-events-none");
      }
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 h-screen w-[20vw] bg-[#1a1a1a] text-white shadow-xl z-[10000] p-6 flex flex-col animate-slideIn"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-bold">Settings</div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Button Group */}
        <div className="flex flex-col w-full text-sm">
          {[
            { label: "Preferences", path: "/Preferences" },
            { label: "Security", path: "/user/settings/security" },
            { label: "Billing", path: "/user/settings/billing" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                router.push(item.path);
                onClose();
              }}
              className="w-full text-center py-3 text-white border-b border-amber-50 hover:bg-[#2C2C2C] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
