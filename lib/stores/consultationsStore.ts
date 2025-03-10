import { create } from "zustand";

interface ConsultationState {
    showAddNewConsultationModal: boolean;
    showUpdateConsultationModal: boolean;
    showConsultationDeleteModal: boolean;
    consultationId: string;
    consultationStatus: string;

    setShowNewConsultationModal: (newStatus: boolean) => void;
    setShowUpdateConsultationModal: (newStatus: boolean) => void;
    setShowConsultationDeleteModal: (newStatus: boolean) => void;
    setConsultationID: (id: string) => void;
    setConsultationStatus: (status: string) => void;
}

export const useConsultationStore = create<ConsultationState>()((set) => ({
    showAddNewConsultationModal: false,
    showUpdateConsultationModal: false,
    showConsultationDeleteModal: false,
    consultationId: "",
    consultationStatus: "",

    setShowNewConsultationModal: (newStatus) => set({ showAddNewConsultationModal: newStatus }),
    setShowUpdateConsultationModal: (newStatus) => set({ showUpdateConsultationModal: newStatus }),
    setShowConsultationDeleteModal: (newStatus) => set({ showConsultationDeleteModal: newStatus }),
    setConsultationID: (id) => set({ consultationId: id }),
    setConsultationStatus: (status) => set({ consultationStatus: status }),
}));
