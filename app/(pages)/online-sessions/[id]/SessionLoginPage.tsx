"use client";

import { Button } from '@/components/ui/button';
import { ClerkLoaded, ClerkLoading, SignInButton } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SessionLoginPage() {
    const [guestName, setGuestName] = useState('');
    const [showGuestForm, setShowGuestForm] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const isGuestMode = searchParams.get('guest') === 'true';

    const handleGuestJoin = () => {
        if (!guestName.trim()) {
            alert('Please enter your name to join as a guest');
            return;
        }

        // Store the guest name in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('stream-guest-name', guestName.trim());
        }

        // Navigate to the session or continue with guest flow
        // You might want to redirect back to the session page here
        window.location.reload(); // This will trigger the VideoClientProvider to pick up the new name
    };

    if (isGuestMode || showGuestForm) {
        return (
            <div className='mx-auto w-fit space-y-3 my-24 flex flex-col'>
                <h1 className="text-center text-2xl font-bold">Join as Guest</h1>
                <div className="w-full max-w-md">
                    <label htmlFor="guest-name" className="block mb-2 font-medium text-center">
                        Enter Your Display Name
                    </label>
                    <input
                        id="guest-name"
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full p-3 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white"
                        placeholder="Your name"
                        required
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleGuestJoin();
                            }
                        }}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                        This name will be visible to other participants
                    </p>
                </div>
                <Button
                    onClick={handleGuestJoin}
                    className="w-full bg-[#FF0000] hover:bg-red-600"
                    disabled={!guestName.trim()}
                >
                    Join Session
                </Button>
                <Link
                    href="?"
                    className="text-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                    Back to login options
                </Link>
            </div>
        );
    }

    return (
        <div className='mx-auto w-fit space-y-3 my-24 flex flex-col'>
            <h1 className="text-center text-2xl font-bold">Join Session</h1>
            <ClerkLoaded>
                <SignInButton>
                    <Button className='w-44'>Sign In</Button>
                </SignInButton>
                <Button
                    onClick={() => setShowGuestForm(true)}
                    className="w-44 mt-4 bg-[#FF0000] hover:bg-red-600"
                >
                    Join As Guest
                </Button>
            </ClerkLoaded>
            <ClerkLoading>
                <Loader2 className='animate-spin mx-auto text-2xl' />
            </ClerkLoading>
        </div>
    )
}