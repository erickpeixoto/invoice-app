"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
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

interface ActionCellProps {
  client: ClientFormData;
  onDelete: (data: ClientFormData) => void;
}

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
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
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

const ActionCell: React.FC<ActionCellProps> = ({ client, onDelete }) => {
  const pathName = usePathname();
  const router = useRouter();

  // Determine if current route is for client or user
  const isClient = pathName.includes("/client/");

  const entityType = isClient ? "client" : "user";
  const entityId = client.id; // derive entityId from the client object

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
          onClick={() => navigator.clipboard.writeText(String(entityId))}
        >
          {`Copy ${entityType.toUpperCase()} ID`}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/${entityType}/edit/${entityId}`)}
        >
          {`View ${entityType}`}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(client)}>
          <Trash2 className="mr-2 h-5 w-5" />
          {`Delete ${entityType}`}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
