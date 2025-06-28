"use client";

import LoaderUI from "@/components/LoaderUI";
import RecordingCard from "@/components/RecordingCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetCalls from "@/hooks/useGetCalls";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

function RecordingsPage() {
  const { status } = useSession();
  const { calls, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!calls) return;

      try {
        // Get recordings for each call
        const callData = await Promise.all(
          calls.map((call) => call.queryRecordings())
        );
        const allRecordings = callData.flatMap((call) => call.recordings);

        setRecordings(allRecordings);
      } catch (error) {
        console.log("Error fetching recordings:", error);
      }
    };

    fetchRecordings();
  }, [calls]);

  if (status === "loading" || isLoading) {
    return <LoaderUI />;
  }

  if (status !== "authenticated") {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <h1 className="text-3xl font-bold">Recordings</h1>
          <p className="text-muted-foreground text-center max-w-md">
            Sign in to access your interview recordings and review past
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

  return (
    <div className="p-6">
      {/* HEADER SECTION */}
      <h1 className="text-3xl font-bold">Recordings</h1>
      <p className="text-muted-foreground my-1">
        {recordings.length}{" "}
        {recordings.length === 1 ? "recording" : "recordings"} available
      </p>

      {/* RECORDINGS GRID */}
      <ScrollArea className="h-[calc(100vh-300px)] mt-3">
        {recordings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            {recordings.map((r) => (
              <RecordingCard key={r.end_time} recording={r} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <p className="text-xl font-medium text-muted-foreground">
              No recordings available
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default RecordingsPage;
