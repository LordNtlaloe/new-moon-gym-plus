import useStreamCall from '@/hooks/useStreamCall';
import { CallControls, PaginatedGridLayout, SpeakerLayout } from '@stream-io/video-react-sdk';
import { BetweenHorizonalEnd, BetweenVerticalEnd, Grid } from 'lucide-react';
import React, { useState } from 'react'
import EndCallButton from './EndCallButton';
import { useRouter } from 'next/navigation';

type CallLayout = "speaker-vert" | "speaker-horiz" | "grid"

export default function FlexibleCallLayout() {
    const [layout, setLayout] = useState<CallLayout>("speaker-vert");
    const call = useStreamCall();

    const router = useRouter();
    return (
        <div className='space-y-3'>
            <CallLayoutButtons layout={layout} setLayout={setLayout} />
            <CallLayoutView layout={layout} />
            <CallControls onLeave={() => router.push(`/online-sessions/${call.id}/left`)}/> 
            <EndCallButton />
        </div>
    )
}

interface CallLayoutButtonsProps{
    layout: CallLayout,
    setLayout: (layout: CallLayout) => void
}

function CallLayoutButtons({layout, setLayout}: CallLayoutButtonsProps){
    return (
        <div className="mx-auto w-fit space-x-6">
            <button onClick={() => setLayout("speaker-vert")}>
                <BetweenVerticalEnd  className={ layout !== "speaker-vert" ? "text-gray-500" : "text-[#FF0000]"}/>
            </button>
            <button onClick={() => setLayout("speaker-horiz")}>
                <BetweenHorizonalEnd className={ layout !== "speaker-horiz" ? "text-gray-500" : "text-[#FF0000]"} />
            </button>
            <button onClick={() => setLayout("grid")}>
                <Grid className={ layout !== "grid" ? "text-gray-500" : "text-[#FF0000]"}/> 
            </button>
        </div>
    )
}

interface CallLayoutViewProps{
    layout: CallLayout
}

function CallLayoutView({layout}: CallLayoutViewProps){
    if(layout === "speaker-vert"){
        return(
            <SpeakerLayout />
        )
    }
    if(layout === "speaker-horiz"){
        return(
            <SpeakerLayout participantsBarPosition="right" />
        )
    }

    if(layout === "grid"){
        return (
            <PaginatedGridLayout />
        )
    }

    return null;
}
