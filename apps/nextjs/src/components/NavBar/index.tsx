"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const NavBar = () => {
  const pathname = usePathname();
  return (
    <div className="mb-5 flex items-center justify-between p-4">
      <NavBarHeader activePath={pathname} />
      <UserButton />
    </div>
  );
};

interface NavBarHeaderProps {
  activePath: string;
}

const NavBarHeader: React.FC<NavBarHeaderProps> = ({ activePath }) => {
  let breadcrumbLabel = "Dashboard"; // default
  let breadcrumbRoute = "/"; // default

  switch (activePath) {
    case "/":
      breadcrumbLabel = "Home";
      breadcrumbRoute = "/";
      break;
    case "/invoice/list":
      breadcrumbLabel = "Invoices";
      breadcrumbRoute = "/invoice/list";
      break;
    case "/user/list":
      breadcrumbLabel = "Users";
      breadcrumbRoute = "/user/list";
      break;
    case "/client/list":
    case `/client/edit/[id]`:
      breadcrumbLabel = "Clients";
      breadcrumbRoute = "/client/list";
      break;
    case "/profile":
      breadcrumbLabel = "Profile";
      breadcrumbRoute = "/profile";
      break;
    default:
      break;
  }

  return (
    <div className="flex items-center">
      <Link href="/" className="text-2xl font-medium text-gray-700">
        In.voice
      </Link>
      <span className="mx-2 text-sm">/</span>
      <Link className="mr-2 text-blue-700" href={breadcrumbRoute}>
        {breadcrumbLabel}
      </Link>
    </div>
  );
};

export default NavBar;
