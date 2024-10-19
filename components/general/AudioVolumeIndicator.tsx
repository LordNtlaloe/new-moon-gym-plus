import { createSoundDetector, Icon, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'

export default function AudioVolumeIndicator() {
    const {useMicrophoneState} = useCallStateHooks();
    const {isEnabled, mediaStream} = useMicrophoneState();
    const [audioLevel, setAudioLevel] = useState(0);

    useEffect(() => {
        if(!isEnabled || !mediaStream) return;
        const disposeSoundDetecor = createSoundDetector(mediaStream, 
            ({audioLevel: al}) => setAudioLevel(al), {detectionFrequencyInMs: 80, destroyStreamOnStop: false});

        return () => {
            disposeSoundDetecor().catch(console.error)
        }
    }, [isEnabled, mediaStream])

    if(!isEnabled) return null;

    return (
        <div className='flex w-72 items-center gap-3 bg-slate-900 p-4'>
            <Icon icon="mic" />
            <div className="h-1.5 flex-1 bg-white rounded-md">
                <div className="h-full w-full origin-left bg-[#FF0000]" 
                style={{transform: `scaleX(${audioLevel/100})`}}/>
            </div>
        </div>
    )
}
