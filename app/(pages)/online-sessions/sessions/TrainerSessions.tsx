"use client"

import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { Link, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function TrainerSessions() {
    const {user} = useUser();
    const client = useStreamVideoClient();
    const [calls, setCalls] = useState<Call[]>();

    useEffect(() => {

        async function loadCalls() {
            if(!client || !user?.id){
                return;
            }
    
            const {calls} = await client.queryCalls({
                sort: [{field: "starts_at", direction: -1}],
                filter_conditions: {
                    starts_at:{$exists: true},
                    $or: [
                        {created_by_user_id: user.id},
                        {members: {$in: [user.id]}}
                    ]
                }
            })
            setCalls(calls)
        }
        loadCalls();

    },[client, user?.id])
    return (
        <div className='space-y-3'>
            <h1 className='text-center text-2xl font-bold'>Your Sessions</h1>
            {!calls && <Loader className='text-2xl animate-spin mx-auto'/>}
            {calls?.length === 0 && <p>No Sessions Have Be Scheduled</p>}
            <ul className='list-inside list-disc space-y-2'>
                {calls?.map(call => <SessionItem call={call} key={call.id}/>)}
            </ul>
        </div>
    )
}

interface SessionItemProps{
    call: Call
}

function SessionItem({call}: SessionItemProps){
    const sessionLink = `/online-sessions/${call.id}`
    const isInFuture = call.state.startsAt && new Date(call.state.startsAt) > new Date();
    const hasEnded = !!call.state.endedAt;
    return(
        <li>
            <Link href={sessionLink} className='hover:underline'>
                {call.state.startsAt?.toLocaleString()}
                {isInFuture && "(Upcoming)"}
                {hasEnded && "(Ended)"}
            </Link>
            <p className="ml-6 text-gray-500">{call.state.custom.description}</p>
        </li>
    )
}
