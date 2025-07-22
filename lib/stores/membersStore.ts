import { create } from "zustand"
import { type Member } from "@/lib/types"

interface MemberState {
    showAddMemberModal: boolean
    showEditMemberModal: boolean
    showDeleteMemberModal: boolean
    currentMemberId: string
    currentMemberName: string
    currentMemberProgram: string
    currentMember: Member | null
    isDeleting: boolean

    // Modal controls
    setShowAddMemberModal: (show: boolean) => void
    setShowEditMemberModal: (show: boolean) => void
    setShowDeleteMemberModal: (show: boolean) => void

    // Member selection
    setCurrentMemberId: (id: string) => void
    setCurrentMemberName: (name: string) => void
    setCurrentMemberProgram: (program: string) => void
    setCurrentMember: (member: Member | null) => void

    // Delete state
    setIsDeleting: (isDeleting: boolean) => void

    // Utility functions
    openEditMemberModal: (member: Member) => void
    openDeleteMemberModal: (member: Member) => void
}

export const useMemberStore = create<MemberState>()((set) => ({
    showAddMemberModal: false,
    showEditMemberModal: false,
    showDeleteMemberModal: false,
    currentMemberId: "",
    currentMemberName: "",
    currentMemberProgram: "",
    currentMember: null,
    isDeleting: false,

    // Modal controls
    setShowAddMemberModal: (show) => set({ showAddMemberModal: show }),
    setShowEditMemberModal: (show) => set({ showEditMemberModal: show }),
    setShowDeleteMemberModal: (show) => set({ showDeleteMemberModal: show }),

    // Member selection
    setCurrentMemberId: (id) => set({ currentMemberId: id }),
    setCurrentMemberName: (name) => set({ currentMemberName: name }),
    setCurrentMemberProgram: (program) => set({ currentMemberProgram: program }),
    setCurrentMember: (member) => set({ currentMember: member }),

    // Delete state
    setIsDeleting: (isDeleting) => set({ isDeleting }),

    // Utility functions
    openEditMemberModal: (member) =>
        set({
            currentMemberId: member._id,
            currentMemberProgram: member.currentProgram,
            currentMember: member,
            showEditMemberModal: true,
        }),
    openDeleteMemberModal: (member) =>
        set({
            currentMemberId: member._id,
            currentMember: member,
            showDeleteMemberModal: true,
        }),
}))
