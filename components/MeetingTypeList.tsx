/* eslint-disable camelcase */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import HomeCard from './HomeCard';
import SessionModal from './SessionModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from './Loader';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { useToast } from './ui/use-toast';
import { Input } from './ui/input';

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

const SessionTypeList = () => {
  const router = useRouter();
  const [SessionState, setSessionState] = useState<
    'isScheduleSession' | 'isJoiningSession' | 'isInstantSession' | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  const createSession = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create Session');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Session';
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);
      if (!values.description) {
        router.push(`/online-sessions/${call.id}`);
      }
      toast({
        title: 'Session Created',
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create Session' });
    }
  };

  if (!client || !user) return <Loader />;

  const SessionLink = `${process.env.NEXT_PUBLIC_BASE_URL}/online-sessions/${callDetail?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-session.svg"
        title="New "
        description="Start an instant Session"
        handleClick={() => setSessionState('isInstantSession')}
      />
      <HomeCard
        img="/icons/join-session.svg"
        title="Join Session"
        description="via invitation link"
        className="bg-blue-1"
        handleClick={() => setSessionState('isJoiningSession')}
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Session"
        description="Plan your Session"
        className="bg-purple-1"
        handleClick={() => setSessionState('isScheduleSession')}
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Session Recordings"
        className="bg-yellow-1"
        handleClick={() => router.push('/online-sessions/recordings')}
      />

      {!callDetail ? (
        <SessionModal
          isOpen={SessionState === 'isScheduleSession'}
          onClose={() => setSessionState(undefined)}
          title="Create Session"
          handleClick={createSession}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            />
          </div>
        </SessionModal>
      ) : (
        <SessionModal
          isOpen={SessionState === 'isScheduleSession'}
          onClose={() => setSessionState(undefined)}
          title="Session Created"
          handleClick={() => {
            navigator.clipboard.writeText(SessionLink);
            toast({ title: 'Link Copied' });
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Session Link"
        />
      )}

      <SessionModal
        isOpen={SessionState === 'isJoiningSession'}
        onClose={() => setSessionState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Session"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Session link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </SessionModal>

      <SessionModal
        isOpen={SessionState === 'isInstantSession'}
        onClose={() => setSessionState(undefined)}
        title="Start an Instant Session"
        className="text-center"
        buttonText="Start Session"
        handleClick={createSession}
      />
    </section>
  );
};

export default SessionTypeList;
