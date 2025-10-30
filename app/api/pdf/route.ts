import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { mealPlanDownloadTracker } from "@/lib/download-tracker";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    // Get user info from query parameters
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    if (!name || !email || !phone) {
      return NextResponse.json(
        { message: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Track download in database (non-blocking)
    mealPlanDownloadTracker
      .trackDownload(name, email, phone)
      .catch((error) => console.error("Failed to track download:", error));

    // Path to your PDF file
    const fileName = "21-days-fat-burning-marathon-Meal-plan.pdf"; // Update as needed
    const filePath = path.join(process.cwd(), "public", fileName);

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

    console.log(`Meal plan downloaded by: ${email}`);

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
