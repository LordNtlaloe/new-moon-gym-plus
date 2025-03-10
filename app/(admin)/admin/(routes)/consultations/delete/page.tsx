'use client'

import DeleteConsultation from '@/components/consultations/DeleteConsultation'
import Modal from '@/components/general/Modal'
import { useConsultationStore } from '@/lib/stores/consultationsStore'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const DeleteConsultationPage = () => {
    const { showConsultationDeleteModal, setShowConsultationDeleteModal, setConsultationID, setConsultationStatus } = useConsultationStore()
    const searchParams = useSearchParams()

    const id = searchParams?.get('id') as string | null
    const status = searchParams?.get('status') as string | null

    useEffect(() => {
        if (id && status) {
            setConsultationID(id)
            setConsultationStatus(status)
            setShowConsultationDeleteModal(true)
        }
    }, [id, status, setConsultationID, setConsultationStatus, setShowConsultationDeleteModal])

    return (
        <main>
            {id && (
                <Modal isVisible={showConsultationDeleteModal} onClose={() => setShowConsultationDeleteModal(false)}>
                    <DeleteConsultation />
                </Modal>
            )}
        </main>
    )
}

export default DeleteConsultationPage
