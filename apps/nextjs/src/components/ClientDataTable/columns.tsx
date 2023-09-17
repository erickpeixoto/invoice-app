"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { LayoutPanelTop, Trash2 } from "lucide-react";

import { Avatar, AvatarImage } from "~/components/ui/avatar";
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
import type { ClientFormData } from ".";

export const getColumns = (
  handleDeleteClick: (data: ClientFormData) => void,
): ColumnDef<ClientFormData>[] => [
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
    id: "profile",
    header: "Profile",
    cell: ({ row }) => (
      <Avatar>
        {row.original.profile ? (
          <AvatarImage src={row.original.profile} alt={row.original.name} />
        ) : (
          <AvatarImage
            src="https://via.placeholder.com/150"
            alt={row.original.name}
          />
        )}
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "fone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("fone")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => (
      <ActionCell client={row.original} onDelete={handleDeleteClick} />
    ),
  },
];

function ActionCell({
  client,
  onDelete,
}: {
  client: ClientFormData;
  onDelete: (data: ClientFormData) => void;
}) {
  const router = useRouter();

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
          onClick={() => navigator.clipboard.writeText(String(client.id))}
        >
          Copy Client ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/client/edit/${client.id}`)}
        >
          View client
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(client)}>
          <Trash2 className="mr-2 h-5 w-5" />
          Delete client
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}