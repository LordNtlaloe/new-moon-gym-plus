"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetCalls = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCalls = async () => {
    if (!client || !user?.id) return;

    setIsLoading(true);

    try {
      const { calls } = await client.queryCalls({
        sort: [{ field: "starts_at", direction: -1 }],
        filter_conditions: {
          starts_at: { $exists: true },
          $or: [{ created_by_user_id: user.id }, { members: { $in: [user.id] } }],
        },
      });

      setCalls(calls);
    } catch (error) {
      console.error("Error fetching calls:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCalls();
  }, [client, user?.id]);

  const now = new Date();

  const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });

  const upcomingCalls = calls?.filter(({ state: { startsAt } }) => {
    return startsAt && new Date(startsAt) > now;
  });

  // Add delete functionality
  const deleteCall = async (callId: string, type: string) => {
    if (!client) return;

    try {
      // Find the call in our local state to get its type
      const callToDelete = calls.find(call => call.id === callId);
      
      if (!callToDelete) {
        throw new Error(`Call with ID ${callId} not found`);
      }
      
      // Get the call type
      const callType = callToDelete.type;
      
      // Get the call object with both type and ID
      const call = client.call(callType, callId);
      
      // Delete the call
      await call.delete();
      
      // Update the local state by removing the deleted call
      setCalls(prevCalls => prevCalls.filter(call => call.id !== callId));
      
      return true;
    } catch (error) {
      console.error("Error deleting call:", error);
      throw error;
    }
  };

  // Function to delete all calls (for a clear all feature)
  const deleteAllCalls = async (type: 'ended' | 'upcoming' | 'all') => {
    if (!client) return;

    try {
      let callsToDelete: Call[] = [];
      
      // Determine which calls to delete based on type
      if (type === 'ended') {
        callsToDelete = endedCalls;
      } else if (type === 'upcoming') {
        callsToDelete = upcomingCalls;
      } else {
        callsToDelete = calls;
      }

      // Delete each call
      await Promise.all(
        callsToDelete.map(async (call) => {
          try {
            const callObj = client.call(call.type, call.id);
            await callObj.delete();
          } catch (err) {
            console.error(`Failed to delete call ${call.id}:`, err);
          }
        })
      );

      // Refresh calls after deletion
      await loadCalls();
      
      return true;
    } catch (error) {
      console.error("Error deleting calls:", error);
      throw error;
    }
  };

  return { 
    endedCalls, 
    upcomingCalls, 
    callRecordings: calls, 
    isLoading,
    deleteCall,
    deleteAllCalls
  };
};