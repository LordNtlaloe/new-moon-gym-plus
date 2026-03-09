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

// Create a new scholarship application
export const createScholarshipApplication = async (formData: FormData) => {
    const data = {
        full_names: formData.get("full_names"),
        age: formData.get("age"),
        biggest_struggle: formData.get("biggest_struggle"),
        why_choose_you: formData.get("why_choose_you"),
        ready_to_commit: formData.get("ready_to_commit"),
        whatsapp_number: formData.get("whatsapp_number"),
        call_number: formData.get("call_number"),
        location: formData.get("location"),
        status: "pending",
        submitted_at: new Date().toISOString(),
    };

    if (!dbConnection) await init();

    try {
        const collection = await database.collection("scholarship_applications");

        if (!collection || !database) {
            return { error: "Failed to connect to collection!" };
        }

        // Prevent duplicate applications by WhatsApp number or call number
        const existingApplication = await collection.findOne({
            $or: [
                { whatsapp_number: data.whatsapp_number },
                { call_number: data.call_number },
            ],
        });

        if (existingApplication) {
            return { error: "An application with this contact number already exists." };
        }

        const applicationItem = await collection.insertOne(data);

        if (applicationItem) {
            console.log("Scholarship Application Created");
        }

        return applicationItem;
    } catch (error: any) {
        console.log("An error occurred saving scholarship application:", error.message);
        return { error: error.message };
    }
};

// Get all scholarship applications
export const getAllScholarshipApplications = async () => {
    if (!dbConnection) await init();

    try {
        const collection = await database.collection("scholarship_applications");

        if (!collection || !database) {
            return { error: "Failed to connect to collection!" };
        }

        const applications = await collection
            .find({})
            .sort({ submitted_at: -1 })
            .toArray();

        return applications.map((app: any) => ({
            ...app,
            _id: app._id.toString(),
        }));
    } catch (error: any) {
        console.log("An error occurred fetching scholarship applications:", error.message);
        return { error: error.message };
    }
};

// Get a single application by ID
export const getScholarshipApplicationById = async (id: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database.collection("scholarship_applications");

        if (!collection || !database) {
            return { error: "Failed to connect to collection!" };
        }

        const application = await collection.findOne({ _id: new ObjectId(id) });

        if (!application) {
            return { error: "Application not found!" };
        }

        return {
            ...application,
            _id: application._id.toString(),
        };
    } catch (error: any) {
        console.log("An error occurred fetching the application:", error.message);
        return { error: error.message };
    }
};

// Update application status (e.g. pending → approved / rejected)
export const updateScholarshipApplicationStatus = async (
    id: string,
    status: "pending" | "approved" | "rejected"
) => {
    if (!dbConnection) await init();

    try {
        const collection = await database.collection("scholarship_applications");

        if (!collection || !database) {
            return { error: "Failed to connect to collection!" };
        }

        const updateResult = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }
        );

        if (updateResult.matchedCount === 0) {
            return { error: "Application not found!" };
        }

        return { success: "Application status updated successfully!" };
    } catch (error: any) {
        console.log("An error occurred updating the application status:", error.message);
        return { error: error.message };
    }
};

// Delete a scholarship application
export const deleteScholarshipApplication = async (id: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database.collection("scholarship_applications");

        if (!collection || !database) {
            return { error: "Failed to connect to collection!" };
        }

        const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });

        if (deleteResult.deletedCount === 0) {
            return { error: "Application not found!" };
        }

        return { success: "Application deleted successfully!" };
    } catch (error: any) {
        console.log("An error occurred deleting the application:", error.message);
        return { error: error.message };
    }
};