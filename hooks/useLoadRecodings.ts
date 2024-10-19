import { useUser } from "@clerk/nextjs";
import { CallRecording } from "@stream-io/node-sdk";
import { Call } from "@stream-io/video-react-sdk";
import { useState } from "react";

export default function useLoadRecordings(call: Call){
    const {user} = useUser();
    const [recordings, setRecordings] = useState<CallRecording[]>([])
}