
'use client';
import UpdateConsultationForm from '@/components/consultations/UpdateConsultationForm';
import Modal from '@/components/general/Modal';
import { useConsultationStore } from '@/lib/stores/consultationsStore';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

type PageParams = {
  id: string
}

const UpdateConsultationPage = ({ params }: { params: PageParams }) => {
  const {
    setShowUpdateConsultationModal,
    showUpdateConsultationModal,
    setConsultationID,
    setConsultationStatus
  } = useConsultationStore();

  const searchParams = useSearchParams();
  const id = params.id
  const status = searchParams?.get('status');

  useEffect(() => {
    if (id && status) {
      setConsultationID(id);
      setConsultationStatus(status);
      setShowUpdateConsultationModal(true);
    }
  }, [id, status, setConsultationID, setConsultationStatus, setShowUpdateConsultationModal]);

  if (!id || !status) {
    return (
      <main className="h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold text-red-500">Invalid consultation parameters</h1>
      </main>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center">
      <h1 className="text-xl font-bold">Updating Status...</h1>
      <Modal
        isVisible={showUpdateConsultationModal}
        onClose={() => setShowUpdateConsultationModal(false)}
      >
        <UpdateConsultationForm />
      </Modal>
    </main>
  );
};

export default UpdateConsultationPage;