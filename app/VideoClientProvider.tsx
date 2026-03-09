"use client"

import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient, User } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { getToken } from "./_actions/video.client.actions";

interface VideoClientProviderProps {
    children: React.ReactNode;
}

export default function VideoClientProvider({ children }: VideoClientProviderProps) {
    const videoClient = useInitializeVideoClient();

    if (!videoClient) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="mx-auto animate-spin" />
            </div>
        )
    }

    return (
        <StreamVideo client={videoClient}>
            {children}
        </StreamVideo>
    )
}

function useInitializeVideoClient() {
    const { user, isLoaded: userLoaded } = useUser();
    const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);

    useEffect(() => {
        if (!userLoaded) return;

        const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
        if (!apiKey) throw new Error("Stream API key is undefined");

        let client: StreamVideoClient;

        if (user?.id) {
            // Authenticated user — typed separately so TS resolves the correct overload
            const streamUser: User = {
                id: user.id,
                name: user.firstName || user.id,
                image: user.imageUrl,
            };

            client = new StreamVideoClient({
                apiKey,
                user: streamUser,
                tokenProvider: getToken,
            });
        } else {
            // Guest user — typed separately
            const guestName =
                typeof window !== "undefined"
                    ? localStorage.getItem("stream-guest-name") || ""
                    : "";

            const id = nanoid();

            const streamUser: User = {
                id,
                type: "guest",
                name: guestName.trim() || `Guest ${id.slice(0, 6)}`,
            };

            client = new StreamVideoClient({
                apiKey,
                user: streamUser,
            });
        }

        setVideoClient(client);

        return () => {
            client.disconnectUser();
            setVideoClient(null);
        };

    }, [user?.id, user?.firstName, user?.imageUrl, userLoaded]);

    return videoClient;
}