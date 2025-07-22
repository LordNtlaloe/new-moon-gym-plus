'use server'

import { connectToDB } from "../_database/database";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

let dbConnection: any;
let database: any;

const init = async () => {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("newmoon_db");
};

interface WeightMeasurement {
    date: Date;
    weight: string;
    fastingBloodSugar: string;
    bloodPressure: string;
    pulse: string;
    notes?: string;
}

export const saveWeightMeasurement = async (memberId: string, data: WeightMeasurement, path: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("weightMeasurements");
        if (!database || !collection) {
            throw new Error("Database connection failed");
        }

        const measurementData = {
            memberId: new ObjectId(memberId),
            date: data.date,
            weight: data.weight,
            fastingBloodSugar: data.fastingBloodSugar,
            bloodPressure: data.bloodPressure,
            pulse: data.pulse,
            notes: data.notes || "",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await collection.insertOne(measurementData);
        revalidatePath(path);
        
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
};

export const getWeightMeasurements = async (memberId: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("weightMeasurements");
        if (!collection || !database) {
            throw new Error("Failed to connect to collection");
        }

        const measurements = await collection.find({ 
            memberId: new ObjectId(memberId) 
        }).sort({ date: -1 }).toArray();

        return measurements.map((measurement: { _id: { toString: () => any; }; date: { toISOString: () => string; }; weight: any; bloodPressure: any; pulse: any; fastingBloodSugar: any; notes: any; }) => ({
            id: measurement._id.toString(),
            date: measurement.date.toISOString().split('T')[0],
            weight: measurement.weight,
            bloodPressure: measurement.bloodPressure,
            pulse: measurement.pulse,
            fastingBloodSugar: measurement.fastingBloodSugar,
            notes: measurement.notes
        }));
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteWeightMeasurement = async (id: string, path: string) => {
    if (!dbConnection) await init();

    try {
        const collection = await database?.collection("weightMeasurements");
        if (!collection || !database) {
            throw new Error("Failed to connect to collection");
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            throw new Error("Measurement not found");
        }
        
        revalidatePath(path);
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
};