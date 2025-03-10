"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export type Consultations = {
  _id: string;
  full_names: string;
  email: string;
  phone_number: string;
  date: string;  // Changed from Date to string
  time: string;  // Changed from Time to string
  options: "Change Status" | "delete";
};

export const columns: ColumnDef<Consultations>[] = [
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
    accessorKey: "date", 
    header: "Date",
  },
  {
    accessorKey: "time", 
    header: "Time",
  },
  {
    accessorKey: "_id",
    header: "OPTIONS",
    cell: ({ row }) => {
      const consultation = row.original;

      return (
        <div className="flex gap-2 items-center">
          <Link href={`/admin/consultations/update/1/?id=${consultation._id}&status=Change%20Status`}>
            <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-800">
              <FaEdit size={16} />
            </button>
          </Link>
          <Link href={`/admin/consultations/delete/?id=${consultation._id}&full_names=${encodeURIComponent(consultation.full_names)}`}>
            <button type="button" className="bg-red-600 text-white p-2 rounded hover:bg-red-800">
              <MdDelete size={16} />
            </button>
          </Link>
        </div>
      );
    },
  },
];
