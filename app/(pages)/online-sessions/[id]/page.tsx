'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import Alert from '@/components/Alert';
import SessionSetup from '@/components/SessionSetup';
import SessionRoom from '@/components/SessionRoom';

const SessionPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [guestName, setGuestName] = useState('');
  const searchParams = useSearchParams();

  // Load guest name from localStorage or URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check localStorage first
      const savedGuestName = localStorage.getItem('stream-guest-name');
      if (savedGuestName) {
        setGuestName(savedGuestName);
        return;
      }

      // Check URL params as fallback
      const urlGuestName = searchParams.get('guestName');
      if (urlGuestName) {
        setGuestName(urlGuestName);
        localStorage.setItem('stream-guest-name', urlGuestName);
      }
    }
  }, [searchParams]);

  if (!isLoaded || isCallLoading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader className="animate-spin text-white" size={48} />
    </div>
  );

  if (!call) return (
    <div className="h-screen w-full flex items-center justify-center">
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    </div>
  );

  // Check if user is allowed to join
  const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed) return (
    <div className="h-screen w-full flex items-center justify-center">
      <Alert title="You are not allowed to join this session" />
    </div>
  );

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <SessionSetup
              setIsSetupComplete={setIsSetupComplete}
              initialGuestName={guestName}
              onGuestNameChange={setGuestName}
            />
          ) : (
            <SessionRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default SessionPage;