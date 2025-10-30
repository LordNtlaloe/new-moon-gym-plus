import { connectToDB } from "@/app/_database/database";

export interface MealPlanDownloadRecord {
  name: string;
  email: string;
  phone: string;
  timestamp: Date;
  isUnique: boolean;
}

export interface MealPlanDownloadStats {
  totalDownloads: number;
  uniqueDownloads: number;
  recentDownloads: MealPlanDownloadRecord[];
}

class MealPlanDownloadTracker {
  async trackDownload(
    name: string,
    email: string,
    phone: string
  ): Promise<void> {
    const client = await connectToDB();
    if (!client) {
      console.error("Failed to connect to database for tracking");
      return;
    }

    try {
      const db = client.db("newmoon_db");
      const collection = db.collection<MealPlanDownloadRecord>(
        "meal_plan_downloads"
      );

      // Check if this email has downloaded before
      const existingDownload = await collection.findOne({ email });

      // If not unique, DO NOT SAVE
      if (existingDownload) {
        console.log(
          `Meal plan already downloaded by email: ${email} (not unique)`
        );
        return;
      }

      // Save only the first unique download
      await collection.insertOne({
        name,
        email,
        phone,
        timestamp: new Date(),
        isUnique: true,
      });

      console.log(`✅ Unique meal plan download recorded - Email: ${email}`);
    } catch (error: any) {
      console.error("Error tracking meal plan download:", error.message);
    } finally {
      await client.close();
    }
  }

  async getStats(): Promise<MealPlanDownloadStats> {
    const client = await connectToDB();
    if (!client) {
      throw new Error("Database connection failed");
    }

    try {
      const db = client.db("newmoon_db");
      const collection = db.collection<MealPlanDownloadRecord>(
        "meal_plan_downloads"
      );

      const [totalDownloads, uniqueEmails, recentDownloads] = await Promise.all(
        [
          collection.countDocuments(), // Total downloads
          collection.distinct("email"), // Unique emails
          collection.find().sort({ timestamp: -1 }).limit(10).toArray(), // Recent
        ]
      );

      return {
        totalDownloads,
        uniqueDownloads: uniqueEmails.length,
        recentDownloads: recentDownloads as MealPlanDownloadRecord[],
      };
    } finally {
      await client.close();
    }
  }
}

export const mealPlanDownloadTracker = new MealPlanDownloadTracker();
