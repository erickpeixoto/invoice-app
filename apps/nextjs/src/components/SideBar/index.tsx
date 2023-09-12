"use client";

import { useState } from "react";
import Link from "next/link";
import { BiSolidDashboard } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { TbFileInvoice } from "react-icons/tb";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="absolute left-0 top-0 z-10 p-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: "rgba(255, 255, 255, 0.8)" }}
      >
        &#9776;
      </button>

      <div
        className={`bottom-[10px] left-0 h-full w-64 rounded-l-lg bg-white transition-all duration-300 ease-in-out
                   ${
                     isOpen
                       ? "translate-x-0 transform"
                       : "-translate-x-64 transform"
                   } md:transform-none`}
      >
        {/* Logo */}
        <div className="mb-10 p-6 font-bold text-violet-500">In.voice</div>

        {/* Menu */}
        <ul className="text-gray-500">
          <Link href="/dashboard">
            <li className="relative left-[-7px] translate-x-2 transform border-l-4 border-transparent p-4 transition-all duration-300 ease-in-out hover:border-blue-300 hover:bg-gray-100">
              <BiSolidDashboard className="mr-2 inline-block" />
              Dashboard
            </li>
          </Link>
          <Link href="/invoices">
            <li className="relative left-[-7px] translate-x-2 transform border-l-4 border-transparent p-4 transition-all duration-300 ease-in-out hover:border-blue-300 hover:bg-gray-100">
              <TbFileInvoice className="mr-2 inline-block" />
              Invoices
            </li>
          </Link>
          <Link href="/users">
            <li className="relative left-[-7px] translate-x-2 transform border-l-4 border-transparent p-4 transition-all duration-300 ease-in-out hover:border-blue-300 hover:bg-gray-100">
              <FiUsers className="mr-2 inline-block" />
              Users
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
