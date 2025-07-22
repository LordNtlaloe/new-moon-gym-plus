'use client'

import { useEffect, useState } from "react"
import { getAllUsers } from "@/app/_actions/users.actions"
import { type User } from "@/lib/types"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface UserSelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function UserSelect({ value, onChange, disabled }: UserSelectProps) {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await getAllUsers()
                if (!result.error) {
                    setUsers(result)
                }
            } catch (error) {
                console.error("Failed to fetch users:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    return (
        <Select value={value} onValueChange={onChange} disabled={disabled || loading}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={loading ? "Loading users..." : "Select a user"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-[#0D0D0D] dark:text-white">
                {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}