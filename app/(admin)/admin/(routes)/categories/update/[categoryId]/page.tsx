'use client'
import UpdateCategoryForm from '@/components/category/UpdateCategoryForm'
import Modal from '@/components/general/Modal'
import { useCategoryStore } from '@/lib/stores/categoryStore'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const UpdateCategoryPage = () => {
    const { setShowUpdateCategoryModal, showUpdateCategoryModal, setCategoryID, setCategoryName } = useCategoryStore()
    const searchParams = useSearchParams()
    const id = searchParams?.get('id') as string | null
    const name = searchParams?.get('name') as string | null

    useEffect(() => {
        if (id && name) {
            setCategoryID(id)
            setCategoryName(name)
            setShowUpdateCategoryModal(true)
        }
    }, [id, name, setCategoryID, setCategoryName, setShowUpdateCategoryModal])

    return (
        <main className='h-20 flex items-center justify-center'>
            <h1 className='text-xl font-bold '>UPDATING CATEGORY...</h1>
            {id &&
                <div>
                    <Modal isVisible={showUpdateCategoryModal} onClose={() => setShowUpdateCategoryModal(false)}>
                        <UpdateCategoryForm />
                    </Modal>
                </div>
            }
        </main>
    )
}

export default UpdateCategoryPage
