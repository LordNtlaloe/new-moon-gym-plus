'use client'

import { ColumnDef } from "@tanstack/react-table";


export type User = {
    _id: string
    email: string
    firstName: string
    lastName: string

};

export const usersTableColumns: ColumnDef<User>[] = [
    {
        accessorKey: "firstName",
        header: "First Name"
    },

    {
        accessorKey: "lastName",
        header: "Last Name"
    },
    {
        accessorKey: "email",
        header: "Email"
    },
]