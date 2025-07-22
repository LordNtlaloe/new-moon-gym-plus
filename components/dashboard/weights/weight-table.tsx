"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { UserRole } from "@/lib/types";

interface Measurement {
    id: string;
    date: string;
    weight: string;
    bloodPressure: string;
    pulse: string;
    fastingBloodSugar: string;
    notes?: string;
}

interface MeasurementHistoryProps {
    measurements: Measurement[];
    onDelete: (id: string) => void;
    onAddFirst: () => void;
    currentUserRole: UserRole; 
}

export function MeasurementHistory({ measurements,
    onDelete,
    onAddFirst,
    currentUserRole }: MeasurementHistoryProps) {
    return (
        <>
            {measurements.length > 0 ? (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Weight</TableHead>
                                <TableHead>Blood Pressure</TableHead>
                                <TableHead>Pulse</TableHead>
                                <TableHead>Blood Sugar</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {measurements.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.date}</TableCell>
                                    <TableCell>{record.weight} kg</TableCell>
                                    <TableCell>{record.bloodPressure}</TableCell>
                                    <TableCell>{record.pulse} bpm</TableCell>
                                    <TableCell>{record.fastingBloodSugar || '-'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(record.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">No measurements recorded yet</p>
                    <Button
                        onClick={onAddFirst}
                        className="mt-4"
                    >
                        Add First Measurement
                    </Button>
                </div>
            )}
        </>
    );
}