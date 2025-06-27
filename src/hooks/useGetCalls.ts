import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { sanitizeUserId } from "@/lib/utils";

const useGetCalls = () => {
  const { data: session } = useSession();
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !session?.user?.email) return;

      setIsLoading(true);

      try {
        const sanitizedUserId = sanitizeUserId(session.user.email);
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: sanitizedUserId },
              { members: { $in: [sanitizedUserId] } },
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, session?.user?.email]);

  const now = new Date();

  const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });

  const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now;
  });

  const liveCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return startsAt && new Date(startsAt) < now && !endedAt;
  });

  return { calls, endedCalls, upcomingCalls, liveCalls, isLoading };
};

export default useGetCalls;
