"use client";

import LoaderUI from "@/components/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import InterviewScheduleUI from "./InterviewScheduleUI";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import { useEffect } from "react";

function SchedulePage() {
  const router = useRouter();
  const { isInterviewer, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading && !isInterviewer) router.push("/");
  }, [isInterviewer, isLoading, router]);

  if (isLoading) return <LoaderUI />;

  return (
    <>
      <SignedIn>{!isInterviewer ? null : <InterviewScheduleUI />}</SignedIn>

      <SignedOut>
        <div className="container max-w-7xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <h1 className="text-3xl font-bold">Schedule Interviews</h1>
            <p className="text-muted-foreground text-center max-w-md">
              Sign in to access the interview scheduling feature and manage your
              technical assessments.
            </p>
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg">
                <LogIn className="w-4 h-4" />
                Sign In to Continue
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
export default SchedulePage;
