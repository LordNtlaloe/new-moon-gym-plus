"use client"
import { getMemberById } from '@/app/_actions/member.actions';
import { saveWeightMeasurement, getWeightMeasurements, deleteWeightMeasurement } from '@/app/_actions/weight.actions';
import { getMealsByDateRange } from '@/app/_actions/meals.actions';
import MealCalendar from '@/components/general/Calendar';
import { Member, User, UserRole } from '@/lib/types';
import React, { useEffect, useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MeasurementForm } from '@/components/dashboard/weights/weight-form';
import { MeasurementHistory } from '@/components/dashboard/weights/weight-table';
import { MemberSidebar } from '@/components/dashboard/memebers/member-sidebar';
import { ConsistencyChart } from '@/components/dashboard/memebers/consistency-chart';

type PageParams = {
    id: string
}

type MemberData = {
    member: Member;
    user: User | null;
} | { error: string };

export default function MemberProfile({ params }: { params: PageParams }) {
    const member_id = params.id;
    const [data, setData] = useState<MemberData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [weightHistory, setWeightHistory] = useState<any[]>([]);
    const [mealData, setMealData] = useState<{ date: string; consistency: number }[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState<UserRole>("member");
    const { toast } = useToast();

    const calculateConsistencyData = (meals: any[]): { date: string; consistency: number }[] => {
        // Group meals by week
        const weeklyData: { [key: string]: { count: number, days: Set<string> } } = {};

        meals.forEach(meal => {
            const mealDate = new Date(meal.date);
            const weekStart = new Date(mealDate);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = { count: 0, days: new Set() };
            }
            weeklyData[weekKey].count++;
            weeklyData[weekKey].days.add(mealDate.toISOString().split('T')[0]);
        });

        // Convert to array and calculate consistency (0-1)
        return Object.entries(weeklyData)
            .map(([date, { days }]) => ({
                date,
                consistency: Math.min(days.size / 7, 1) // Cap at 1 (100%)
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch member data
                const result = await getMemberById(member_id);
                setData(result);

                // Fetch weight measurements
                const measurements = await getWeightMeasurements(member_id);
                setWeightHistory(measurements);

                // Fetch meal data for consistency chart
                if (result && !('error' in result)) {
                    const endDate = new Date();
                    const startDate = new Date();
                    startDate.setMonth(endDate.getMonth() - 3); // Get last 3 months of data
                    const meals = await getMealsByDateRange(result.user?._id || '', startDate, endDate);
                    const consistencyData = calculateConsistencyData(meals);
                    setMealData(consistencyData);
                }

                // Set current user role (you'll need to implement this)
                // For example: const role = await getCurrentUserRole();
                // setCurrentUserRole(role);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [member_id]);

    const handleSubmit = async (values: any) => {
        try {
            const response = await saveWeightMeasurement(
                member_id,
                {
                    date: values.date,
                    weight: values.weight,
                    fastingBloodSugar: values.fastingBloodSugar,
                    bloodPressure: values.bloodPressure,
                    pulse: values.pulse,
                    notes: values.notes
                },
                `/members/${member_id}`
            );

            if (response.error) {
                throw new Error(response.error);
            }

            const measurements = await getWeightMeasurements(member_id);
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
            const response = await deleteWeightMeasurement(id, `/members/${member_id}`);

            if (response.error) {
                throw new Error(response.error);
            }

            setWeightHistory(prev => prev.filter(item => item.id !== id));
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

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
    if (!data || 'error' in data) return <div className="flex justify-center items-center h-screen">Error: {data?.error || 'Unknown error'}</div>;

    const canAddMeasurements = currentUserRole === "Admin" || currentUserRole === "Trainer";

    return (
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
                                <CardTitle>Meal Consistency</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ConsistencyChart data={mealData} />
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
                                            {data?.member?.currentProgram || 'No program assigned'}
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
                {data.user?._id && data.user?.role && (
                    <MealCalendar
                        userId={data.user._id}
                        clerkId={data.user.clerkId}
                        memberId={data.member?._id}
                        currentUserRole={data.user.role as UserRole}
                    />
                )}
            </div>
        </div>
    );
}
