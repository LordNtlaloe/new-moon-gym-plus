import useLoadRecordings from '@/hooks/useLoadRecodings';
import useStreamCall from '@/hooks/useStreamCall'
import { useUser } from '@clerk/nextjs';
import { Link, Loader2 } from 'lucide-react';
import React from 'react'

export default function RecordingsList() {

    const call = useStreamCall();
    const {recordings, recordingsLoading} = useLoadRecordings(call);
    const {user, isLoaded: userLoaded} = useUser()
    
    if(userLoaded && !user){
        return(
            <p className="text-center">
                You Must Be Logged In To View Recordings
            </p>
        )
        
    }

    if(recordingsLoading){
        return(
            <Loader2 className='mx-auto animate-spin text-2xl'/>
        )
    }
    return (
        <div className='space-y-3 text-center'>
            {recordings.length === 0 && <p>No Recordings Have Been Made</p>}
            <ul className='list-inside list-disc'>
                {recordings.sort((a, b) => b.end_time.localeCompare(a.end_time))
                .map(recording => (
                    <li key={recording.url}>
                        <Link href={recording.url} target='_blank' className='hover:underline'>
                            {new Date(recording.end_time).toLocaleString()}
                        </Link>
                    </li>
                ))}
            </ul>
            <p className='text-sm text-gray-500'>
                Note: Might Up To A Minute Before New Recording Is Saved
            </p>
        </div>
    )
}
