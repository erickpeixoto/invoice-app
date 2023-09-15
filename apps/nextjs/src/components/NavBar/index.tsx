"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "lucide-react";

import { Button } from "~/components/ui/button";

const INVOICE_ADD_PATH = "/invoice/add";

const NavBar = () => {
  const pathname = usePathname();

  const shouldRenderNewInvoiceButton = () => {
    return pathname !== INVOICE_ADD_PATH;
  };

  return (
    <div className="mb-5 flex items-center justify-between p-4">
      <NavBarHeader />
      {shouldRenderNewInvoiceButton() && <NewInvoiceButton />}
    </div>
  );
};

const NavBarHeader = () => (
  <div className="flex items-center">
    <Link className="text-2xl font-medium text-gray-700" href="/">
      Invoices
    </Link>
    <span className="mx-2 text-sm">/</span>
    <span className="mr-2 text-blue-700">Dashboard</span>
  </div>
);

const NewInvoiceButton = () => (
  <Link className="text-2xl font-medium text-gray-700" href={INVOICE_ADD_PATH}>
    <Button className="bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white ">
      <PlusIcon />
      New Invoice
    </Button>
  </Link>
);

export default NavBar;
