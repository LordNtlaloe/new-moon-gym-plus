'use client'

import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function CreateSessionPage(){
    const [descriptionInput, setDescriptionInput] = useState("");
    const [startTimeInput, setStartTimeInput] = useState("");
    const [participantsInputs, setParticipantsInput] = useState("");
    const [call, setCall] = useState<Call>()
    const client = useStreamVideoClient(); 
    const {user} = useUser();

    const createSession = async () => {
        if(!client || !user){
            return;
        }
        try{
            const id = crypto.randomUUID();

            const call = client.call("default", id);

            await call.getOrCreate({
                data: {
                    custom: {
                        description: descriptionInput
                    }
                }
            });
            setCall(call);
        }
        catch(error: any){
            console.log(error)
            alert("Something Went Wrong. Please Try Again Later")
        }
    }

    if(!client || !user){
        return(
            <Loader2 className="mx-auto animate-spin"/>
        )
    }
    return(
        <div className="flex flex-col items-center space-y-6">
            <h1 className="text-center text-2xl font-bold">Welcome: {user?.fullName}</h1>
            <div className="w-80 mx-auto space-y-6 rounded-md bg-slate-100 p-5">
                <h2 className="font-bold text-xl">Create/Start A New Session</h2>
                <DescriptionInput value={descriptionInput} onChange={setDescriptionInput}/>
                <StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
                <ParticipantsInput value={participantsInputs} onChange={setParticipantsInput}/>
                <button className="btn btn-sm bg-[#FF0000] text-white p-2 w-full" onClick={createSession}>Start Session</button>
            </div>
            {call && (<SessonLink call={call} />)}
        </div>
    )
}

interface DescriptionInputProps{
    value: string,
    onChange: (value: string) => void;
}

function DescriptionInput ({value, onChange}: DescriptionInputProps){
    const [active, setActive] = useState(false)

    return(
        <div className="space-y-2">
            <div className="font-medium">Session Info:</div>
            <label htmlFor="" className="flex items-center gap-1.5">
            <input type="checkbox" checked={active} onChange={(e) => {
                setActive(e.target.checked) 
                onChange("")
                }}
                className=""/>
            Add Session Details
            </label>
            {active && (
                <label htmlFor="" className="block space-y-1">
                    <span className="font-medium">Session Details</span>
                    <textarea name="" id="" value={value} onChange={(e) => onChange(e.target.value)}
                    maxLength={500} className="w-full rounded-md border-gray-100 p-2"></textarea>
                </label>
            )}
            
        </div>
    )
}

interface StartTimeInputProps{
    value: string,
    onChange: (value: string) => void;
}

function StartTimeInput({value, onChange}: StartTimeInputProps){
    const [active, setActive] = useState(false);
    const dateTimeLocalNow = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
    return(
        <div className="space-y-2">
            <div className="font-medium">Session Start Time:</div>
            <label className="flex items-center gap-1.5">
                <input type="radio" checked={!active} onChange={() => {setActive(false); onChange(dateTimeLocalNow);}}/>
                Start Session Immediately
            </label>
            <label className="flex items-center gap-1.5">
                <input type="radio" checked={active} onChange={() => {setActive(true); onChange(dateTimeLocalNow)}}/>
                Set Time/Date For Session
            </label>
            {active && (
                <label className="block space-y-1">
                    <span className="font-medium">Start Time:</span>
                    <input type="datetime-local" value={value} min={dateTimeLocalNow} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border-gray-100 p-2"/>
                </label>
            )}
        </div>
    )
}

interface ParticipantsInputPros{
    value: string;
    onChange: (value: string) => void;
}

function ParticipantsInput({value, onChange}: ParticipantsInputPros){
    const[active, setActive] = useState(false);
    
    return(
        <div className="space-y-2">
            <div className="font-medium">Participants:</div>
            <label className="flex items-center gap-1.5">
                <input type="radio" checked={!active} onChange={() => { setActive(false); onChange("")}} />
                Everyone With Link Can Join
            </label>
            <label className="flex items-center gap-1.5">
                <input type="radio" checked={active} onChange={() => { setActive(true); onChange("")}} />
                Private Session
            </label>
            {active && (
                <label className="block space-y-1">
                    <span className="font-medium">Particpants</span>
                    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder="Participants Here"
                        maxLength={500} className="w-full rounded-md border-gray-100 p-2"></textarea>
                </label>
            )}
        </div>
    )
}

interface SessionLinkProps{
    call: Call,
}

function SessonLink({call}: SessionLinkProps){
    const sessionLink = `${process.env.NEXT_PUBLIC_BASE_URL}/online-sessions/${call.id}`;

    return(
        <div className="text-center font-medium text-[#FF0000]">
            {sessionLink}
        </div>
    )
}