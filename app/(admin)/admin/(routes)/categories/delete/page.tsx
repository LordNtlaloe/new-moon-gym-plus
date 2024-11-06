'use client'

import DeleteCategory from '@/components/category/DeleteCategory'
import Modal from '@/components/general/Modal'
import { useCategoryStore } from '@/lib/stores/categoryStore'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const DeleteCategoryPage = () => {
    const { showCategoryDeleteModal, setShowCategoryDeleteModal, setCategoryID, setCategoryName } = useCategoryStore()
    const searchParams = useSearchParams()

    const id = searchParams?.get('id') as string | null
    const name = searchParams?.get('name') as string | null

    useEffect(() => {
        if (id && name) {
            setCategoryID(id)
            setCategoryName(name)
            setShowCategoryDeleteModal(true)
        }
    }, [id, name, setCategoryID, setCategoryName, setShowCategoryDeleteModal])

    return (
        <main>
            {id && (
                <Modal isVisible={showCategoryDeleteModal} onClose={() => setShowCategoryDeleteModal(false)}>
                    <DeleteCategory />
                </Modal>
            )}
        </main>
    )
}

export default DeleteCategoryPage
