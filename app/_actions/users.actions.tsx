'use server'

import { connectToDB } from "../_database/database";
import bcrypt from 'bcrypt'
import { redirect } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { User } from "@/lib/types";

let dbConnection: any;
let database: any;

const init = async () => {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("newmoon_db");
};

// -------------------- CREATE USER (LOCAL FORM) --------------------
export const saveNewUser = async (formData: FormData) => {
    const password = formData.get("userPassword") as string;
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;

    const data = {
        email: formData.get("userEmail"),
        name: formData.get("name"),
        surname: formData.get("userSurname"),
        othernames: formData.get("userOtherNames"),
        phoneNumber: formData.get("userPhoneNumber"),
        password: hashedPassword
    };

    if (!dbConnection) await init();

    try {
        const collection = await database.collection("users");

        if (!collection || !database) {
            return { error: "Failed to connect to collection!!" };
        }

        newUser = await collection.insertOne(data);

        if (newUser) {
            newUser = { ...newUser, insertedId: newUser.insertedId.toString() };
        }

    } catch (error: any) {
        console.log("An error occurred saving new user:", error.message);
        return { error: error.message };
    }

    if (newUser) {
        redirect("/sign-in");
    }

    return newUser;
};

// -------------------- CREATE USER (FROM CLERK) --------------------
export const createNewUserFromClerk = async (userData: any) => {
    if (!dbConnection) await init();

    try {
        const usersCollection = await database.collection("users");
        const membersCollection = await database.collection("members");

        if (!usersCollection || !database) {
            return { error: "Failed to connect to collections!!" };
        }

        const userDocument = {
            clerkId: userData.clerkId,
            email: userData.email,
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            photo: userData.photo,
            role: userData.role,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const newUser = await usersCollection.insertOne(userDocument);

        let newMember = null;
        if (membersCollection) {
            const memberDocument = {
                userId: userData.clerkId,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: userData.role,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            newMember = await membersCollection.insertOne(memberDocument);
        }

        return {
            success: true,
            user: { ...userDocument, _id: newUser.insertedId.toString() },
            member: newMember ? { _id: newMember.insertedId.toString() } : null
        };

    } catch (error: any) {
        console.log("An error occurred saving new user:", error.message);
        return { error: error.message };
    }
};

// -------------------- FETCH USERS --------------------
export const getUserByEmail = async (email: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");

        if (!database || !collection) {
            return { error: "Failed to connect to collection..." };
        }

        let user = await collection.findOne({ email });

        if (user) {
            user = { ...user, _id: user._id.toString() };
        }

        return user;

    } catch (error: any) {
        return { error: error.message };
    }
};

export const getUserByClerkId = async (clerkId: string) => {
    if (!dbConnection) await init();

    try {
        const usersCollection = await database?.collection("users");
        const membersCollection = await database?.collection("members");

        if (!database || !usersCollection || !membersCollection) {
            return { error: "Failed to connect to database" };
        }

        let user = await usersCollection.findOne({ clerkId });
        if (!user) return { error: "User not found" };
        user._id = user._id.toString();

        let member = await membersCollection.findOne({ userId: clerkId });
        if (!member) return { error: "Member info not found" };
        member._id = member._id.toString();

        return { user, member };

    } catch (error: any) {
        return { error: error.message };
    }
};

export const getUserByRole = async (role: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");
        if (!database || !collection) return { error: "Failed to connect to database" };

        const users = await collection.find({ role })
            .map((user: any) => ({ ...user, _id: user._id.toString() }))
            .toArray();

        return users;

    } catch (error: any) {
        return { error: error.message };
    }
};

export const getUserById = async (id: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");
        if (!collection || !database) return { error: "Failed to connect to collection" };

        const user = await collection.findOne({ _id: id });
        if (!user) return { error: "User not found" };

        return { ...user, _id: user._id.toString() };

    } catch (error: any) {
        return { error: error.message };
    }
};

export const getUserIds = async (emailAddress: string[]) => {
    if (!dbConnection) await init();

    try {
        const client = await clerkClient();
        const response = await client.users.getUserList({ emailAddress });
        return response.data.map((user: { id: any }) => user.id);

    } catch (error: any) {
        return { error: error.message };
    }
};

export const getAllUsers = async () => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");
        if (!database || !collection) return [];

        const result = await collection.find({})
            .map((user: any) => ({ ...user, _id: user._id.toString() }))
            .toArray();
        return result;
    } catch (error: any) {
        return { error: error.message };
    }
};

// -------------------- UPDATE ROLE --------------------
export const updateUserRoleInMongoDB = async (clerkId: string, newRole: string) => {
    if (!dbConnection) await init();

    try {
        const usersCollection = await database?.collection("users");
        const membersCollection = await database?.collection("members");
        if (!database || !usersCollection) return { error: "Failed to connect to database" };

        const userResult = await usersCollection.updateOne(
            { clerkId },
            { $set: { role: newRole, updatedAt: new Date() } }
        );

        let memberResult = null;
        if (membersCollection) {
            memberResult = await membersCollection.updateOne(
                { userId: clerkId },
                { $set: { role: newRole, updatedAt: new Date() } }
            );
        }

        return { success: true, usersModified: userResult.modifiedCount, membersModified: memberResult?.modifiedCount || 0, newRole };

    } catch (error: any) {
        return { error: error.message };
    }
};

export const updateUserRole = async (clerkId: string, newRole: string) => {
    try {
        const client = await clerkClient();
        await client.users.updateUser(clerkId, { publicMetadata: { role: newRole } });
        await updateUserRoleInMongoDB(clerkId, newRole);
        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
};

// -------------------- DELETE USER --------------------
export const deleteUserFromMongoDB = async (clerkId: string) => {
    if (!dbConnection) await init();

    try {
        const usersCollection = await database?.collection("users");
        const membersCollection = await database?.collection("members");
        if (!database || !usersCollection) return { error: "Failed to connect to database" };

        const userResult = await usersCollection.deleteOne({ clerkId });
        let memberResult = null;
        if (membersCollection) memberResult = await membersCollection.deleteOne({ userId: clerkId });

        return { success: true, usersDeleted: userResult.deletedCount, membersDeleted: memberResult?.deletedCount || 0 };

    } catch (error: any) {
        return { error: error.message };
    }
};

export const deleteUser = async (clerkId: string) => {
    try {
        await deleteUserFromMongoDB(clerkId);
        const client = await clerkClient();
        await client.users.deleteUser(clerkId);
        revalidatePath("/dashboard/users");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
};

// -------------------- SYNC CLERK -> MONGO --------------------
export const syncClerkUsersToMongoDB = async () => {
    if (!dbConnection) await init();

    try {
        const client = await clerkClient();
        const clerkUsers = await client.users.getUserList({ limit: 500 });
        const usersCollection = database.collection("users");

        let synced = 0, updated = 0;

        for (const clerkUser of clerkUsers.data) {
            const userData: User = {
                _id: clerkUser.id,
                clerkId: clerkUser.id,
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                photo: clerkUser.imageUrl,
                role: (clerkUser.publicMetadata as any)?.role || "member"
            };

            const result = await usersCollection.updateOne(
                { clerkId: clerkUser.id },
                { $set: userData },
                { upsert: true }
            );

            if (result.upsertedCount) synced++;
            else if (result.modifiedCount) updated++;
        }

        return { success: true, synced, updated };

    } catch (error: any) {
        return { error: error.message };
    }
};

// -------------------- EXTRA UTILITIES --------------------
export const getUserRoleByClerkId = async (clerkId: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");
        if (!database || !collection) return { error: "Failed to connect to database" };

        const user = await collection.findOne({ clerkId });
        if (user) return { role: user.role || null };
        return { error: "User not found" };
    } catch (error: any) {
        return { error: error.message };
    }
};

export const updateUserProfilePicture = async (userId: string, newProfilePictureUrl: string) => {
    try {
        const client = await clerkClient();
        const clerkUpdateResponse = await client.users.updateUser(userId, {
            publicMetadata: { profilePicture: newProfilePictureUrl }
        });

        if (!dbConnection) await init();
        const collection = await database?.collection("users");
        if (!database || !collection) return { error: "Failed to connect to MongoDB collection." };

        const result = await collection.updateOne(
            { clerkId: userId },
            { $set: { profilePicture: newProfilePictureUrl } }
        );

        return { message: "Profile picture updated successfully", clerkResponse: clerkUpdateResponse, dbUpdateResult: result };

    } catch (error: any) {
        return { error: error.message };
    }
};

export const getUsersCount = async () => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");
        if (!database || !collection) return { count: 0 };

        const count = await collection.countDocuments({});
        return { count };

    } catch (error: any) {
        return { error: error.message };
    }
};

export const updateUserInMongoDB = async (userData: any) => {
    if (!dbConnection) await init();

    try {
        const usersCollection = await database?.collection("users");
        const membersCollection = await database?.collection("members");
        if (!database || !usersCollection) return { error: "Failed to connect to database" };

        const updateData = {
            email: userData.email,
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            photo: userData.photo,
            role: userData.role,
            updatedAt: new Date()
        };

        const userResult = await usersCollection.updateOne(
            { clerkId: userData.clerkId },
            { $set: updateData }
        );

        let memberResult = null;
        if (membersCollection) {
            const memberUpdateData = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: userData.role,
                updatedAt: new Date()
            };

            memberResult = await membersCollection.updateOne(
                { userId: userData.clerkId },
                { $set: memberUpdateData }
            );
        }

        return { success: true, usersModified: userResult.modifiedCount, membersModified: memberResult?.modifiedCount || 0, clerkId: userData.clerkId };

    } catch (error: any) {
        return { error: error.message };
    }
};
