'use client';
import UpdateConsultationForm from '@/components/consultations/UpdateConsultationForm';
import Modal from '@/components/general/Modal';
import { useConsultationStore } from '@/lib/stores/consultationsStore';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const UpdateConsultationPage = () => {
  const { setShowUpdateConsultationModal, showUpdateConsultationModal, setConsultationID, setConsultationStatus } = useConsultationStore();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') as string | null;
  const status = searchParams?.get('status') as string | null;

  useEffect(() => {
    if (id && status) {
      setConsultationID(id);
      setConsultationStatus(status);
      setShowUpdateConsultationModal(true); // Make sure the modal is shown
    }
  }, [id, status, setConsultationID, setConsultationStatus, setShowUpdateConsultationModal]);

  return (
    <main className="h-20 flex items-center justify-center">
      <h1 className="text-xl font-bold">Updating Status...</h1>
      {id && (
        <div>
          <Modal isVisible={showUpdateConsultationModal} onClose={() => setShowUpdateConsultationModal(false)}>
            <UpdateConsultationForm />
          </Modal>
        </div>
      )}
    </main>
  );
};

export default UpdateConsultationPage;
