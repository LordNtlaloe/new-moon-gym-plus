'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/stores/waitingListStore"
import Link from "next/link"

const productActions = [
    {
        id: 1,
        label: "Update Info"
    },
    {
        id: 2,
        label: "Change Status"
    },

]

const ActionsField = ({ id }: { id: string }) => {
    const { setShowUpdateModal, setShowChangeStatusModal } = useStore()
    return (
        <div className="pl-2">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-center flex-col">
                    <p className="text-center font-semibold text-xl cursor-pointer px-5 hover:scale-150 transition-all">
                        ...
                    </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-[#1D1D1D]" align="end">

                    <DropdownMenuSeparator />
                    {productActions.map((action) => (
                        <Link href={`/dashboard/products/update/${id}`} key={action.id} className="border-b px-8 border-white/20 py-2 cursor-pointer hover:bg-slate-100 rounded mx-3 flex flex-col" onClick={() => {
                            if (action.label === "Update Info") {
                            } else if (action.label === "Change Status") {
                                setShowChangeStatusModal(true)
                            }
                        }}>
                            <p>{action.label}</p>
                        </Link>
                    ))}

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default ActionsField