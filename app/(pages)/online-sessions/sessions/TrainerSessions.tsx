'use client'

import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2, Calendar, Clock, User, FileText } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function TrainerSessions() {
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [sessions, setSessions] = useState<Call[]>([]);
    
    useEffect(() => {
        async function loadCalls() {
            if (!client || !user?.id) return;

            const { calls } = await client.queryCalls({
                sort: [{ field: "starts_at", direction: -1 }],
                filter_conditions: {
                    starts_at: { $exists: true },
                    $or: [
                        { created_by_user_id: user.id },
                        { members: { $in: [user.id] } },
                    ],
                },
            });
            setSessions(calls);
        }
        loadCalls();
    }, [client, user?.id]);

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-slate-800 shadow-lg rounded-xl">
            <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-200">Your Sessions</h1>
            {!sessions.length && <Loader2 className="text-gray-500 w-10 h-10 animate-spin mx-auto mt-6" />}
            
            <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {sessions.map((call) => (
                    <SessionItem call={call} key={call.id} />
                ))}
            </div>
        </div>
    );
}

interface SessionItemProps {
    call: Call;
}

function SessionItem({ call }: SessionItemProps) {
    const sessionLink = `/online-sessions/${call.id}`;
    
    return (
        <div className="relative p-5 bg-gray-100 dark:bg-gray-700 shadow-xl rounded-xl transition-all duration-500 transform hover:shadow-2xl">
            <Link href={sessionLink} className="block text-lg font-medium text-blue-600 hover:underline">
                <h2 className="text-gray-600 dark:text-gray-200 font-bold">{call.state.custom?.title || "Session"}</h2>
                <p className="text-gray-400 flex items-center gap-1">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    {call.state.startsAt ? new Date(call.state.startsAt).toLocaleString() : "No Date"}
                </p>
                <p className="text-gray-400 flex items-center gap-1 mt-2">
                    <User className="w-5 h-5 text-gray-500" />
                    {call.currentUserId || "Unknown Creator"}
                </p>
                {call.state.custom?.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 flex items-center gap-1">
                        <FileText className="w-5 h-5 text-gray-500" />
                        {call.state.custom.description}
                    </p>
                )}
            </Link>
        </div>
    );
}
