/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownNarrowWide, CircleDotDashedIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { InvoiceProps } from ".";

export const columns: ColumnDef<InvoiceProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => {
      const currency = row.getValue("currency") || "USD";

      // List of valid currency codes for validation
      const validCurrencyCodes = [
        "USD",
        "EUR",
        "JPY",
        "GBP",
        "AUD",
        "CAD",
        "CHF",
        "CNY",
        "SEK",
        "NZD",
      ];

      if (!validCurrencyCodes.includes(currency as string)) {
        console.error(`Invalid currency code: ${currency}`);
        return <div className="text-right font-medium">Error</div>;
      }

      return <div className="text-right font-medium">HERE</div>;
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      let bgColor;

      switch (status.toLowerCase()) {
        case "pending":
          bgColor = "bg-yellow-200";
          break;
        case "paid":
          bgColor = "bg-green-200";
          break;
        case "overdue":
          bgColor = "bg-red-200";
          break;
        default:
          bgColor = "bg-gray-200";
          break;
      }

      return (
        <div
          className={`capitalize ${bgColor} flex w-2/3 justify-center rounded p-1 font-semibold text-gray-500`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowDownNarrowWide className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("dueDate")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <CircleDotDashedIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(invoice.invoiceNumber)
              }
            >
              Copy Invoice ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View client</DropdownMenuItem>
            <DropdownMenuItem>View invoice details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
