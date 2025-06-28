"use client";

import LoaderUI from "@/components/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { LogIn, Plus } from "lucide-react";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import MeetingCard from "@/components/MeetingCard";
import { Button } from "@/components/ui/button";
import { Doc } from "../../../../convex/_generated/dataModel";

function SchedulePage() {
  const router = useRouter();
  const { status } = useSession();
  const { isInterviewer, isLoading } = useUserRole();
  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];

  useEffect(() => {
    if (status === "authenticated" && !isLoading && !isInterviewer) {
      router.push("/");
    }
  }, [isInterviewer, isLoading, router, status]);

  if (status === "loading" || isLoading) return <LoaderUI />;

  if (status !== "authenticated") {
    return (
      <div className="min-h-screen">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold">Schedule Interviews</h1>
          <p className="text-muted-foreground text-center max-w-md">
            Sign in to access the interview scheduling feature and manage your
            technical assessments.
          </p>
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (!isInterviewer) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between px-10 py-5">
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage interviews
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => router.push("/schedule/new")}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Interview
        </Button>
      </div>

      {/* LOADING STATE & MEETING CARDS */}
      {!interviews ? (
        <div className="flex justify-center py-12">
          <LoaderUI />
        </div>
      ) : interviews.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview: Doc<"interviews">) => (
              <MeetingCard key={interview._id} interview={interview} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-lg mb-4 ">No interviews scheduled yet</p>
          <p className="mb-6">Get started by scheduling your first interview</p>
        </div>
      )}
    </div>
  );
}

export default SchedulePage;
