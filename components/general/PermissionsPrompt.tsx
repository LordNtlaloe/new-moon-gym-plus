import { Mic, Webcam } from 'lucide-react'
import React from 'react'

export default function PermissionsPrompt() {
  return (
    <div className='flex flex-col items-center gap-3'>
      <div className="flex items-center gap-3">
        <Webcam size={40}/>
        <Mic size={40}/>
      </div>
      <div className="text-center">Please Allow Access To Your Microphone & Camera To Join The Session</div>
    </div>
  )
}
