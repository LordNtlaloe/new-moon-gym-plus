"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    date: z.date({
        required_error: "Measurement date is required",
    }),
    weight: z.string().min(1, {
        message: "Weight is required",
    }),
    fastingBloodSugar: z.string().min(1, {
        message: "Fasting blood sugar is required",
    }),
    bloodPressure: z.string().min(1, {
        message: "Blood pressure is required",
    }),
    pulse: z.string().min(1, {
        message: "Pulse is required",
    }),
    notes: z.string().optional(),
});

interface MeasurementFormProps {
    onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
    onCancel: () => void;
}

export function MeasurementForm({ onSubmit, onCancel }: MeasurementFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            weight: "",
            fastingBloodSugar: "",
            bloodPressure: "",
            pulse: "",
            notes: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <Label>Measurement Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Weight (kg)</Label>
                                <FormControl>
                                    <Input placeholder="e.g. 75" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="pulse"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Pulse (bpm)</Label>
                                <FormControl>
                                    <Input placeholder="e.g. 72" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="fastingBloodSugar"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Blood Sugar (mmol/L)</Label>
                                <FormControl>
                                    <Input placeholder="e.g. 5.1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bloodPressure"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Blood Pressure</Label>
                                <FormControl>
                                    <Input placeholder="e.g. 120/80" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Notes</Label>
                            <FormControl>
                                <Input placeholder="Additional notes" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button type="submit">Save Measurement</Button>
                </div>
            </form>
        </Form>
    );
}