"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeCard from "./HomeCard";
import SessionModal from "./SessionModal";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import Loader from "./Loader";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { getUserRoleByClerkId } from "@/app/_actions/users.actions";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

const SessionTypeList = () => {
  const router = useRouter();
  const [SessionState, setSessionState] = useState<
    "isScheduleSession" | "isJoiningSession" | "isInstantSession" | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const [userRole, setUserRole] = useState<string>("");
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const [roleError, setRoleError] = useState<string | null>(null);
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.id) {
        setIsLoadingRole(true);
        console.log('Fetching role for Clerk ID:', user.id); // Debug log

        try {
          const result = await getUserRoleByClerkId(user.id);
          console.log('Role result:', result); // Debug log

          if (result.error) {
            setRoleError(result.error);
            console.error('Error fetching user role:', result.error);
          } else {
            setUserRole(result?.role || "");
            console.log('Set user role to:', result?.role); // Debug log
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setRoleError('Failed to fetch user role');
        } finally {
          setIsLoadingRole(false);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  const createSession = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create Session");
      const startsAt = values.dateTime.toISOString();
      const description = values.description || "Instant Session";
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: { description },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/online-sessions/${call.id}`);
      }
      toast({ title: "Session Created" });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to create Session" });
    }
  };

  // Show loading while fetching user role or client is not ready
  if (!client || !user || isLoadingRole) return <Loader />;

  // Show error if role fetching failed
  if (roleError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center text-red-500">
          <p>Error loading user permissions: {roleError}</p>
        </div>
      </div>
    );
  }

  const allowedActions = userRole === "Admin" || userRole === "Trainer";

  return (
    <div className="h-screen">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {allowedActions && (
          <>
            <HomeCard
              img="/icons/add-session.svg"
              title="New Session"
              description="Start an instant Session"
              handleClick={() => setSessionState("isInstantSession")}
            />
            <HomeCard
              img="/icons/schedule.svg"
              title="Schedule Session"
              description="Plan your Session"
              className="bg-purple-1"
              handleClick={() => setSessionState("isScheduleSession")}
            />
          </>
        )}
        <HomeCard
          img="/icons/join-session.svg"
          title="Join Session"
          description="via invitation link"
          className="bg-blue-1"
          handleClick={() => setSessionState("isJoiningSession")}
        />
        <HomeCard
          img="/icons/recordings.svg"
          title="View Recordings"
          description="Session Recordings"
          className="bg-yellow-1"
          handleClick={() => router.push("/online-sessions/recordings")}
        />

        {SessionState === "isScheduleSession" && allowedActions && (
          <SessionModal
            isOpen
            onClose={() => setSessionState(undefined)}
            title="Create Session"
            handleClick={createSession}
          >
            <div className="flex flex-col gap-2.5">
              <label className="text-base font-normal text-sky-2">
                Add a description
              </label>
              <Textarea
                className="border-none bg-dark-3"
                onChange={(e) =>
                  setValues({ ...values, description: e.target.value })
                }
              />
            </div>
            <div className="flex w-full flex-col gap-2.5">
              <label className="text-base font-normal text-sky-2">
                Select Date and Time
              </label>
              <ReactDatePicker
                selected={values.dateTime}
                onChange={(date) => setValues({ ...values, dateTime: date! })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              />
            </div>
          </SessionModal>
        )}

        <SessionModal
          isOpen={SessionState === "isJoiningSession"}
          onClose={() => setSessionState(undefined)}
          title="Type the link here"
          buttonText="Join Session"
          handleClick={() => router.push(values.link)}
        >
          <Input
            placeholder="Session link"
            onChange={(e) => setValues({ ...values, link: e.target.value })}
            className="border-none bg-dark-3"
          />
        </SessionModal>

        {allowedActions && (
          <SessionModal
            isOpen={SessionState === "isInstantSession"}
            onClose={() => setSessionState(undefined)}
            title="Start an Instant Session"
            buttonText="Start Session"
            handleClick={createSession}
          />
        )}
      </div>
    </div>
  );
};

export default SessionTypeList;