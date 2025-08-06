// components/meal-calendar.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getMealsByDateRange, createMealEntry } from "@/app/_actions/meals.actions";
import { MealType } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { UserRole } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MealDaySummary {
  date: string;
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
}

const MealCalendar: React.FC<{
  userId: string;
  clerkId: string;
  memberId?: string;
  currentUserRole: UserRole;
}> = ({ userId, clerkId, memberId, currentUserRole }) => {
  const { userId: currentClerkId } = useAuth();
  const isOwnProfile = currentClerkId === clerkId;
  const isMember = currentUserRole === "member";

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [mealImage, setMealImage] = useState("");
  const [mealNotes, setMealNotes] = useState("");
  const [mealDays, setMealDays] = useState<MealDaySummary[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chartData, setChartData] = useState<{ date: string; consistency: number }[]>([]);

  const calendarRef = useRef<FullCalendar>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUserId = isOwnProfile ? userId : memberId || userId;

  useEffect(() => {
    const fetchMeals = async () => {
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;

      const start = calendarApi.view.activeStart;
      const end = calendarApi.view.activeEnd;

      const meals = await getMealsByDateRange(displayUserId, start, end);

      const daysMap = new Map<string, MealDaySummary>();
      meals.forEach((meal) => {
        if (!meal?.mealType || !meal?.date) return;

        const day = daysMap.get(meal.date) || { date: meal.date };
        (day as any)[meal.mealType.toLowerCase()] = true;
        daysMap.set(meal.date, day);
      });

      const daysArray = Array.from(daysMap.values());
      setMealDays(daysArray);
      calculateConsistencyData(daysArray);
    };

    fetchMeals();
  }, [displayUserId]);

  const calculateConsistencyData = (days: MealDaySummary[]) => {
    // Sort days by date
    const sortedDays = [...days].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Group by week
    const weeklyData: { date: string; consistency: number }[] = [];

    let currentWeekStart: Date | null = null;
    let currentWeekDays: MealDaySummary[] = [];

    sortedDays.forEach(day => {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);

      if (!currentWeekStart) {
        currentWeekStart = new Date(dayDate);
        currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()); // Start of week (Sunday)
      }

      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6); // End of week (Saturday)

      if (dayDate >= currentWeekStart && dayDate <= weekEnd) {
        currentWeekDays.push(day);
      } else {
        // Calculate consistency for the completed week
        const consistency = calculateWeekConsistency(currentWeekDays);
        weeklyData.push({
          date: currentWeekStart.toISOString().split('T')[0],
          consistency
        });

        // Reset for new week
        currentWeekStart = new Date(dayDate);
        currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());
        currentWeekDays = [day];
      }
    });

    // Add the last week if it exists
    if (currentWeekDays.length > 0 && currentWeekStart) {
      const consistency = calculateWeekConsistency(currentWeekDays);
      weeklyData.push({
        date: currentWeekStart,
        consistency
      });
    }

    setChartData(weeklyData);
  };

  const calculateWeekConsistency = (weekDays: MealDaySummary[]): number => {
    // Count days with at least one meal
    const consistentDays = weekDays.filter(day =>
      day.breakfast || day.lunch || day.dinner
    ).length;

    // Return ratio (0-1) of consistent days to total days in week
    return consistentDays / 7;
  };

  const handleDateClick = (dateStr: string) => {
    if (!isMember || !isOwnProfile) return;

    const localDate = new Date(dateStr).toLocaleDateString("en-CA");
    setSelectedDate(localDate);
    setSelectedMealType(null);
    setMealImage("");
    setMealNotes("");
    setIsDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setMealImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitMeal = async () => {
    if (!selectedMealType || !selectedDate || !mealImage) return;

    try {
      await createMealEntry({
        userId: displayUserId,
        date: selectedDate,
        mealType: selectedMealType,
        imageUrl: mealImage,
        notes: mealNotes,
      });

      const updatedDays = [...mealDays];
      const dayIndex = updatedDays.findIndex((d) => d.date === selectedDate);

      if (dayIndex === -1) {
        updatedDays.push({
          date: selectedDate,
          ...(selectedMealType === MealType.BREAKFAST
            ? { breakfast: true }
            : selectedMealType === MealType.LUNCH
              ? { lunch: true }
              : { dinner: true }),
        });
      } else {
        updatedDays[dayIndex] = {
          ...updatedDays[dayIndex],
          ...(selectedMealType === MealType.BREAKFAST
            ? { breakfast: true }
            : selectedMealType === MealType.LUNCH
              ? { lunch: true }
              : { dinner: true }),
        };
      }

      setMealDays(updatedDays);
      calculateConsistencyData(updatedDays);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to submit meal entry", error);
    }
  };

  const getDayColor = (dateStr: string) => {
    const day = mealDays.find((d) => d.date === dateStr);
    const mealCount = day ? [day.breakfast, day.lunch, day.dinner].filter(Boolean).length : 0;

    switch (mealCount) {
      case 1:
        return "#f97316";
      case 2:
        return "#eab308";
      case 3:
        return "#22c55e";
      default:
        return "#ef4444";
    }
  };

  const dayCellContent = (cellInfo: { date: Date }) => {
    const dateStr = cellInfo.date.toLocaleDateString("en-CA");
    const day = mealDays.find((d) => d.date === dateStr);
    const mealCount = day ? [day.breakfast, day.lunch, day.dinner].filter(Boolean).length : 0;
    const color = getDayColor(dateStr);

    return {
      html: `
        <div style="text-align: center;">
          <div>${cellInfo.date.getDate()}</div>
          <div style="
            margin-top: 2px;
            background-color: ${color};
            border-radius: 9999px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            color: white;
            font-size: 12px;
            margin: 0 auto;
          ">
            ${mealCount}
          </div>
        </div>
      `,
    };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#1D1D1D]">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold">
          {isOwnProfile ? "My Meal Tracker" : "Member Meal Compliance"}
        </h2>
        {!isOwnProfile && (
          <p className="text-sm text-gray-500 mt-1">
            Viewing meals for this member
          </p>
        )}
      </div>

      <div className="custom-calendar p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth",
          }}
          selectable={isMember && isOwnProfile}
          dateClick={(arg) => {
            if (!isMember || !isOwnProfile || arg.dateStr !== todayStr) return;
            handleDateClick(arg.dateStr);
          }}
          dayCellContent={dayCellContent}
          dayCellClassNames={(arg) =>
            isMember && isOwnProfile && isToday(arg.date)
              ? "cursor-pointer"
              : "pointer-events-none"
          }
          height="auto"
        />

        <div className="p-4 border-t dark:border-gray-700 flex flex-wrap gap-4 justify-center">
          <LegendDot color="bg-green-500" label="All meals logged" />
          <LegendDot color="bg-yellow-500" label="2 meals logged" />
          <LegendDot color="bg-orange-500" label="1 meal logged" />
          <LegendDot color="bg-red-500" label="No meals logged" />
        </div>

        {isMember && isOwnProfile && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-[#0D0D0D] dark:text-white">
              <DialogHeader>
                <DialogTitle>Log Meal for {selectedDate}</DialogTitle>
                <DialogDescription>
                  Upload your meal photo and add any notes
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Meal Type</Label>
                  <div className="flex gap-2 mt-2">
                    {Object.values(MealType).map((type) => (
                      <Button
                        key={type}
                        onClick={() => setSelectedMealType(type)}
                        className={`px-3 py-1 ${selectedMealType === type
                          ? "bg-primary text-white"
                          : "bg-white dark:bg-[#1D1D1D] text-black dark:text-white border dark:border-gray-700"
                          }`}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Meal Photo</Label>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-dashed flex flex-col items-center justify-center gap-2 bg-white dark:bg-[#1D1D1D] dark:text-white border dark:border-gray-700"
                  >
                    {mealImage ? (
                      <img src={mealImage} alt="Meal" className="max-h-full max-w-full" />
                    ) : (
                      <>
                        <span>Click to upload photo</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Supports JPG, PNG
                        </span>
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={mealNotes}
                    onChange={(e) => setMealNotes(e.target.value)}
                    placeholder="Optional notes about this meal..."
                    rows={3}
                    className="bg-white dark:bg-[#1D1D1D] text-black dark:text-white border dark:border-gray-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-white dark:bg-[#1D1D1D] text-black dark:text-white border dark:border-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitMeal}
                  disabled={!selectedMealType || !mealImage}
                  className="bg-primary text-white"
                >
                  Submit Meal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded-full ${color}`} />
    <span>{label}</span>
  </div>
);

export default MealCalendar;