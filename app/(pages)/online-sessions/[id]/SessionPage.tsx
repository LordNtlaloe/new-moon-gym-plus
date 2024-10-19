"use client"

import useLoadCall from "@/hooks/useLoadCall"
import useStreamCall from "@/hooks/useStreamCall"
import { useUser } from "@clerk/nextjs"
import { Call, CallControls, SpeakerLayout, StreamCall, StreamTheme, useCallStateHooks, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { Loader2, Speaker } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
interface SessionPageProps {
    id: string
}

export default function SessionPage({ id }: SessionPageProps) {
    const { user, isLoaded: userLoaded } = useUser();
    const { call, callLoading } = useLoadCall(id)


    if (!userLoaded || callLoading) {
        return <Loader2 className="mx-auto text-2xl animate-spin" />
    }

    if (!call) {
        return (
            <p className="text-center font-bold">Specified Session Does Not Exist</p>
        )
    }

    const notAllowedToJoin = call.type === "private-session" &&
        (!user || !call.state.members.find(member => member.user.id === user.id));

    if (notAllowedToJoin) {
        return (
            <p className="text-center font-bold">This Session Is Restricted</p>
        )
    }
    return (
        <div className="">
            <StreamCall call={call}>
                <StreamTheme>
                    <SessionScreen />
                </StreamTheme>
            </StreamCall>
        </div>
    )
}

function SessionScreen() {
    const { useCallEndedAt, useCallStartsAt } = useCallStateHooks()

    const callEndedAt = useCallEndedAt();
    const callStartsAt = useCallStartsAt();
    const callIsInFuture = callStartsAt && new Date(callStartsAt) > new Date();
    const callHasEnded = !!callEndedAt;

    if (callHasEnded) {
        return (
            <SessionHasEnded />
        )
    }

    if (callIsInFuture) {
        return (
            <UpcomingSessions />
        )
    }
    return (
        <div className=""></div>
    )

}

function SessionHasEnded() {
    return (
        <div className="flex flex-col items-center gap-6">
            <p className="font-bold">
                Session Has Ended
            </p>
            <Link href="/" className="flex items-center justify-center gap-2 bg-[#FF0000] text-white px-3 py-2 font-semibold transition-colors hover:bg-red-600 active:bg-red-600 disabled:bg-gray-200">Back To Home Screen</Link>
        </div>
    )
}

function UpcomingSessions() {
    const call = useStreamCall()

    return (
        <div className="flex flex-col items-center gap-6">
            <p>This Session Has Not Started Yet...</p>
            <p>
                Session Time Is{""}
                <span className="font-bold">{call.state.startsAt?.toLocaleString()}</span>
            </p>
            {call.state.custom.description && <p>
                Session Details{""}
                <span className="font-bold">{call.state.custom.description}</span>
            </p>
            }
            <Link href="/" className="flex items-center justify-center gap-2 bg-[#FF0000] text-white px-3 py-2 font-semibold transition-colors hover:bg-red-600 active:bg-red-600 disabled:bg-gray-200">Back To Home Screen</Link>
        </div>
    )
}