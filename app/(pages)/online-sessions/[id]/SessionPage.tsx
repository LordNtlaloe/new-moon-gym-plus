"use client"

import { Call, CallControls, SpeakerLayout, StreamCall, StreamTheme, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { Loader2, Speaker } from "lucide-react"
import { useState } from "react"
interface SessionPageProps{
    id: string
}

export default function SessionPage({id}: SessionPageProps){
    const [call, setCall] = useState<Call>()
    const client = useStreamVideoClient()

    if(!client){
        return <Loader2 className="mx-auto text-2xl animate-spin"/>
    }

    if(!call){
        return <button onClick={ async () => {
            const call = client.call("default", id);
            await call.join();
            setCall(call)
        }}>Join Session</button>
    }
    return(
        <div className="">
            <StreamCall call={call}>
                <StreamTheme className="space-y-3">
                    <SpeakerLayout />
                    <CallControls />
                </StreamTheme>
            </StreamCall>
        </div>
    )
}