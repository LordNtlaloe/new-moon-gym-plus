'use server'

import { connectToDB } from "../_database/database";
import bcrypt from 'bcrypt'
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { error } from "console";
import { User } from "@/lib/types";

let dbConnection: any;
let database: any

const init = async () => {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("newmoon_db");
};

export const saveNewUser = async (formData: FormData) => {

    const password = formData.get("userPassword") as string
    const hashedPassword = await bcrypt.hash(password, 10)
    let newUser

    const data = {
        email: formData.get("userEmail"),
        name: formData.get("name"),
        surname: formData.get("userSurname"),
        othernames: formData.get("userOtherNames"),
        phoneNumber: formData.get("userPhoneNumber"),
        password: hashedPassword
    }

    if (!dbConnection) await init();

    try {
        const collection = await database.collection("users");

        if (!collection || !database) {
            return { error: "Faled to connect to collection!!" };
        }


        newUser = await collection.insertOne(data);

        if (newUser) {
            newUser = { ...newUser, insertedId: newUser.insertedId.toString() }
        }

    } catch (error: any) {
        console.log("An error occured saving new user:", error.message);
        return { "error": error.message }
    }

    if (newUser) {
        redirect("/sign-in")
    }

    return newUser

}
export const createNewUserFromClerk = async (user: any) => {

    if (!dbConnection) await init();

    try {
        const collection = await database.collection("users");

        if (!collection || !database) {
            return { error: "Faled to connect to collection!!" };
        }


        const newUser = await collection.insertOne(user);

        return newUser

    } catch (error: any) {
        console.log("An error occured saving new user:", error.message);
        return { "error": error.message }
    }

}

export const getUserByEmail = async (email: string) => {
    if (!dbConnection) await init();

    try {

        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection...");
            return;
        }

        let user = await collection
            .findOne({ "email": email })

        if (user) {
            user = { ...user, _id: user._id.toString() }
        }

    } catch (error: any) {
        console.log("An error occured...", error.message);
        return { "error": error.message };
    }

};

export const getUserByClerkId = async (clerkId: string) => {
    if (!dbConnection) await init();

    try {
        const usersCollection = await database?.collection("users");
        const membersCollection = await database?.collection("members");

        if (!database || !usersCollection || !membersCollection) {
            console.log("Failed to connect to collections...");
            return { error: "Failed to connect to database" };
        }

        // First, find the user by clerkId
        let user = await usersCollection.findOne({ clerkId: clerkId });

        if (!user) {
            console.log("User not found for clerkId:", clerkId);
            return { error: "User not found" };
        }

        // Convert user _id to string
        user = { ...user, _id: user._id.toString() };

        // Then find the member record using the clerkId (since member.userId matches user.clerkId)
        let member = await membersCollection.findOne({ userId: clerkId });

        if (!member) {
            console.log("Member not found for userId:", clerkId);
            return { error: "Member information not found" };
        }

        // Convert member _id to string
        member = { ...member, _id: member._id.toString() };

        // Return both user and member data
        return {
            user,
            member
        };

    } catch (error: any) {
        console.log("An error occurred in getUserByClerkId:", error.message);
        return { error: error.message };
    }
};

export const getUserByRole = async (role: string) => {
    if (!dbConnection) await init()

    try {
        const collection = await database?.collection("users");
        if (!database || !collection) {
            console.log("Failed To Connect To Users Collection")
            return { error: "Failed to connect to database" };
        }

        // Find all users with the specified role
        const users = await collection
            .find({ role: role })
            .map((user: any) => ({ ...user, _id: user._id.toString() }))
            .toArray();

        return users;

    } catch (error: any) {
        console.log("An error occurred...", error.message);
        return { error: error.message };
    }
}

export const getUserById = async (id: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");
        if (!collection || !database) {
            return { error: "Failed To Connect To Collection" };
        }

        const user = await collection.findOne({ _id: id }); // or new ObjectId(id) if using MongoDB ObjectId
        if (!user) {
            return { error: "User not found" };
        }
        return {
            ...user,
            _id: user._id.toString(), // Only if using ObjectId
        };
    } catch (error: any) {
        console.log("An error occurred getting user by ID:", error.message);
        return { error: error.message };
    }
};



export const getUserIds = async (emailAddress: string[]) => {
    if (!dbConnection) await init();

    try {

        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection...");
            return;
        }

        const response = await clerkClient.users.getUserList({
            emailAddress: emailAddress,
        });

        return response.data.map((user: { id: any; }) => user.id)

    } catch (error: any) {
        console.log("An error occured...", error.message);
        return { "error": error.message };
    }
}


export const getAllUsers = async () => {
    if (!dbConnection) await init();

    try {

        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection..");
            return;
        }

        const result = await collection
            .find({})
            .map((user: any) => ({ ...user, _id: user._id.toString() }))
            .toArray();
        return result;
    } catch (error: any) {
        console.log("An error occured getting all users...", error.message);
        return { "error": error.message };
    }

}
const deleteUserFromMongoDB = async (clerkId: string) => {
    if (!dbConnection) await init();

    try {

        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection..");
            return;
        }

        const result = await collection.deleteOne({ clerkId: clerkId })
        console.log("User deleted from MongoDB");


        return result;
    } catch (error: any) {
        console.log("An error occured getting all users...", error.message);
        return { "error": error.message };
    }

}

const updateUserRoleInMongoDB = async (clerkId: string, newRole: string) => {
    if (!dbConnection) await init();

    try {

        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection..");
            return;
        }

        const result = await collection.updateOne({ clerkId: clerkId }, { $set: { role: newRole } })
        console.log("User role updated");


        return result;
    } catch (error: any) {
        console.log("An error occured updating user role...", error.message);
        return { "error": error.message };
    }

}

export async function setUserRole(userId: string, newRole: string) {
    try {
        const res = await clerkClient.users.updateUser(
            userId,
            {
                publicMetadata: { role: newRole },
            }
        );
        return { message: res.publicMetadata };
    } catch (err) {
        return { message: err };
    }
}

export const deleteUser = async (_clerkId: string) => {
    try {
        const mongodb = await deleteUserFromMongoDB(_clerkId)
        const response = await clerkClient.users.deleteUser(_clerkId);

        revalidatePath("/dashboard/users")

        return JSON.stringify(response)
    } catch (error: any) {
        //console.log(error);
        return {
            error: JSON.stringify(error)
        }
    }
}

export const updateUserRole = async (_clerkId: string, _newRole: string) => {


    try {
        const res = await clerkClient.users.updateUser(
            _clerkId,
            {
                publicMetadata: { role: _newRole },
            }
        );
        await updateUserRoleInMongoDB(_clerkId, _newRole)

        revalidatePath('/dashboard/users')

        return { message: res.publicMetadata };
    } catch (err) {
        return { message: err };
    }

}

export const getUsersCount = async () => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection..");
            return { count: 0 };
        }

        const count = await collection.countDocuments({});
        return { count };
    } catch (error: any) {
        console.log("An error occurred getting users count...", error.message);
        return { error: error.message };
    }
};

export const updateUserProfilePicture = async (userId: string, newProfilePictureUrl: string) => {
    try {
        // Step 1: Update in Clerk
        const clerkUpdateResponse = await clerkClient.users.updateUser(userId, {
            publicMetadata: { profilePicture: newProfilePictureUrl },
        });

        // Step 2: Update in MongoDB
        if (!dbConnection) await init();

        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection..");
            return { error: "Failed to connect to MongoDB collection." };
        }

        const result = await collection.updateOne(
            { clerkId: userId },
            { $set: { profilePicture: newProfilePictureUrl } }
        );

        return { message: "Profile picture updated successfully", clerkResponse: clerkUpdateResponse, dbUpdateResult: result };
    } catch (error: any) {
        console.log("An error occurred updating profile picture...", error.message);
        return { error: error.message };
    }
};


export const syncClerkUsersToMongoDB = async () => {
    if (!dbConnection) await init()

    try {
        // Get all users from Clerk with proper typing
        const clerkResponse = await clerkClient.users.getUserList({
            limit: 500
        })

        // Extract the data array from the paginated response
        const clerkUsers = clerkResponse.data

        const usersCollection = database.collection("users")
        let syncedCount = 0
        let updatedCount = 0

        for (const clerkUser of clerkUsers) {
            // Transform Clerk user to your MongoDB schema
            const userData: User = {
                _id: clerkUser.id, // Using Clerk's ID as our ID
                clerkId: clerkUser.id,
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                photo: clerkUser.imageUrl,
                role: 'member',
            }

            // Upsert operation
            const result = await usersCollection.updateOne(
                { clerkId: clerkUser.id },
                { $set: userData },
                { upsert: true }
            )

            if (result.upsertedCount > 0) {
                syncedCount++
            } else if (result.modifiedCount > 0) {
                updatedCount++
            }
        }

        return {
            success: true,
            message: `Sync completed. New users: ${syncedCount}, Updated users: ${updatedCount}`
        }
    } catch (error: any) {
        console.error('Sync error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

export const getUserRoleByClerkId = async (clerkId: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");

        if (!database || !collection) {
            console.log("Failed to connect to collection...");
            return { error: "Failed to connect to database" };
        }

        let user = await collection.findOne({ clerkId: clerkId });

        if (user) {
            return { role: user.role || null }; // Return the role if user is found
        }

        return { error: "User not found" };
    } catch (error: any) {
        console.log("An error occurred...", error.message);
        return { error: error.message };
    }
};