"use client";

import { useRouter } from "next/navigation";
import { CiSearch, CiSettings, CiTrash } from "react-icons/ci";
import { MdOutlineHome } from "react-icons/md";
import { FaInbox } from "react-icons/fa";
import { GiArtificialHive } from "react-icons/gi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { PiDotsThree } from "react-icons/pi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

export default function Home() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();

  const handleSearch = () => {
    router.push("/Search");
  };

  type PageItem = {
    title: string;
    date: string;
  };

  const [recentlyVisited, setRecentlyVisited] = useState<PageItem[]>([]);

  // Load pages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recentPages");
    const parsed: PageItem[] = stored ? JSON.parse(stored) : [];

    // Always ensure Welcome Page is there if nothing else
    if (parsed.length === 0) {
      const defaultPage = {
        title: "Welcome Page",
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        }),
      };
      localStorage.setItem("recentPages", JSON.stringify([defaultPage]));
      localStorage.setItem(
        "page-Welcome Page",
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

  const handleNew = () => {
    router.push("/new");
  };

  return (
    <div className="bg-[#202020] h-screen w-[20vw] text-[#9B9B9B] border border-r-white/5 flex flex-col fixed scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent hover:scrollbar-thumb-slate-600">
      {/* Wrapper with space between top and bottom sections */}
      <div className="flex flex-col justify-between h-full ">
        {/* Top section */}
        <div>
          {/* User Info */}
          <div className="flex items-center rounded-lg w-full">
            <div className="mt-2 ml-2 w-[93%] rounded-lg flex py-1 px-4 text-[#D5D5D5] hover:bg-[#2C2C2C] mb-2">
              <div className="bg-[#353535] w-6 h-6 flex items-center justify-center mr-2 rounded-lg text-sm font-semibold">
                Y
              </div>
              <div
                className="text-sm truncate max-w-[140px]"
                title="yuvrajmishra@gmail.com"
              >
                yuvrajmishra@gmail.com
              </div>
              <RiArrowDropDownLine className="text-2xl cursor-pointer" />
            </div>
          </div>

          {/* Navigation */}
          <ul className="flex flex-col items-start space-y-1 mx-2 text-sm">
            <li
              onClick={handleSearch}
              className="flex items-center w-full gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer"
            >
              <CiSearch className="text-xl" />
              <span>Search</span>
            </li>
            <li className="flex items-center w-full gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
              <GiArtificialHive className="text-xl" />
              <span>AI</span>
            </li>
            <li
              onClick={() => router.push("/Home")}
              className="flex items-center w-full gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer"
            >
              <MdOutlineHome className="text-xl" />
              <span>Home</span>
            </li>
            <li
              onClick={handleNew}
              className="flex items-center w-full gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer"
            >
              <FaInbox className="text-xl" />
              <span>New Page</span>
            </li>
          </ul>

          {/* Private Documents */}
          <>
            <p className="flex items-center text-xs w-full space-x-2 py-2 mt-6 px-4 rounded-lg hover:text-[#8E8E8E] text-[#7D7D7D] cursor-default">
              <span className="tracking-wide">Private</span>
            </p>

            <div
              className="custom-scrollbar max-h-[calc(100vh-350px)] overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#414141 transparent",
              }}
            >
              <ul className="flex flex-col items-start space-y-1 mx-2 text-sm">
                {recentlyVisited.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleCardClick(item.title)}
                    className="group flex items-center w-full gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer"
                  >
                    <IoDocumentTextOutline />
                    <div className="flex items-center justify-between py-0.5 w-full">
                      <span className="truncate max-w-[65%]">{item.title}</span>
                      <span className="text-[12px] text-[#7D7D7D] whitespace-nowrap">
                        {item.date}
                      </span>
                    </div>
                    <div onClick={handleClick}>
                      <PiDotsThree className="text-2xl translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-[#d5d5d5] hover:text-[#D5D5D5] transition-all duration-200" />
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          </>
        </div>

        {/* Bottom Settings */}
        <ul className="flex flex-col items-start space-y-1 mx-2 mt-6 text-sm mb-4">
          <li className="flex items-center w-full gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
            <CiSettings className="text-xl" />
            <span>Settings</span>
          </li>
          <li className="flex items-center w-full gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
            <CiTrash className="text-xl" />
            <span>Trash</span>
          </li>
        </ul>
      </div>
      <Menu
        id="composition-menu"
        aria-labelledby="composition-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#2C2C2C",
            color: "#D5D5D5",
            borderRadius: 2,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          },
        }}
      >
        <MenuItem
          onClick={handleClose}
          sx={{ "&:hover": { backgroundColor: "#383838" } }}
        >
          Open
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          sx={{ "&:hover": { backgroundColor: "#383838" } }}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          sx={{ "&:hover": { backgroundColor: "#383838" } }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
