"use client";

import { useState } from "react";
import Link from "next/link";

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Hamburger button for mobile view */}
      <button
        className="absolute left-0 top-0 z-10 p-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: "rgba(255, 255, 255, 0.8)" }} // semi-transparent background
      >
        &#9776; {/* Simple Hamburger Icon */}
      </button>

      <div
        className={`shadow-r fixed left-0 top-0 h-screen w-64 bg-white transition-all duration-300 ease-in-out 
                   ${
                     isOpen
                       ? "translate-x-0 transform"
                       : "-translate-x-64 transform"
                   } md:transform-none`}
      >
        {/* Logo */}
        <div className="mb-10 p-6 font-bold text-violet-500">In.voice</div>

        {/* Menu */}
        <ul className="text-black">
          <Link href="/dashboard">
            <li className="transform border-l-4 border-transparent p-6 transition-all duration-300 ease-in-out hover:translate-x-2 hover:border-blue-500 hover:bg-gray-200">
              Dashboard
            </li>
          </Link>
          <Link href="/invoices">
            <li className="transform border-l-4 border-transparent p-6 transition-all duration-300 ease-in-out hover:translate-x-2 hover:border-blue-500 hover:bg-gray-200">
              Invoices
            </li>
          </Link>
          <Link href="/users">
            <li className="transform border-l-4 border-transparent p-6 transition-all duration-300 ease-in-out hover:translate-x-2 hover:border-blue-500 hover:bg-gray-200">
              Users
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
