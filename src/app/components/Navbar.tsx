"use client";
import { CiSearch, CiSettings, CiTrash } from "react-icons/ci";
import { MdOutlineHome } from "react-icons/md";
import { FaInbox, FaRegEdit } from "react-icons/fa";
import { GiArtificialHive } from "react-icons/gi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiTemplate } from "react-icons/hi";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function Home() {
  return (
    <div className="bg-[#202020] h-[100vh] w-[20vw] text-[#9B9B9B] flex flex-col fixed">
      {/* User Info */}
      <div className="flex items-center rounded-lg w-full">
        <div className="mt-2 ml-2 w-[93%] rounded-lg flex py-1 px-4 text-[#D5D5D5] hover:bg-[#2C2C2C] mb-2">
          <a
            href="#"
            className="bg-[#353535] w-6 h-6 flex items-center justify-center mr-2 rounded-lg text-[#D5D5D5] text-sm font-semibold"
          >
            Y
          </a>
          <a
            className="text-sm truncate max-w-[140px] block"
            href="#"
            title="yuvrajmishra@gmail.com"
          >
            yuvrajmishra@gmail.com
          </a>
          <RiArrowDropDownLine className="text-2xl cursor-pointer" />
          <FaRegEdit className="ml-3 text-xl" />
        </div>
      </div>

      {/* General Navigation */}
      <ul className="flex flex-col items-start space-y-1 mx-2 text-[14px]">
        <li
          className="flex items-center w-[99%] gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer"
        >
          <CiSearch className="text-xl" />
          <a href="/Search">Search</a>
        </li>
        <li className="flex items-center w-[99%] gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
          <GiArtificialHive className="text-xl" />
          <span>AI</span>
        </li>
        <li className="flex items-center w-[99%] gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
          <MdOutlineHome className="text-xl" />
          <span>Home</span>
        </li>
        <li className="flex items-center w-[99%] gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
          <FaInbox className="text-xl" />
          <span>Inbox</span>
        </li>
      </ul>

      {/* Private Documents */}
      <ul className="flex flex-col items-start space-y-1 mx-2 text-[14px]">
        <li className="flex items-center text-[13px] w-[99%] space-x-2 py-2 mt-5 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
          <span className="tracking-wide text-[#7D7D7D]">Private</span>
        </li>
        <li className="flex items-center w-[99%] gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
          <IoDocumentTextOutline className="text-xl" />
          <span>Draft Report</span>
        </li>
        <li className="flex items-center w-[99%] gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
          <IoDocumentTextOutline className="text-xl" />
          <span>Notes</span>
        </li>
        <li className="flex items-center w-[99%] gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
          <IoDocumentTextOutline className="text-xl" />
          <span>Shared Inbox</span>
        </li>
      </ul>

      {/* Settings */}
      <ul className="flex flex-col items-start space-y-1 mx-2 mt-5 text-[14px]">
        <li className="flex items-center w-[99%] gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
          <CiSettings className="text-xl" />
          <span>Settings</span>
        </li>
        <li className="flex items-center w-[99%] gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
          <HiTemplate className="text-xl" />
          <span>Template</span>
        </li>
        <li className="flex items-center w-[99%] gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
          <CiTrash className="text-xl" />
          <span>Trash</span>
        </li>
      </ul>

      {/* Optional Footer */}
      <div className="mt-auto px-4 py-2 text-xs text-[#6D6D6D]">v3.5.5</div>
    </div>
  );
}
