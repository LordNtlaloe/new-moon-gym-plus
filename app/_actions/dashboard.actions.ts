'use server'

import { connectToDB } from "../_database/database";

let dbConnection: any;
let database: any;

const init = async () => {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("newmoon_db"); // change to your DB name
};

export const getDashboardStats = async () => {
    if (!dbConnection) await init();

    const membersCollection = database.collection("members");
    const usersCollection = database.collection("users");

    const totalMembers = await membersCollection.countDocuments();
    const newSignUpsThisMonth = await membersCollection.countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    });
    const activeSubscriptions = await membersCollection.countDocuments({ status: "active" });
    const weightLossProgram = await membersCollection.countDocuments({ currentProgram: "Weightloss Therapy" });
    const trainers = await usersCollection.countDocuments({ role: "Trainer" });
    const cancelledSubscriptions = await membersCollection.countDocuments({ status: "cancelled" });

    return {
        totalMembers,
        newSignUpsThisMonth,
        activeSubscriptions,
        weightLossProgram,
        trainers,
        cancelledSubscriptions,
    };
};