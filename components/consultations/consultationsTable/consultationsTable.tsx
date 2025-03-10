"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion"; // Ensure you have framer-motion installed
import { useEffect, useState } from "react";
import { Search } from 'lucide-react'; // Adjust the import to your icon 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ConsultationsTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (!isLoaded) return null;

  // Filter data based on the search term
  const filteredData = data.filter((item: any) =>
    item.full_names.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create an array of the rows that match the filtered data
  const filteredRows = table.getRowModel().rows.filter((row) =>
    filteredData.some((item: any) => item.name === row.getValue('name')) // Adjust this condition if your data structure is different
  );

  return (
    <motion.div
      className="bg-white bg-opacity-50 text-violet-700 backdrop-blur-md shadow-sm shadow-violet-800 rounded-xl p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            className="bg-violet-50 text-violet-700 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-200">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-bold text-[#1E1E1E] uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {filteredRows.length ? (
              filteredRows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`${index % 2 === 1 ? "bg-gray-200" : "bg-white"
                    }`}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-[#1E1E1E]"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-100"
                >
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </motion.div>
  );
}
