"use client"
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Member, User, UserRole } from "@/lib/types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface MemberSidebarProps {
    member: Member;
    user: User | null;
    currentUserRole: UserRole;
    onAddMeasurement: () => void;
}

export function MemberSidebar({ member, user, currentUserRole, onAddMeasurement }: MemberSidebarProps) {
    const canAddMeasurements = currentUserRole === "Admin" || currentUserRole === "Trainer";

    return (
        <div className="lg:col-span-1 space-y-6">
            <Card className="dark:bg-[#1D1D1D] rounded-md">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                        <Image
                            src={user?.photo || "https://randomuser.me/api/portraits/men/94.jpg"}
                            width={128}
                            height={128}
                            alt="Profile picture"
                            className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 object-cover"
                        />

                        <h1 className="text-xl font-bold text-center">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                            {member?.currentProgram}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3 justify-center">
                            {canAddMeasurements && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700"
                                            onClick={onAddMeasurement}
                                        >
                                            Add Measurement
                                        </Button>
                                    </DialogTrigger>
                                </Dialog>
                            )}
                            <Button variant="outline">View Progress</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg dark:bg-[#1D1D1D]">
                <CardHeader>
                    <CardTitle className="text-lg">Member Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Membership Status</p>
                            <p className="font-medium">{member?.status}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Join Date</p>
                            <p className="font-medium">{member?.dateOfJoining}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Program Duration</p>
                            <p className="font-medium">{member?.programDuration}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}