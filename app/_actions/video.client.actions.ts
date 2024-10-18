"use server"

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export async function getToken() {
    const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
    const streamApiSecret = process.env.STREAM_VIDEO_API_SECRET;

    if(!streamApiKey || !streamApiSecret){
        throw new Error("Stream API Key or Secret Not Found")
    }

    const user = await currentUser();

    console.log("Generating Token For User: ", user?.id)

    if(!user){
        throw new Error("User Not Authenticated")
    }

    const streamClient = new StreamClient(streamApiKey, streamApiSecret);

    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;

    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamClient.createToken(user.id, expirationTime, issuedAt)

    console.log("Successfully Generated Token: ", token)

    return token;
}