import Link from 'next/link'
import React from 'react'

interface SessionLeftPageProps{
    params: {id: string}
}

export default function page({params: {id}}: SessionLeftPageProps) {
  return (
    <div className='flex flex-col items-center gap-3'>
      <p className='text-bold'>You Have Left The Meeting</p>
      <Link href={`/online-sessions/${id}`} className='bg-gray-300 text-slate-950'>Rejoin Session</Link>
    </div>
  )
}
