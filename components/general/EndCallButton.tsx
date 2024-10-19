import useStreamCall from '@/hooks/useStreamCall'
import { useCallStateHooks } from '@stream-io/video-react-sdk';
import React from 'react'

export default function EndCallButton() {
    const call = useStreamCall();
    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();
    const participantIsSessionOwner = localParticipant && call.state.createdBy
        && localParticipant.userId === call.state.createdBy.id

    if (!participantIsSessionOwner) {
        return null;
    }
    return (
        <button onClick={call.endCall}
            className='mx-auto block font-medium text-[#FF0000] hover:bg-red-600'>
            End Call For Everyone
        </button>
    )
}
