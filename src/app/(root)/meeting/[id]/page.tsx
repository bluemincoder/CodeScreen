"use client";

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import useGetCallById from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

function MeetingPage() {
  const { id } = useParams();
  const { isLoaded } = useUser();
  const { call, isCallLoading } = useGetCallById(id);

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  return (
    <>
      <SignedIn>
        {!isLoaded || isCallLoading ? (
          <LoaderUI />
        ) : !call ? (
          <div className="h-screen flex items-center justify-center">
            <p className="text-2xl font-semibold">Meeting not found</p>
          </div>
        ) : (
          <StreamCall call={call}>
            <StreamTheme>
              {!isSetupComplete ? (
                <MeetingSetup
                  onSetupComplete={() => setIsSetupComplete(true)}
                />
              ) : (
                <MeetingRoom />
              )}
            </StreamTheme>
          </StreamCall>
        )}
      </SignedIn>

      <SignedOut>
        <div className="h-screen flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold">Join Meeting</h1>
          <p className="text-muted-foreground text-center max-w-md">
            Sign in to join this interview session and participate in the
            technical assessment.
          </p>
          <SignInButton mode="modal">
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg">
              <LogIn className="w-4 h-4" />
              Sign In to Join Meeting
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
export default MeetingPage;
