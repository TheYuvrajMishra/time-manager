'use client';

import { useRouter } from 'next/navigation';
import { CiSearch, CiSettings, CiTrash } from 'react-icons/ci';
import { MdOutlineHome } from 'react-icons/md';
import { FaInbox, FaRegEdit } from 'react-icons/fa';
import { GiArtificialHive } from 'react-icons/gi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { RiArrowDropDownLine } from 'react-icons/ri';

export default function Home() {
  const router = useRouter();

  const handleCardClick = () => {
    router.push('/Search');
  };

  return (
    <div className="bg-[#202020] h-screen w-[20vw] text-[#9B9B9B] flex flex-col fixed">
      {/* Wrapper with space between top and bottom sections */}
      <div className="flex flex-col justify-between h-full overflow-y-auto">
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
              <FaRegEdit className="ml-3 text-xl" />
            </div>
          </div>

          {/* Navigation */}
          <ul className="flex flex-col items-start space-y-1 mx-2 text-sm">
            <li
              onClick={handleCardClick}
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
              onClick={() => router.push('/Home')}
              className="flex items-center w-full gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer"
            >
              <MdOutlineHome className="text-xl" />
              <span>Home</span>
            </li>
            <li className="flex items-center w-full gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer">
              <FaInbox className="text-xl" />
              <span>Inbox</span>
            </li>
          </ul>

          {/* Private Documents */}
          <ul className="flex flex-col items-start space-y-1 mx-2 text-sm mt-6">
            <li className="flex items-center text-xs w-full space-x-2 py-2 px-4 rounded-lg text-[#7D7D7D] cursor-default">
              <span className="tracking-wide">Private</span>
            </li>
            {['Draft Report', 'Notes', 'Shared Inbox'].map((item, index) => (
              <li
                key={index}
                className="flex items-center w-full gap-3 py-1 px-4 rounded-lg hover:bg-[#2C2C2C] hover:text-[#D5D5D5] cursor-pointer"
              >
                <IoDocumentTextOutline className="text-xl" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
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
    </div>
  );
}
