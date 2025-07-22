'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CalendarIcon } from "lucide-react"
import { createMember, updateMemberProgram } from "@/app/_actions/member.actions"
import { UserSelect } from "@/components/dashboard/memebers/user-select"

interface MemberProgramFormProps {
    memberId?: string;
    userId?: string;
    isEditMode?: boolean;
    isViewMode?: boolean;
    defaultValues?: {
        program?: string;
        dateOfJoining?: string;
        programDuration?: string;
    };
    onSuccess?: () => void;
}

export default function MemberProgramForm({
    memberId,
    userId,
    isEditMode = false,
    isViewMode = false,
    defaultValues,
    onSuccess
}: MemberProgramFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            userId: userId || "",
            program: defaultValues?.program || "",
            dateOfJoining: defaultValues?.dateOfJoining || "",
            programDuration: defaultValues?.programDuration || ""
        }
    })

    const [isDateDialogOpen, setIsDateDialogOpen] = useState(false)
    const dateOfJoining = watch("dateOfJoining")
    const selectedUserId = watch("userId")

    const onSubmit = async (data: any) => {
        const formData = new FormData()
        if (!isEditMode) formData.append("userId", data.userId)
        formData.append("program", data.program)
        formData.append("dateOfJoining", data.dateOfJoining)
        formData.append("programDuration", data.programDuration)

        try {
            if (isEditMode && memberId) {
                const result = await updateMemberProgram(memberId, formData)
                if (result.error) throw new Error(result.error)
            } else {
                const result = await createMember(data.userId, formData)
                if (result.error) throw new Error(result.error)
            }
            onSuccess?.()
        } catch (error: any) {
            alert(error.message)
        }
    }

    if (isViewMode && defaultValues) {
        return (
            <div className="space-y-4 text-sm">
                <div>
                    <label className="block mb-1 font-medium text-gray-500 dark:text-gray-400">Program</label>
                    <div className="p-2 border rounded bg-gray-50 dark:bg-[#1D1D1D] text-gray-800 dark:text-gray-100">
                        {defaultValues.program?.replace("-", " ") || "Not specified"}
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-500 dark:text-gray-400">Date of Joining</label>
                    <div className="p-2 border rounded bg-gray-50 dark:bg-[#1D1D1D] text-gray-800 dark:text-gray-100">
                        {defaultValues.dateOfJoining ? format(new Date(defaultValues.dateOfJoining), "PPP") : "Not specified"}
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-500 dark:text-gray-400">Program Duration</label>
                    <div className="p-2 border rounded bg-gray-50 dark:bg-[#1D1D1D] text-gray-800 dark:text-gray-100">
                        {defaultValues.programDuration || "Not specified"}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isEditMode && (
                <div>
                    <label className="block mb-2 text-sm font-medium dark:text-gray-300 bg-[#0D0D0D]">Select User</label>
                    <UserSelect
                        value={selectedUserId}
                        onChange={(value) => setValue("userId", value)}
                        disabled={isSubmitting}
                    />
                    {errors.userId && (
                        <span className="text-red-500 text-sm">Please select a user</span>
                    )}
                </div>
            )}

            <div>
                <label className="block mb-2 text-sm font-medium dark:text-gray-300">Program</label>
                <select
                    {...register("program", { required: "Program is required" })}
                    className="w-full p-2 border rounded bg-white dark:bg-[#0D0D0D] dark:text-white"
                    disabled={isSubmitting}
                >
                    <option value="">Select a program</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="fitness">General Fitness</option>
                </select>
                {errors.program && (
                    <span className="text-red-500 text-sm">{errors.program.message}</span>
                )}
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium dark:text-gray-300">Date of Joining</label>
                <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal dark:bg-[#0D0D0D] dark:text-white",
                                !dateOfJoining && "text-muted-foreground"
                            )}
                            disabled={isSubmitting}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateOfJoining ? format(new Date(dateOfJoining), "PPP") : <span>Pick a date</span>}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-auto p-0 dark:bg-[#1D1D1D]">
                        <Calendar
                            mode="single"
                            selected={dateOfJoining ? new Date(dateOfJoining) : undefined}
                            onSelect={(date) => {
                                if (date) {
                                    setValue("dateOfJoining", date.toISOString())
                                    setIsDateDialogOpen(false)
                                }
                            }}
                            initialFocus
                            disabled={isSubmitting}
                        />
                    </DialogContent>
                </Dialog>
                <input
                    type="hidden"
                    {...register("dateOfJoining", { required: "Date of joining is required" })}
                />
                {errors.dateOfJoining && (
                    <span className="text-red-500 text-sm">{errors.dateOfJoining.message}</span>
                )}
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium dark:text-gray-300">Program Duration</label>
                <select
                    {...register("programDuration", { required: "Duration is required" })}
                    className="w-full p-2 border rounded bg-white dark:bg-[#0D0D0D] dark:text-white"
                    disabled={isSubmitting}
                >
                    <option value="">Select duration</option>
                    <option value="1-month">1 Month</option>
                    <option value="3-months">3 Months</option>
                    <option value="6-months">6 Months</option>
                </select>
                {errors.programDuration && (
                    <span className="text-red-500 text-sm">{errors.programDuration.message}</span>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onSuccess?.()}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : isEditMode ? "Update Program" : "Create Member"}
                </Button>
            </div>
        </form>
    )
}
