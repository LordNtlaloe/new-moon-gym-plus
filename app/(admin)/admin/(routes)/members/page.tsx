'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/sonner"

import { useMemberStore } from "@/lib/stores/membersStore"
import { getMembersWithUserNames, deleteMember } from "@/app/_actions/member.actions"
import { type Member } from "@/lib/types"

import MembersTableSkeleton from "@/components/dashboard/skeleton/Skeleton"
import { DataTable } from "@/components/dashboard/memebers/members-table"
import { columns } from "@/components/dashboard/memebers/member-columns"
import MemberProgramForm from "@/components/dashboard/memebers/member-program-form"

export default function MembersPage() {
    const router = useRouter()
    const {
        showAddMemberModal,
        showEditMemberModal,
        showDeleteMemberModal,
        setShowAddMemberModal,
        setShowEditMemberModal,
        setShowDeleteMemberModal,
        isDeleting,
        setIsDeleting,
        currentMemberId,
        currentMemberName,
        currentMember
    } = useMemberStore()

    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMembers = async () => {
        try {
            const result = await getMembersWithUserNames()
            if (Array.isArray(result)) {
                // Normalize dateOfJoining to Date objects
                const normalized = result.map(member => ({
                    ...member,
                    dateOfJoining: member.dateOfJoining ? new Date(member.dateOfJoining) : null,
                }))
                setMembers(normalized)
            } else {
                setMembers([])
            }
        } catch (error) {
            console.error("Failed to fetch members:", error)
            setMembers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    console.log(members)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteMember(currentMemberId)
            if (result.error) throw new Error(result.error)

            toast.success("Member deleted successfully")
            await fetchMembers()
        } catch (error: any) {
            toast.error("Failed to delete member", {
                description: error.message,
            })
        } finally {
            setIsDeleting(false)
            setShowDeleteMemberModal(false)
        }
    }

    return (
        <div className="p-4">
            <Toaster />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Members Management</h1>
                <Button onClick={() => setShowAddMemberModal(true)} className="bg-red-500 text-white rounded-md</p">
                    Add New Member
                </Button>
            </div>

            {loading ? (
                <MembersTableSkeleton />
            ) : (
                <DataTable data={members} columns={columns} />
            )}

            {/* Add Member Modal */}
            <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Member Program</DialogTitle>
                        <DialogDescription>
                            Set up the fitness program for this member
                        </DialogDescription>
                    </DialogHeader>
                    <MemberProgramForm
                        isEditMode={false}
                        onSuccess={() => {
                            setShowAddMemberModal(false)
                            setLoading(true)
                            fetchMembers()
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Member Modal */}
            <Dialog open={showEditMemberModal} onOpenChange={setShowEditMemberModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Member Program</DialogTitle>
                        <DialogDescription>
                            Update the fitness program for this member
                        </DialogDescription>
                    </DialogHeader>
                    {currentMember && (
                        <MemberProgramForm
                            memberId={currentMember._id}
                            userId={currentMember.userId}
                            isEditMode={true}
                            defaultValues={{
                                program: currentMember.currentProgram,
                                dateOfJoining: currentMember.dateOfJoining,
                                programDuration: currentMember.programDuration,
                            }}
                            onSuccess={() => {
                                setShowEditMemberModal(false)
                                setLoading(true)
                                fetchMembers()
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteMemberModal} onOpenChange={setShowDeleteMemberModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {currentMemberName}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteMemberModal(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
