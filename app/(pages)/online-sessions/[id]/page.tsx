import { Metadata } from 'next';
import React from 'react'
import SessionPage from './SessionPage';
import { currentUser } from '@clerk/nextjs/server';
import SessionLoginPage from './SessionLoginPage';

interface PageProps {
  params: { id: string };
  searchParams: {guest: string}
}

export function generateMetadata({ params: { id } }: PageProps): Metadata {
  return {
    title: `Session: ${id}`
  }
}

export default async function page({ params: { id }, searchParams: {guest}}: PageProps) {
  const user = await currentUser();
  const guestMode = guest === "true";
  if(!user && !guestMode){
    return(
      <div className="my-20 py-20">
        <SessionLoginPage />
      </div>
      
    )
  }
  return (
    <div className='my-40 py-20'>
      <SessionPage id={id} />
    </div>
  )
}
