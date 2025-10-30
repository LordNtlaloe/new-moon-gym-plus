import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createNewUserFromClerk, deleteUserFromMongoDB, updateUserRoleInMongoDB } from "@/app/_actions/users.actions";

// Define types matching your database schema
type UserRole = 'user' | 'admin' | 'moderator' | 'member';

interface UserData {
  clerkId: string;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  photo: string;
  role: UserRole;
}

// Function to determine user role
function determineUserRole(userData: any): UserRole {
  // Check if user has specific email domains for admin
  const email = userData.email_addresses?.[0]?.email_address;
  if (email) {
    return "member"
  }
  
  // Check if user has role in public metadata
  if (userData.public_metadata?.role) {
    const role = userData.public_metadata.role.toLowerCase();
    if (['admin', 'moderator', 'member', 'user'].includes(role)) {
      return role as UserRole;
    }
  }
  
  // Default role - using 'member' to match your existing schema
  return 'member';
}

// Function to extract user data from webhook event
function extractUserData(evtData: any): UserData {
  const email = evtData.email_addresses?.[0]?.email_address || '';
  const username = evtData.username || null;
  const firstName = evtData.first_name || null;
  const lastName = evtData.last_name || null;
  const photo = evtData.image_url || '';
  
  return {
    clerkId: evtData.id,
    email,
    username,
    firstName,
    lastName,
    photo,
    role: determineUserRole(evtData)
  };
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Error: Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET);

  // Get headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const userData = extractUserData(evt.data);
    
    console.log("Creating user:", userData);
    
    // Call your existing server action to create user in database
    try {
      const result = await createNewUserFromClerk(userData);
      
      if (result?.error) {
        console.error("Error creating user in database:", result.error);
        return new Response("Error: Failed to create user in database", {
          status: 500,
        });
      }
      
      console.log("User created successfully in database");
    } catch (error) {
      console.error("Error creating user in database:", error);
      return new Response("Error: Failed to create user in database", {
        status: 500,
      });
    }
    
    return NextResponse.json({ 
      message: "User created successfully", 
      user: userData 
    });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    console.log("Deleting user with Clerk ID:", id);

    // Call your existing server action to delete user from database
    try {
      const result = await deleteUserFromMongoDB(id as string);
      
      if (result?.error) {
        console.error("Error deleting user from database:", result.error);
        return new Response("Error: Failed to delete user from database", {
          status: 500,
        });
      }
      
      console.log("User deleted successfully from database");
    } catch (error) {
      console.error("Error deleting user from database:", error);
      return new Response("Error: Failed to delete user from database", {
        status: 500,
      });
    }
    
    return NextResponse.json({ message: "User deleted successfully" });
  }

  if (eventType === "user.updated") {
    const userData = extractUserData(evt.data);
    
    console.log("Updating user:", userData);

    // For user updates, we need to handle both profile updates and role changes
    try {
      // Update user role if it changed
      const result = await updateUserRoleInMongoDB(userData.clerkId, userData.role);
      
      if (result?.error) {
        console.error("Error updating user in database:", result.error);
        return new Response("Error: Failed to update user in database", {
          status: 500,
        });
      }
      
      console.log("User updated successfully in database");
    } catch (error) {
      console.error("Error updating user in database:", error);
      return new Response("Error: Failed to update user in database", {
        status: 500,
      });
    }
    
    return NextResponse.json({ 
      message: "User updated successfully", 
      user: userData 
    });
  }

  return new Response("Webhook processed successfully", { status: 200 });
}