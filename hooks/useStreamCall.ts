import { useCall } from "@stream-io/video-react-sdk";

export default function useStreamCall(){
    const call = useCall();

    if(!call){
        throw new Error("useStream Must Be Used Within A Stream Call Component With A Valid Call Prop")
    }

    return call;
}