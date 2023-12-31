"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building as ClientIcon,
  FileDigit as InvoiceIcon,
  Settings as SettingsIcon,
  Users as UsersIcon,
} from "lucide-react";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    // Explicitly check for /user/edit
    if (path === "/user/list" && pathname.startsWith("/user/edit")) {
      return true;
    }
    if (path === "/client/list" && pathname.startsWith("/client/edit")) {
      return true;
    }
    if (path === "/invoice/list" && pathname.startsWith("/invoice/edit")) {
      return true;
    }
    return pathname.startsWith(path);
  };
  const menuItemClass = (path: string) => {
    if (isActive(path)) {
      return "border-blue-300 bg-gray-100";
    }
    return "hover:border-blue-300 hover:bg-gray-100";
  };

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
        className={`absolute bottom-[10px] left-0 z-10 h-full w-64 rounded-l-lg bg-white transition-all duration-300 ease-in-out md:static 
                   ${
                     isOpen
                       ? "translate-x-0 transform"
                       : "-translate-x-64 transform"
                   } md:transform-none`}
      >
        <button
          className="left-2 top-0 z-10 p-4 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: "rgba(255, 255, 255, 0.8)" }}
        >
          &#9776;
        </button>
        {/* Logo */}
        <div className="mb-10 p-6 font-bold text-violet-500">In.voice</div>

        {/* Menu */}
        <ul className="text-gray-500 ">
          <Link href="/invoice">
            <li
              className={`relative left-[-7px] translate-x-2 transform border-l-4 border-transparent p-4 transition-all duration-300 ease-in-out ${menuItemClass(
                "/invoice",
              )}`}
            >
              <InvoiceIcon className="mr-2 inline-block" />
              Invoices
            </li>
          </Link>
          <Link href="/user/list">
            <li
              className={`relative left-[-7px] translate-x-2 transform border-l-4 border-transparent p-4 transition-all duration-300 ease-in-out ${menuItemClass(
                "/user/list",
              )}`}
            >
              <UsersIcon className="mr-2 inline-block" />
              Users
            </li>
          </Link>
          <Link href="/client/list">
            <li
              className={`relative left-[-7px] translate-x-2 transform border-l-4 border-transparent p-4 transition-all duration-300 ease-in-out ${menuItemClass(
                "/client/list",
              )}`}
            >
              <ClientIcon className="mr-2 inline-block" />
              Clients
            </li>
          </Link>
          <Link href="/profile">
            <li
              className={`relative left-[-7px] translate-x-2 transform border-l-4 border-transparent p-4 transition-all duration-300 ease-in-out ${menuItemClass(
                "/profile",
              )}`}
            >
              <SettingsIcon className="mr-2 inline-block" />
              Profile
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
