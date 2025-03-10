'use client'

import React, { useState } from "react"

const Modal = ({ isVisible, onClose, children }: { isVisible: boolean; onClose: any; children: React.ReactNode }) => {

    if (!isVisible) return null

    return (
        <main className='inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center fixed z-30 '>
            <div className=' rounded flex flex-col mx-4 mr-6 ' >
                <div className='bg-white  p-4 flex flex-col overflow-y-auto'>
                    {children}
                </div>
            </div>
        </main>
    )
}

export default Modal