"use server";

import { getServerSession } from "next-auth";
import { StreamClient } from "@stream-io/node-sdk";
import { sanitizeUserId } from "@/lib/utils";

export const streamTokenProvider = async () => {
  const session = await getServerSession();

  if (!session?.user?.email) throw new Error("User not authenticated");

  const streamClient = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!
  );

  const sanitizedUserId = sanitizeUserId(session.user.email);
  const token = streamClient.generateUserToken({ user_id: sanitizedUserId });

  return token;
};
