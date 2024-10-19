"use client"

import Button from "@/app/components/main/SessionButton"
import AudioVolumeIndicator from "@/components/general/AudioVolumeIndicator"
import FlexibleCallLayout from "@/components/general/FlexibleCallLayout"
import PermissionsPrompt from "@/components/general/PermissionsPrompt"
import useLoadCall from "@/hooks/useLoadCall"
import useStreamCall from "@/hooks/useStreamCall"
import { useUser } from "@clerk/nextjs"
import { Call, CallControls, CallingState, DeviceSettings, SpeakerLayout, StreamCall, StreamTheme, useCallStateHooks, useStreamVideoClient, VideoPreview } from "@stream-io/video-react-sdk"
import { Loader2, Speaker } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
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
    const call = useStreamCall()
    const callEndedAt = useCallEndedAt();
    const callStartsAt = useCallStartsAt();

    async function handleSetupComplete(){
        call.join();
        setSetupComplete(true)
    }

    const callIsInFuture = callStartsAt && new Date(callStartsAt) > new Date();
    const callHasEnded = !!callEndedAt;
    const [setupComplete, setSetupComplete] = useState(false)


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

    const description = call.state.custom.description;
    return (
        <div className="space-y-6">
            {description && (
                <p className="text-center">
                    Session Details: <span className="font-bold">{description}</span>
                </p>
            )}
            {setupComplete ? (
                <CallUI />

            ):
            (
                <SetupUI onSetUpComplete={handleSetupComplete}/>
            )}
        </div>
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

interface SetupUIProps{
    onSetUpComplete: () => void;
}

function SetupUI({onSetUpComplete}: SetupUIProps){
    const call = useStreamCall();
    const {useMicrophoneState, useCameraState} = useCallStateHooks()
    const micState = useMicrophoneState();
    const camState = useCameraState();
    const [micCamDisabled, setMicCamDisable] = useState(false);

    useEffect(() =>{
        if(micCamDisabled){
            call.camera.disable();
            call.microphone.disable()
        }
        else{
            call.camera.enable();
            call.microphone.enable();
        }
    }, [micCamDisabled, call])
    if(!micState.hasBrowserPermission || !camState.hasBrowserPermission){
        
        return(<PermissionsPrompt />)
    }

    return(
        <div className="flex flex-col items-center gap-3">
            <h1 className="text-center text-2xl font-bold">Setup</h1>
            <VideoPreview />
            <div className="flex h-16 items-center gap-3">
                <AudioVolumeIndicator />
                <DeviceSettings />
            </div>
            <label className="flex items-center gap-2 font-medium">
                <input type="checkbox" checked={micCamDisabled}
                    onChange={(e) => setMicCamDisable(e.target.checked)} />
                Join With Mic & Camera Off
            </label>
            <Button onClick={onSetUpComplete}>Join Session</Button>
        </div>
    )
}

function CallUI(){
    const {useCallCallingState} = useCallStateHooks();
    const callingState = useCallCallingState();

    if(callingState !== CallingState.JOINED){
        return <Loader2 className="font-medium text-2xl animate-spin"/>
    }

    return(
        <FlexibleCallLayout />
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