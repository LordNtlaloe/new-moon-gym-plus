'use client'

import { useUser } from "@clerk/nextjs"
import { Call, MemberRequest, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { Copy, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserIds, getUserRoleByClerkId } from "@/app/_actions/users.actions";
import Button from "@/app/components/main/SessionButton";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function CreateSessionPage() {
    const [descriptionInput, setDescriptionInput] = useState("");
    const [startTimeInput, setStartTimeInput] = useState("");
    const [participantsInputs, setParticipantsInput] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoadingRole, setIsLoadingRole] = useState(true); // Add loading state
    const [call, setCall] = useState<Call>()
    const client = useStreamVideoClient();

    const { user } = useUser();

    useEffect(() => {
        const fetchUserRole = async () => {
            if (user?.id) {
                setIsLoadingRole(true);
                console.log('Fetching role for Clerk ID:', user.id); // Debug log

                try {
                    const result = await getUserRoleByClerkId(user.id);
                    console.log('Role result:', result); // Debug log

                    if (result.error) {
                        setError(result.error);
                    } else {
                        setUserRole(result?.role || null);
                        console.log('Set user role to:', result?.role); // Debug log
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setError('Failed to fetch user role');
                } finally {
                    setIsLoadingRole(false);
                }
            }
        };

        fetchUserRole();
    }, [user]);

    console.log(userRole)

    const isAdmin = userRole === "Admin";
    const isTrainer = userRole === "Trainer";

    // Show loading while fetching user role
    if (isLoadingRole) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin" />
                <span className="ml-2">Loading...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 font-bold">{error}</div>;
    }

    // Only show "Session has not started" after we've confirmed the user role
    if (!isAdmin && !isTrainer) {
        return (
            <div className="flex flex-col items-center text-center text-red-500 font-bold text-xl">
                <p>Session has not started.</p>
                <p className="text-sm mt-2">Only Admins and Trainers can create sessions.</p>
            </div>
        );
    }

    const createSession = async () => {
        if (!client || !user) {
            return;
        }
        try {
            const id = crypto.randomUUID();
            const callType = participantsInputs ? "private-session" : "default";
            const call = client.call(callType, id);

            const memberEmails = participantsInputs.split(",").map((email) => email.trim());

            const memberIds = await getUserIds(memberEmails);

            // Ensure memberIds is an array before calling map
            const members: MemberRequest[] = (Array.isArray(memberIds) ? memberIds : []).map((id: any) => ({
                user_id: id,
                role: "call_member",
            })).concat({ user_id: user.id, role: "call_member" })
                .filter((v: { user_id: any }, i: number, a: any[]) => a.findIndex((v2: { user_id: any }) => v2.user_id === v.user_id) === i);

            const starts_at = new Date(startTimeInput || Date.now()).toISOString();

            await call.getOrCreate({
                data: {
                    starts_at,
                    members,
                    custom: {
                        description: descriptionInput,
                    },
                },
            });
            setCall(call);
        } catch (error: any) {
            console.log(error);
            alert("Something went wrong. Please try again later.");
        }
    };

    if (!client || !user) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin" />
                <span className="ml-2">Loading client...</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center space-y-6">
            <h1 className="text-center text-2xl font-bold">Welcome: {user?.fullName}</h1>
            <div className="w-100 mx-auto space-y-6 rounded-md bg-slate-200 p-5">
                <h2 className="font-bold text-xl">Create/Start A New Session</h2>
                <DescriptionInput value={descriptionInput} onChange={setDescriptionInput} />
                <StartTimeInput value={startTimeInput} onChange={setStartTimeInput} />
                <ParticipantsInput value={participantsInputs} onChange={setParticipantsInput} />
                <Button onClick={createSession} className="w-full">Start Session</Button>
            </div>
            {call && (<SessonLink call={call} />)}
        </div>
    )
}

// ... rest of the component functions remain the same ....
interface DescriptionInputProps {
    value: string,
    onChange: (value: string) => void;
}

function DescriptionInput({ value, onChange }: DescriptionInputProps) {
    const [active, setActive] = useState(false);

    return (
        <div className="space-y-4">
            <Label className="text-lg font-semibold">Session Info:</Label>
            <div className="flex items-center gap-2">
                <Checkbox
                    checked={active}
                    onCheckedChange={(checked) => {
                        setActive(!!checked);
                        onChange(""); // Reset input when toggling
                    }}
                />
                <Label className="cursor-pointer">Add Session Details</Label>
            </div>

            {active && (
                <div className="space-y-2">
                    <Label className="text-lg font-semibold">Session Details</Label>
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        maxLength={500}
                        placeholder="Enter session details..."
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
}


interface StartTimeInputProps {
    value: string,
    onChange: (value: string) => void;
}


function StartTimeInput({ value, onChange }: StartTimeInputProps) {
    const [active, setActive] = useState(false);
    const dateTimeLocalNow = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60_000)
        .toISOString()
        .slice(0, 16);

    return (
        <div className="space-y-4">
            <Label className="text-lg font-semibold">Session Start Time:</Label>
            <RadioGroup
                className="space-y-2"
                defaultValue="immediate"
                onValueChange={(val) => {
                    setActive(val === "scheduled");
                    onChange(dateTimeLocalNow);
                }}
            >
                <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="immediate" checked={!active} />
                    Start Session Immediately
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="scheduled" checked={active} />
                    Set Time/Date For Session
                </Label>
            </RadioGroup>

            {active && (
                <div className="space-y-2">
                    <Label className="text-lg font-semibold">Start Time:</Label>
                    <Input
                        type="datetime-local"
                        value={value}
                        min={dateTimeLocalNow}
                        onChange={(e: any) => onChange(e.target.value)}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
}

interface ParticipantsInputPros {
    value: string;
    onChange: (value: string) => void;
}

function ParticipantsInput({ value, onChange }: ParticipantsInputPros) {
    const [active, setActive] = useState(false);

    return (
        <div className="space-y-4">
            <Label className="text-lg font-semibold">Participants:</Label>
            <RadioGroup
                className="space-y-2"
                defaultValue="public"
                onValueChange={(val) => {
                    setActive(val === "private");
                    onChange("");
                }}
            >
                <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="public" checked={!active} />
                    Everyone With Link Can Join
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="private" checked={active} />
                    Private Session
                </Label>
            </RadioGroup>

            {active && (
                <div className="space-y-2">
                    <Label className="text-lg font-semibold">Participants (Emails)</Label>
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Enter participants' emails, separated by commas"
                        maxLength={500}
                        className="w-full"
                    />
                </div>
            )}
        </div>
    );
}

interface SessionLinkProps {
    call: Call,
}

function SessonLink({ call }: SessionLinkProps) {
    const sessionLink = `${process.env.NEXT_PUBLIC_BASE_URL}/online-sessions/${call.id}`;

    return (
        <div className="text-center font-medium text-[#FF0000] flex flex-col ite gap-3">
            <div className="flex ite gap-3">
                <span>
                    Session Link: {""}
                    <Link href={sessionLink} target="_blank" className="font-medium">{sessionLink}</Link>
                </span>
                <button title="Copy Session Link" onClick={() => {
                    navigator.clipboard.writeText(sessionLink)
                    alert("Link Copied")
                }}>
                    <Copy />
                </button>
            </div>
            <a href={getMailToLink(sessionLink, call.state.startsAt, call.state.custom.description)}
                className="text-[rgb(255,0,0)] hover:underline" target="_blank">
                Send Message To Participants
            </a>
        </div>
    )
}

function getMailToLink(SessonLink: string, startsAt?: Date, description?: string,) {
    const startDateFormatted = startsAt ? startsAt.toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
    }) : undefined

    const subject = "Your Online Session Starts At " + (startDateFormatted ? `${startDateFormatted}` : "");

    const body = `Session Link: ${SessonLink}.` + (startDateFormatted ? `\n\n Session Starts At: ${startDateFormatted}` : "")
        + (description ? `\n\n Session Details ${description}` : "");

    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}}`
}