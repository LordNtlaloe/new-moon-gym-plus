import { Button } from '@/components/ui/button'
import { ClerkLoaded, ClerkLoading, SignInButton } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function SessionLoginPage() {
    return (
        <div className='mx-auto w-fit space-y-3 my-24 flex flex-row'>
            <h1 className="text-center text-2xl font-bold">Join Session</h1>
            <ClerkLoaded>
                <SignInButton>
                    <Button className='w-44'>Sign In</Button>
                </SignInButton>
                <Link href="?guest=true" className='w-44 bg-gray-500'>Join As Guest</Link>
            </ClerkLoaded>
            <ClerkLoading>
                <Loader2 className='animate-spin mx-auto text-2xl'/>
            </ClerkLoading>
        </div>
    )
}