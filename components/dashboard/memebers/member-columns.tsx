import { ColumnDef } from "@tanstack/react-table"
import { Member } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useMemberStore } from "@/lib/stores/membersStore"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu"
import Link from "next/link"

export const columns: ColumnDef<Member>[] = [
    {
        accessorKey: "fullName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const fullName = row.getValue("fullName") as string
            return <span>{fullName}</span>
        }
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "currentProgram",  // <-- Changed to currentProgram to match DB key
        header: "Program",
        cell: ({ row }) => {
            const program = row.getValue("currentProgram") as string
            return <span className="capitalize">{program?.replace("-", " ")}</span>
        },
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: "dateOfJoining",
        header: "Join Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("dateOfJoining"))
            return date.toLocaleDateString()
        },
    },
    {
        accessorKey: "programDuration",
        header: "Duration",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <span
                    className={`px-2 py-1 rounded-full text-xs ${status === "active"
                        ? "bg-green-100 text-green-800"
                        : status === "inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {status}
                </span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const member = row.original
            const { openEditMemberModal, openDeleteMemberModal } = useMemberStore()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/members/${member._id}`}>
                                View Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditMemberModal(member)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => openDeleteMemberModal(member)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }

]
