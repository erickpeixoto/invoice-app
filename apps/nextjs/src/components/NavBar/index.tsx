"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useAtom } from "jotai";

import { notificationCountAtom } from "~/atoms";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const NavBar = () => {
  const pathname = usePathname();
  const [overdueCount] = useAtom(notificationCountAtom);
  return (
    <div className="mb-5 flex items-center justify-between p-4">
      <NavBarHeader activePath={pathname} overdueCount={overdueCount} />
      <UserButton />
    </div>
  );
};

interface NavBarHeaderProps {
  activePath: string;
  overdueCount: number | null;
}

const NavBarHeader = ({ activePath, overdueCount }: NavBarHeaderProps) => {
  let breadcrumbLabel = "Dashboard"; // default
  let breadcrumbRoute = "/"; // default

  switch (true) {
    case activePath === "/":
      breadcrumbLabel = "Invoice Dashboard";
      breadcrumbRoute = "/invoice";
      break;
    case activePath === "/invoice/list":
    case activePath.startsWith("/invoice/edit/"):
      breadcrumbLabel = "Invoices";
      breadcrumbRoute = "/invoice/";
      break;
    case activePath.startsWith("/invoice/"):
      breadcrumbLabel = "Invoice";
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
      {/* Displaying overdue invoices count next to the breadcrumb label */}
      <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{overdueCount}</TooltipTrigger>
            <TooltipContent>
              <p>
                {overdueCount} overdue invoice{overdueCount !== 1 && "s"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </div>
  );
};

export default NavBar;
