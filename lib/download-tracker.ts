import { connectToDB } from "@/app/_database/database";

export interface MealPlanDownloadRecord {
  ip: string;
  timestamp: Date;
  userAgent: string | null;
  isUnique: boolean;
}

export interface MealPlanDownloadStats {
  totalDownloads: number;
  uniqueDownloads: number;
  recentDownloads: MealPlanDownloadRecord[];
}

class MealPlanDownloadTracker {
  async trackDownload(ip: string, userAgent: string | null): Promise<void> {
    const client = await connectToDB();
    if (!client) {
      console.error("Failed to connect to database for tracking");
      return;
    }

    try {
      // ✅ Always point to your real DB
      const db = client.db("newmoon_db");
      const collection = db.collection<MealPlanDownloadRecord>(
        "meal_plan_downloads"
      );

      // ✅ Check if this IP has downloaded before
      const existingDownload = await collection.findOne({ ip });

      // ❗ If not unique, DO NOT SAVE
      if (existingDownload) {
        console.log(`Meal plan already downloaded by IP: ${ip} (not unique)`);
        return;
      }

      // ✅ Save only the first unique download
      await collection.insertOne({
        ip,
        timestamp: new Date(),
        userAgent,
        isUnique: true,
      });

      console.log(`✅ Unique meal plan download recorded - IP: ${ip}`);
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

      const [totalDownloads, uniqueIPs, recentDownloads] = await Promise.all([
        collection.countDocuments(), // Count unique downloads
        collection.distinct("ip"), // Distinct IP count
        collection.find().sort({ timestamp: -1 }).limit(10).toArray(), // Recent unique
      ]);

      return {
        totalDownloads,
        uniqueDownloads: uniqueIPs.length,
        recentDownloads: recentDownloads as MealPlanDownloadRecord[],
      };
    } finally {
      await client.close();
    }
  }
}

export const mealPlanDownloadTracker = new MealPlanDownloadTracker();
