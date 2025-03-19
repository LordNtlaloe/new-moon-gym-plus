'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { Trash2 } from 'lucide-react';

import Loader from './Loader';
import { useGetCalls } from '@/hooks/useGetCalls';
import SessionCard from './SessionCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading, deleteCall } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
      );

      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordings);
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  const handleDeleteCall = async (callId: string) => {
    setSelectedCallId(callId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedCallId) {
      try {
        await deleteCall(selectedCallId, type);
        setShowDeleteConfirm(false);
        setSelectedCallId(null);
      } catch (error) {
        console.error('Failed to delete call:', error);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedCallId(null);
  };

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {calls && calls.length > 0 ? (
          calls.map((meeting: Call | CallRecording) => (
            <SessionCard
              key={(meeting as Call).id || (meeting as CallRecording).url}
              icon={
                type === 'ended'
                  ? '/icons/previous.svg'
                  : type === 'upcoming'
                    ? '/icons/upcoming.svg'
                    : '/icons/recordings.svg'
              }
              title={
                (meeting as Call).state?.custom?.description ||
                (meeting as CallRecording).filename?.substring(0, 20) ||
                'No Description'
              }
              date={
                (meeting as Call).state?.startsAt?.toLocaleString() ||
                (meeting as CallRecording).start_time?.toLocaleString()
              }
              isPreviousSession={type === 'ended'}
              link={
                type === 'recordings'
                  ? (meeting as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
              }
              buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
              buttonText={type === 'recordings' ? 'Play' : 'Start'}
              handleClick={
                type === 'recordings'
                  ? () => router.push(`${(meeting as CallRecording).url}`)
                  : () => router.push(`/meeting/${(meeting as Call).id}`)
              }
              buttonIcon2={<Trash2 className="h-4 w-4" />}
              buttonText2="Delete"
              handleSecondaryClick={() => 
                handleDeleteCall((meeting as Call).id || (meeting as CallRecording).url)
              }
            />
          ))
        ) : (
          <h1 className="text-2xl font-bold text-white">{noCallsMessage}</h1>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-gray-800 p-6 text-white">
            <h3 className="mb-4 text-xl font-bold">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="rounded-md bg-gray-600 px-4 py-2 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CallList;