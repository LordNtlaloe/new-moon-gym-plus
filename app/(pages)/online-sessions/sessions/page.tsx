import { Metadata } from 'next'
import React from 'react'
import TrainerSessions from './TrainerSessions'

export const metadata: Metadata = {
    title: "Your Sessions"
}

export default function page() {
  return (
    <div className='py-20 my-20'>
        <TrainerSessions />
    </div>
  )
}
