"use client";

import { useEffect, useState } from "react";
import { useGetCalls } from "@/hooks/useGetCalls";
import MeetingTypeList from "@/components/MeetingTypeList";

const Home = () => {
  const now = new Date();
  const { upcomingCalls, isLoading } = useGetCalls();
  const [nextMeetingTime, setNextMeetingTime] = useState<string>("No Upcoming Meeting");

  useEffect(() => {
    if (upcomingCalls && upcomingCalls.length > 0) {
      const nextMeeting = upcomingCalls[0];
      const meetingTime = nextMeeting?.state?.startsAt
        ? new Date(nextMeeting.state.startsAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "No Upcoming Meeting";

      setNextMeetingTime(meetingTime);
    }
  }, [upcomingCalls]);

  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(now);

  return (
    <section className="flex size-full flex-col gap-5 text-white">
      <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal">
            {isLoading ? "Loading..." : `Upcoming Meeting at: ${nextMeetingTime}`}
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;
