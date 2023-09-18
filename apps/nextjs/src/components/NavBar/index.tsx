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

  switch (true) {
    case activePath === "/":
      breadcrumbLabel = "Home";
      breadcrumbRoute = "/";
      break;
    case activePath === "/invoice/list":
    case activePath.startsWith("/invoice/edit/"):
      breadcrumbLabel = "Invoices";
      breadcrumbRoute = "/invoice/list";
      break;
    case activePath === "/user/list":
    case activePath.startsWith("/user/edit/"):
      breadcrumbLabel = "Users";
      breadcrumbRoute = "/user/list";
      break;
    case activePath === "/client/list":
    case activePath.startsWith("/client/edit/"):
      breadcrumbLabel = "Clients";
      breadcrumbRoute = "/client/list";
      break;
    case activePath === "/profile":
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
