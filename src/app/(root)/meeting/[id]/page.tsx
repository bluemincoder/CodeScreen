"use client";

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import useGetCallById from "@/hooks/useGetCallById";
import { useSession } from "next-auth/react";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState } from "react";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";

function MeetingPage() {
  const { id } = useParams();
  const { status } = useSession();
  const { call, isCallLoading } = useGetCallById(id);

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (status === "loading") {
    return <LoaderUI />;
  }

  if (status !== "authenticated") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            Sign in to join meeting
          </h1>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to join this meeting.
          </p>
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all duration-200 font-medium shadow-lg mx-auto"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (isCallLoading) {
    return <LoaderUI />;
  }

  if (!call) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Meeting not found</p>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
        ) : (
          <MeetingRoom />
        )}
      </StreamTheme>
    </StreamCall>
  );
}

export default MeetingPage;
