'use client'

import { getWaitingListById, updateWaitingListStatus } from '@/app/_actions/waitinglist.actions'
import Modal from '@/components/general/Modal'
import { useStore } from '@/lib/stores/waitingListStore'
import { ChevronDown, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { showConfirmationMessage, showToastMessage } from '@/lib/general_functions'

const menuItems = [
    { id: 1, label: "Approved" },
    { id: 2, label: "Pending" },
    { id: 3, label: "Declined" },
]

const ChangeStatus = ({ id }: { id: string }) => {
    const { showChangeStatusModal, setShowChangeStatusModal } = useStore()
    const [waiting, setWaiting] = useState<any>()
    const [selectedState, setSelectedState] = useState("Not Selected")

    useEffect(() => {
        const getWaiting = async () => {
            const result = await getWaitingListById(id)
            setWaiting(result)
        }

        getWaiting()
    }, [id])

    const updateStatus = async () => {
        if (selectedState === "Not Selected") {
            showConfirmationMessage("error", "Please select new status!")
            return
        }
        if (waiting?.status === selectedState) {
            showConfirmationMessage("error", "You have not changed the state of the product!")
            return
        }
        try {
            await updateWaitingListStatus(id, selectedState)
            showToastMessage('success', "Waiting List status successfully updated.")
            setShowChangeStatusModal(false)
        } catch (error: any) {
            showToastMessage("error", "An error occurred updating product state: " + error.message)
        }
    }

    return (
        <div>
            {showChangeStatusModal &&
                <Modal isVisible={true} onClose={() => setShowChangeStatusModal(false)} >
                    <div className='flex items-center justify-end'>
                        <button onClick={() => setShowChangeStatusModal(false)} className='hover:text-red-500 hover:scale-125 transition-all'><X /></button>
                    </div>
                    <div className='p-6 bg-blue-900 text-white my-4 md:w-[500px] w-[350px] rounded'>
                        <h1 className='text-lg font-bold'>Change Waiting List Status</h1>
                    </div>
                    <div>
                        <h1 className='my-3'>Full Names: <span className='font-bold text-sm'>{waiting?.full_names}</span></h1>
                        <h1>Current Status: <span className='font-bold text-sm'>{waiting?.status}</span></h1>
                        <div className='flex items-center gap-1'>
                            <h1>Change to:</h1>
                            <DropdownMenu>
                                <DropdownMenuTrigger><ChevronDown /></DropdownMenuTrigger>
                                <DropdownMenuContent className='bg-blue-900 text-white'>
                                    <DropdownMenuSeparator />
                                    {menuItems.map((item) => (
                                        <DropdownMenuItem 
                                            key={item.id}
                                            className='cursor-pointer py-1 border-b border-white/10 hover:bg-gray-600/30 rounded-[5px]' 
                                            onClick={() => setSelectedState(item.label)}
                                        >
                                            {item.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <h1 className='ml-4 bg-green-700 text-white font-semibold px-4 my-6'>{selectedState}</h1>
                        </div>
                        <div className='border-t mt-3 pt-3 border-black flex items-center'>
                            <button onClick={updateStatus} className='bg-red-500 py-1 px-3 rounded text-white mr-3'>
                                Change
                            </button>
                            <button className='bg-blue-500 py-1 px-3 rounded text-white' onClick={() => setShowChangeStatusModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            }
        </div>
    )
}

export default ChangeStatus
