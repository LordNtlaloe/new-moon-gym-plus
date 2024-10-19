import Banner from '@/components/main/Banner';
import { Metadata } from 'next';
import React from 'react'
import SessionPage from './SessionPage';

interface PageProps{
    params: {id: string}
}

export function generateMetadata({params: {id}}:PageProps ): Metadata{
    return{
        title: `Session: ${id}`
    }
}

export default function page({params: {id}}: PageProps) {
  return (
    <div className='my-40'>
        <SessionPage id={id}/>
    </div>
  )
}
