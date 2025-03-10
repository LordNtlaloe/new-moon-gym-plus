import { create } from "zustand";

interface waitingListState {
    showChangeStatusModal: boolean;
    showUpdateModal: boolean
    showBookingModal: boolean

    setShowChangeStatusModal: (newStatus: boolean) => void;
    setShowUpdateModal: (newState: boolean) => void;
    setShowBookingModal: (newState: boolean) => void;
}

export const useStore = create<waitingListState>()((set) => ({
    showChangeStatusModal: false,
    showUpdateModal: false,
    showBookingModal: false,

    setShowChangeStatusModal: (newStatus: boolean) => set({ showChangeStatusModal: newStatus }),
    setShowUpdateModal: (newState: boolean) => set({ showUpdateModal: newState }),
    setShowBookingModal: (newState: boolean) => set({ showBookingModal: newState })
}));
