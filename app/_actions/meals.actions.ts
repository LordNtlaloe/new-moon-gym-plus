// actions/meals.actions.ts
'use server'

import { connectToDB } from "../_database/database";
import { MealEntry, MealDaySummary } from "@/lib/types";

let dbConnection: any;
let database: any;

const init = async () => {
  const connection = await connectToDB();
  dbConnection = connection;
  database = await dbConnection?.db("newmoon_db");
};

export const getMealsByDateRange = async (userId: string, startDate: Date, endDate: Date): Promise<MealDaySummary[]> => {
  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("meals");
    if (!collection) return [];

    const meals = await collection.find({
      userId,
      date: {
        $gte: startDate.toISOString().split('T')[0],
        $lte: endDate.toISOString().split('T')[0]
      }
    }).toArray();

    // Group by date
    const daysMap = new Map<string, MealDaySummary>();

    meals.forEach((meal: MealEntry) => {
      const day = daysMap.get(meal.date) || { date: meal.date };

      if (meal.mealType === 'Breakfast') day.breakfast = meal;
      else if (meal.mealType === 'Lunch') day.lunch = meal;
      else if (meal.mealType === 'Dinner') day.dinner = meal;

      daysMap.set(meal.date, day);
    });

    return Array.from(daysMap.values());
  } catch (error) {
    console.error("Failed to fetch meals", error);
    return [];
  }
};

export const createMealEntry = async (mealData: Omit<MealEntry, 'id' | 'createdAt'>) => {
  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("meals");
    if (!collection) return null;

    const newMeal = {
      ...mealData,
      createdAt: new Date()
    };

    const result = await collection.insertOne(newMeal);
    return { ...newMeal, id: result.insertedId.toString() };
  } catch (error) {
    console.error("Failed to create meal entry", error);
    return null;
  }
};

export const getMealStatsForTrainer = async (trainerId: string, memberIds: string[], startDate: Date, endDate: Date) => {
  if (!dbConnection) await init();

  try {
    const collection = await database?.collection("meals");
    if (!collection) return [];

    const pipeline = [
      {
        $match: {
          userId: { $in: memberIds },
          date: {
            $gte: startDate.toISOString().split('T')[0],
            $lte: endDate.toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: {
            userId: "$userId",
            date: "$date"
          },
          mealCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          userId: "$_id.userId",
          date: "$_id.date",
          mealCount: 1
        }
      }
    ];

    return await collection.aggregate(pipeline).toArray();
  } catch (error) {
    console.error("Failed to fetch meal stats", error);
    return [];
  }
};