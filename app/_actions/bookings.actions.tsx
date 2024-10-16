'use server'

import { connectToDB } from "../_database/database";

let dbConnection: any;
let database: any

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
    };

    if (!dbConnection) await init();

    try {
        const collection = await database.collection("bookings");

        if (!collection || !database) {
            return { error: "Failed to connect to collection!" };
        }

        // Check if the user already exists in the waiting list
        const existingEntry = await collection.findOne({
            $or: [
                { email: data.email },
                { phone_number: data.phone_number }
            ]
        });

        if (existingEntry) {
            return { error: "You cannot sign up for the waiting list more than once." };
        }

        // Insert the new waiting list entry
        const list_item = await collection.insertOne(data);

        if (list_item) {
            console.log("Waiting List Item Created");
        }
        return list_item;
    } catch (error: any) {
        console.log("An error occurred saving new user:", error.message);
        return { error: error.message };
    }
}

export const createConsultationBooking = async (formData: FormData) => {
    const data = {
        full_names: formData.get("full_names"),
        email: formData.get("email"),
        phone_number: formData.get("phone_number"),
        date: formData.get("date"),
        time: formData.get("time"),
    };

    if (!dbConnection) await init();

    try {
        const collection = await database.collection("consultation_bookings");

        if (!collection || !database) {
            return { error: "Failed to connect to collection!" };
        }

        // Check if the user already has a booking
        const existingBooking = await collection.findOne({
            $or: [
                { email: data.email },
                { phone_number: data.phone_number }
            ]
        });

        if (existingBooking) {
            return { error: "You cannot book more than once." };
        }

        // Insert the new booking
        const bookingItem = await collection.insertOne(data);

        if (bookingItem) {
            console.log("Consultation Booking Created");
        }
        return bookingItem;
    } catch (error: any) {
        console.log("An error occurred saving new consultation booking:", error.message);
        return { error: error.message };
    }
}
