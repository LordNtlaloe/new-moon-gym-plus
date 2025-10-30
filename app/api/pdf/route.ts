import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { mealPlanDownloadTracker } from "@/lib/download-tracker";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get client IP address
    const ip = getClientIP(request);

    // Track download in database (non-blocking - don't await so file serves faster)
    mealPlanDownloadTracker
      .trackDownload(ip, request.headers.get("user-agent"))
      .catch((error) => console.error("Failed to track download:", error));

    // Path to your PDF file - update with actual filename
    const fileName = "21-days-fat-burning-marathon-Meal-plan.pdf"; // Change this to your actual file name
    const filePath = path.join(process.cwd(), "public", fileName); // Organized in pdfs folder

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return NextResponse.json(
        { message: "Meal plan file not found" },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);

    // Create response with file
    const response = new NextResponse(fileBuffer);

    // Set headers for file download
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );
    response.headers.set("Content-Length", fileBuffer.length.toString());

    // Add CORS headers if needed
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    console.log(`Meal plan downloaded by IP: ${ip}`);

    return response;
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

// Helper function to get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip"); // Cloudflare

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}
