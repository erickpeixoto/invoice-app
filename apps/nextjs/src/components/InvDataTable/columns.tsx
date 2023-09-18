/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { LayoutPanelTop, Trash2 } from "lucide-react";

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
import type { InvoiceFormData } from ".";

interface ActionCellProps {
  invoice: InvoiceFormData;
  onDelete: (data: InvoiceFormData) => void;
}

export const getColumns = (
  handleDeleteClick: (data: InvoiceFormData) => void,
): ColumnDef<InvoiceFormData>[] => [
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
    accessorKey: "invoiceNumber",
    header: "Invoice #ID",
    cell: ({ row }) => <div>{row.getValue("invoiceNumber")}</div>,
  },
  {
    accessorKey: "userName",
    header: "From",
    cell: ({ row }) => <div>{row.getValue("userName")}</div>,
  },
  {
    accessorKey: "clientName",
    header: "To",
    cell: ({ row }) => <div>{row.getValue("clientName")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as React.ReactNode;
      let bgColor = "bg-white text-black";

      switch (status) {
        case "Overdue":
          bgColor = "bg-red-500";
          break;
        case "Paid":
          bgColor = "bg-green-500";
          break;
        case "Pending":
          bgColor = "bg-yellow-500";
          break;
      }

      return (
        <div
          className={`${bgColor} flex justify-center rounded-md p-2 text-white`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => <div>{row.getValue("dueDate")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => (
      <ActionCell invoice={row.original} onDelete={handleDeleteClick} />
    ),
  },
];

const ActionCell: React.FC<ActionCellProps> = ({ invoice, onDelete }) => {
  const router = useRouter();
  const entityType = "invoice";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <LayoutPanelTop className="h-5 w-5 cursor-pointer text-gray-400 hover:text-violet-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(String(invoice.id))}
        >
          {`Copy ${entityType.toUpperCase()} ID`}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/${entityType}/edit/${invoice.id}`)}
        >
          {`View ${entityType}`}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(invoice)}>
          <Trash2 className="mr-2 h-5 w-5" />
          {`Delete ${entityType}`}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
