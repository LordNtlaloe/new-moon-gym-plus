'use server'

import { connectToDB } from "../_database/database";
import { ObjectId } from "mongodb";

let dbConnection: any;
let database: any;

const init = async () => {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("newmoon_db");
};

export const createWaitingList = async (formData: FormData) => {
    const data = {
        full_names: formData.get("full_names"),
        email: formData.get("email"),
        phone_number: formData.get("phone_number"),
        status: "pending", // Default status
    };

    if (!dbConnection) await init();

    try {
        const collection = await database.collection("waiting-list");

        if (!collection || !database) {
            return { error: "Failed to connect to collection!!" };
        }

        const list_item = await collection.insertOne(data);

        if (list_item) {
            console.log("Waiting List Item Created");
        }
        return list_item;
    } catch (error: any) {
        console.log("An error occurred saving new user:", error.message);
        return { error: error.message };
    }
};

export const getWaitingList = async () => {
    if (!dbConnection) await init();

    try {
        const collection = await database.collection("waiting-list");

        if (!collection || !database) {
            return { error: "Failed To Connect To Collection" };
        }

        const members = await collection.find({}).map((user: any) => ({ ...user, _id: user._id.toString() })).toArray();
        return members;
    } catch (error: any) {
        console.log("An error occurred getting all waiting list...", error.message);
        return { error: error.message };
    }
};

export const getWaitingListById = async (id: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database.collection("waiting-list");
        if (!collection || !database) {
            return { error: "Failed To Connect To Collection" };
        }

        const user = await collection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return { error: "User not found" };
        }
        return { ...user, _id: user._id.toString() };
    } catch (error: any) {
        console.log("An error occurred getting user by ID:", error.message);
        return { error: error.message };
    }
};

export const updateWaitingListStatus = async (id: string, status: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database.collection("waiting-list");
        if (!collection || !database) {
            return { error: "Failed To Connect To Collection" };
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );
        
        if (result.modifiedCount === 0) {
            return { error: "Failed to update status or no changes made" };
        }

        return { success: "Status updated successfully" };
    } catch (error: any) {
        console.log("An error occurred updating status:", error.message);
        return { error: error.message };
    }
};
