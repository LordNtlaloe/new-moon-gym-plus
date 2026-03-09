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

// Create a new consultation booking
export const createConsultationBooking = async (formData: FormData) => {
    const data = {
        full_names: formData.get("full_names"),
        email: formData.get("email"),
        phone_number: formData.get("phone_number"),
        date: formData.get("date"),
        time: formData.get("time"),
        status: "pending", // Default status
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
};

// Get all consultation bookings
export const getAllConsultationBookings = async () => {
    if (!dbConnection) await init();

    try {
        const collection = await database.collection("consultation_bookings");
        if (!collection || !database) {
            return { error: "Failed to connect to collection!" };
        }

        const bookings = await collection.find({}).toArray();
        return bookings.map((booking: any) => ({
            ...booking,
            _id: booking._id.toString(), // Convert ObjectId to string
        }));
    } catch (error: any) {
        console.log("An error occurred fetching consultation bookings:", error.message);
        return { error: error.message };
    }
};

// Get a single consultation booking by ID
export const getConsultationBookingById = async (id: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database.collection("consultation_bookings");
        if (!collection || !database) {
            return { error: "Failed to connect to collection!" };
        }

        const booking = await collection.findOne({ _id: new ObjectId(id) });
        if (!booking) {
            return { error: "Booking not found!" };
        }

        return {
            ...booking,
            _id: booking._id.toString(), // Convert ObjectId to string
        };
    } catch (error: any) {
        console.log("An error occurred fetching the consultation booking:", error.message);
        return { error: error.message };
    }
};

// Update a booking status
export const updateConsultationBookingStatus = async (id: string, status: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database.collection("consultation_bookings");
        if (!collection || !database) {
            return { error: "Failed to connect to collection!" };
        }

        const updateResult = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );

        if (updateResult.matchedCount === 0) {
            return { error: "Booking not found!" };
        }

        return { success: "Booking status updated successfully!" };
    } catch (error: any) {
        console.log("An error occurred updating the booking status:", error.message);
        return { error: error.message };
    }
};

// Delete a consultation booking
export const deleteConsultationBooking = async (id: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database.collection("consultation_bookings");
        if (!collection || !database) {
            return { error: "Failed to connect to collection!" };
        }

        const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });

        if (deleteResult.deletedCount === 0) {
            return { error: "Booking not found!" };
        }

        return { success: "Booking deleted successfully!" };
    } catch (error: any) {
        console.log("An error occurred deleting the booking:", error.message);
        return { error: error.message };
    }
};
