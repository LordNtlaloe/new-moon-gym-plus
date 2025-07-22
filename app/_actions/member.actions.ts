'use server'

import { connectToDB } from "../_database/database";
import { ObjectId } from "mongodb";
import { UserRole } from "@/lib/types";
import { clerkClient } from "@clerk/nextjs/server";
import { error } from "console";


let dbConnection: any;
let database: any;

const init = async () => {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("newmoon_db");
};



export const createMember = async (userId: string, formData: FormData) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("users");
        if (!database || !collection) {
            console.log("Failed To Connect To Database");
            return { error: "Database connection failed" };
        }

        const memberData = {
            userId,
            currentProgram: formData.get("program"),
            dateOfJoining: formData.get("dateOfJoining"),
            programDuration: formData.get("programDuration"),
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await database.collection("members").insertOne(memberData);

        return {
            success: true,
            memberId: result.insertedId.toString()
        };
    } catch (error: any) {
        return { error: error.message };
    }
};
;

export const getMembers = async () => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("members");

        if (!collection || !database) {
            return { error: "Failed To Connect To Collection" };
        }

        const members = await collection.find({}).toArray();
        return members;
    } catch (error: any) {
        console.log("An error occurred getting all members:", error.message);
        return { error: error.message };
    }
};

export const getMemberById = async (id: string) => {
    if (!dbConnection) await init();

    try {
        const membersCollection = await database?.collection("members");
        const usersCollection = await database?.collection("users");

        if (!membersCollection || !usersCollection || !database) {
            return { error: "Failed to connect to database" };
        }

        // Find the member
        const member = await membersCollection.findOne({ _id: new ObjectId(id) });
        if (!member) {
            return { error: "Member not found" };
        }

        // If member has a userId, find the associated user
        let user = null;
        if (member.userId) {
            // Convert the string userId to ObjectId for the query
            user = await usersCollection.findOne({ _id: new ObjectId(member.userId) });
        }

        return {
            member: {
                ...member,
                _id: member._id.toString(),
            },
            user: user ? {
                ...user,
                _id: user._id.toString(),
            } : null
        };
    } catch (error: any) {
        console.log("Error getting member by ID:", error.message);
        return { error: error.message };
    }
};

export const getMemberByUserId = async (userId: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("members");
        if (!collection || !database) {
            return { error: "Failed To Connect To Collection" };
        }

        const member = await collection.findOne({ userId });
        if (!member) {
            return { error: "Member not found" };
        }
        return {
            ...member,
            _id: member._id.toString(),
            dateOfJoining: member.dateOfJoining.toISOString().split('T')[0] // Format date
        };
    } catch (error: any) {
        console.log("An error occurred getting member by user ID:", error.message);
        return { error: error.message };
    }
};

export const updateMember = async (id: string, formData: FormData) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("members");
        if (!collection || !database) {
            return { error: "Failed To Connect To Collection" };
        }

        const updateData = {
            fullName: formData.get("fullName"),
            phoneNumber: formData.get("phoneNumber"),
            program: formData.get("program"),
            dateOfJoining: formData.get("dateOfJoining"),
            programDuration: formData.get("programDuration"),
            status: formData.get("status"),
            updatedAt: new Date()
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return { error: "Failed to update member or no changes made" };
        }

        return { success: "Member updated successfully" };
    } catch (error: any) {
        console.log("An error occurred updating member:", error.message);
        return { error: error.message };
    }
};

export const deleteMember = async (id: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("members");
        if (!collection || !database) {
            return { error: "Failed To Connect To Collection" };
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return { error: "Member not found or already deleted" };
        }

        return { success: "Member deleted successfully" };
    } catch (error: any) {
        console.log("An error occurred deleting member:", error.message);
        return { error: error.message };
    }
};


export const updateMemberProgram = async (memberId: string, formData: FormData) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("members");
        if (!collection || !database) {
            return { error: "Failed To Connect To Collection" };
        }

        const updateData = {
            program: formData.get("program"),
            dateOfJoining: formData.get("dateOfJoining"),
            programDuration: formData.get("programDuration"),
            updatedAt: new Date()
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(memberId) },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return { error: "Failed to update member or no changes made" };
        }

        return { success: "Member program updated successfully" };
    } catch (error: any) {
        console.log("An error occurred updating member:", error.message);
        return { error: error.message };
    }
};


export const getMembersWithUserNames = async () => {
    if (!dbConnection) await init();

    try {
        const membersCollection = await database?.collection("members");
        const usersCollection = await database?.collection("users");

        if (!membersCollection || !usersCollection || !database) {
            return { error: "Failed To Connect To Collections" };
        }

        const members = await membersCollection.find({}).toArray();

        const userIds = members.map((member: any) => new ObjectId(member.userId));
        const users = await usersCollection.find({ _id: { $in: userIds } }).toArray();

        const userMap = new Map(users.map((user: any) => [user._id.toString(), user]));

        const mergedMembers = members.map((member: any) => {
            const user = userMap.get(member.userId);
            const fullName = user ? `${(user as any).firstName || ""} ${(user as any).lastName || ""}`.trim() : "Unknown User";

            return {
                ...member,
                _id: member._id.toString(),
                fullName,
            };
        });

        return mergedMembers;
    } catch (error: any) {
        console.log("An error occurred getting members with user names:", error.message);
        return { error: error.message };
    }
};
