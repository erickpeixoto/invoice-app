import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "~/components/ui/button";

const NavBar = () => {
  return (
    <div className="mb-5 flex items-center justify-between p-4">
      <div className="flex items-center">
        <Link className="text-2xl font-medium text-gray-700" href="/">
          Invoices
        </Link>
        <span className="mx-2 text-sm">/</span>
        <span className="mr-2 text-blue-700">Dashboard</span>
      </div>

      <Button className="bg-blue-200 text-blue-700 hover:bg-blue-500 hover:text-white ">
        <PlusIcon />
        New Invoice
      </Button>
    </div>
  );
};

export default NavBar;
