"use client";
import { useAuth, SignedIn } from "@clerk/nextjs";
import { getUserByClerkId } from '@/app/_actions/users.actions';
import { saveWeightMeasurement, getWeightMeasurements, deleteWeightMeasurement } from '@/app/_actions/weight.actions';
import MealCalendar from '@/components/general/Calendar';
import { Member, User, UserRole } from '@/lib/types';
import React, { useEffect, useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MeasurementForm } from '@/components/dashboard/weights/weight-form';
import { MeasurementHistory } from '@/components/dashboard/weights/weight-table';
import { MemberSidebar } from '@/components/dashboard/memebers/member-sidebar';

type UserData = {
    member: Member;
    user: User;
} | { error: string };

export default function UserProfile() {
    const { userId: clerkId, isLoaded } = useAuth();
    const [data, setData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [weightHistory, setWeightHistory] = useState<any[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!clerkId) {
                    throw new Error("No user authenticated");
                }

                // Fetch current user data using Clerk ID
                const result = await getUserByClerkId(clerkId);
                console.log('User data response:', result); // Debug log

                // Additional detailed logging
                console.log('Result type:', typeof result);
                console.log('Has error property:', 'error' in result);
                if (!('error' in result)) {
                    console.log('User exists:', !!result.user);
                    console.log('Member exists:', !!result.member);
                    console.log('User data:', result.user);
                    console.log('Member data:', result.member);
                }

                if ('error' in result) {
                    throw new Error(result.error);
                }

                // More detailed validation
                if (!result.user) {
                    console.error('User data is missing from result');
                    throw new Error("User information not found in database");
                }

                if (!result.member) {
                    console.error('Member data is missing from result');
                    throw new Error("Member information not found in database");
                }

                // Validate essential user fields
                if (!result.user._id || !result.user.clerkId) {
                    console.error('User data incomplete:', result.user);
                    throw new Error("User data is incomplete - missing essential fields");
                }

                // Validate essential member fields
                if (!result.member._id || !result.member.userId) {
                    console.error('Member data incomplete:', result.member);
                    throw new Error("Member data is incomplete - missing essential fields");
                }

                // Verify that user and member are linked correctly
                if (result.user.clerkId !== result.member.userId) {
                    console.error('User-Member ID mismatch:', {
                        userClerkId: result.user.clerkId,
                        memberUserId: result.member.userId
                    });
                    throw new Error("User and member data mismatch");
                }

                console.log('All validations passed, setting data');
                setData(result);

                // Fetch weight measurements for the current user
                const measurements = await getWeightMeasurements(result.member._id);
                setWeightHistory(measurements || []);

            } catch (err: any) {
                console.error('Error fetching user data:', err);
                setError(err.message);
                toast({
                    title: "Error loading profile",
                    description: err.message,
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        if (clerkId && isLoaded) {
            console.log('Starting data fetch for clerkId:', clerkId);
            fetchData();
        } else {
            console.log('Waiting for auth - clerkId:', clerkId, 'isLoaded:', isLoaded);
        }
    }, [clerkId, isLoaded, toast]);

    const handleSubmit = async (values: any) => {
        try {
            if (!data || 'error' in data || !data.member?._id) {
                throw new Error("User data not available");
            }

            const response = await saveWeightMeasurement(
                data.member._id,
                {
                    date: values.date,
                    weight: values.weight,
                    fastingBloodSugar: values.fastingBloodSugar,
                    bloodPressure: values.bloodPressure,
                    pulse: values.pulse,
                    notes: values.notes
                },
                `/profile`
            );

            if (response.error) {
                throw new Error(response.error);
            }

            const measurements = await getWeightMeasurements(data.member._id);
            setWeightHistory(measurements);

            toast({
                title: "Success",
                description: "Measurement saved successfully",
            });

            setIsDialogOpen(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            if (!data || 'error' in data || !data.member?._id) {
                throw new Error("User data not available");
            }

            const response = await deleteWeightMeasurement(id, `/profile`);

            if (response.error) {
                throw new Error(response.error);
            }

            setWeightHistory(prev => prev.filter(item => item._id !== id));
            toast({
                title: "Success",
                description: "Measurement deleted successfully",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };


    if (!isLoaded) {
        return <div className="flex justify-center items-center h-screen">Loading authentication...</div>;
    }

    if (!clerkId) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Not Authenticated</h2>
                    <p>Please sign in to view your profile</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading profile data...</div>;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!data || 'error' in data) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Profile Data Error</h2>
                    <p className="mb-4">We encountered an error loading your profile information.</p>
                    <p className="text-sm text-gray-500">
                        {data?.error || 'Unknown error occurred'}
                    </p>
                </div>
            </div>
        );
    }

    const currentUserRole = data.user?.role as UserRole || "member";
    const canAddMeasurements = currentUserRole === "Admin" || currentUserRole === "Trainer";

    return (
        <SignedIn>
            <div className="bg-gray-100 dark:bg-[#0D0D0D] dark:text-white min-h-screen">
                <div className="mx-auto p-4 md:p-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <MemberSidebar
                            member={data.member}
                            user={data.user}
                            currentUserRole={currentUserRole}
                            onAddMeasurement={() => setIsDialogOpen(true)}
                        />

                        <div className="lg:col-span-3 space-y-6">
                            <Card className="shadow-lg dark:bg-[#1D1D1D]">
                                <CardHeader>
                                    <CardTitle>Measurement History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <MeasurementHistory
                                        measurements={weightHistory}
                                        onDelete={handleDelete}
                                        onAddFirst={() => setIsDialogOpen(true)}
                                        currentUserRole={currentUserRole}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="shadow-lg dark:bg-[#1D1D1D] rounded-md">
                                <CardHeader>
                                    <CardTitle>Fitness Program</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-medium">Current Program</h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {data.member?.currentProgram || 'No program assigned'}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Program Duration</h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {data.member?.programDuration || 'Not specified'}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Status</h3>
                                            <p className="text-gray-600 dark:text-gray-300 capitalize">
                                                {data.member?.status || 'Unknown'}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Date Joined</h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {data.member?.dateOfJoining
                                                    ? new Date(data.member.dateOfJoining).toLocaleDateString()
                                                    : 'Not available'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add New Measurement</DialogTitle>
                        </DialogHeader>
                        <MeasurementForm
                            onSubmit={handleSubmit}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>

                <div className="px-4 md:px-8 max-w-7xl mx-auto pb-8">
                    {data.user?._id && data.user?.clerkId && data.member?._id && (
                        <MealCalendar
                            userId={data.user._id}
                            clerkId={data.user.clerkId}
                            memberId={data.member._id}
                            currentUserRole={currentUserRole}
                        />
                    )}
                </div>
            </div>
        </SignedIn>
    );
}