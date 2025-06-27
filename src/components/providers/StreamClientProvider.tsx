"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
// import LoaderUI from "../LoaderUI";
import { streamTokenProvider } from "@/actions/stream.actions";
import { sanitizeUserId } from "@/lib/utils";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] =
    useState<StreamVideoClient>();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const sanitizedUserId = sanitizeUserId(session.user.email!);

    const client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user: {
        id: sanitizedUserId,
        name: session.user.name || session.user.email!,
        image: session.user.image,
      },
      tokenProvider: streamTokenProvider,
    });

    setStreamVideoClient(client);
  }, [session, status]);

  if (!streamVideoClient) {
    return <div>{children}</div>;
  }

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
