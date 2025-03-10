"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import ActionsField from "./ActionsField";

export type WaitingList = {
  _id: string;
  full_names: string;
  email: string;
  phone_number: string;
  status: string;
};

export const columns: ColumnDef<WaitingList>[] = [
  {
    accessorKey: "full_names",
    header: "Full Names",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusClass =
        status === "Pending"
          ? "bg-yellow-500 text-black"
          : status === "Approved"
          ? "bg-green-700 text-white"
          : status === "Declined"
          ? "bg-red-700 text-white"
          : "bg-gray-200 text-gray-700";

      return (
        <div className={`py-1 px-3 rounded-md text-center ${statusClass}`}>
          <p>{status}</p>
        </div>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original;
      return <ActionsField id={item._id} />;
    },
  },
];
