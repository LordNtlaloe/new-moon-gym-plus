'use client';
import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import Alert from './Alert';
import { Button } from './ui/button';

const SessionSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const { isSignedIn, user } = useUser();
  const [guestName, setGuestName] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const router = useRouter();

  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error('useStreamCall must be used within a StreamCall component.');
  }

  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  const handleJoin = () => {
    if (!isSignedIn && !guestName.trim()) {
      alert('Please enter your name to join as a guest');
      return;
    }

    // Store guest name in localStorage if applicable
    if (!isSignedIn && guestName) {
      localStorage.setItem('stream-guest-name', guestName.trim());
    }

    call.join();
    setIsSetupComplete(true);
  };

  if (callTimeNotArrived)
    return (
      <Alert
        title={`Your Session has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
      />
    );

  if (callHasEnded)
    return (
      <Alert
        title="The call has been ended by the host"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      
      {!isSignedIn && (
        <div className="w-full max-w-md px-4 text-center mb-4">
          <p className="mb-4">Sign in to display your name to other participants</p>
          <div className="flex gap-4 justify-center">
            <SignInButton mode="modal">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Create Account
              </Button>
            </SignUpButton>
            <Button 
              onClick={() => setShowGuestForm(true)}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      )}

      {(isSignedIn || showGuestForm) && (
        <>
          <VideoPreview />
          
          {!isSignedIn && (
            <div className="w-full max-w-md px-4">
              <label htmlFor="guest-name" className="block mb-2 font-medium">
                Your Display Name
              </label>
              <input
                id="guest-name"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 text-white"
                placeholder="Enter your name"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Consider signing in so we can remember you next time!
              </p>
            </div>
          )}

          <div className="flex h-16 items-center justify-center gap-3">
            <label className="flex items-center justify-center gap-2 font-medium">
              <input
                type="checkbox"
                checked={isMicCamToggled}
                onChange={(e) => setIsMicCamToggled(e.target.checked)}
              />
              Join with mic and camera off
            </label>
            <DeviceSettings />
          </div>

          <Button
            className="rounded-md bg-green-500 px-4 py-2.5"
            onClick={handleJoin}
          >
            {isSignedIn ? `Join as ${user.firstName || user.username}` : 'Join as Guest'}
          </Button>
        </>
      )}
    </div>
  );
};

export default SessionSetup;