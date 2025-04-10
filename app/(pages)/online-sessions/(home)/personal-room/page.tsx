"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

import { useGetCallById } from "@/hooks/useGetCallById";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};

const PersonalRoom = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();

  const sessionId = user?.id;

  const { call } = useGetCallById(sessionId!);

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", sessionId!);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/online-sessions/${sessionId}?personal=true`);
  };

  const sessionLink = `${process.env.NEXT_PUBLIC_BASE_URL}/online-sessions/${sessionId}?personal=true`;

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-xl font-bold lg:text-3xl">Personal Session Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.fullName || user?.id}'s Session Room`} />
        <Table title="Session ID" description={sessionId!} />
        <Table title="Invite Link" description={sessionLink} />
      </div>
      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Session
        </Button>
        <Button
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(sessionLink);
            toast({
              title: "Link Copied",
            });
          }}
        >
          Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
