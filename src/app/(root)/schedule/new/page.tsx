"use client";

import { useSession } from "next-auth/react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../../../../convex/_generated/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon, ArrowLeft, LogIn } from "lucide-react";
import { TIME_SLOTS } from "@/constants";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserRole } from "@/hooks/useUserRole";
import LoaderUI from "@/components/LoaderUI";
import { signIn } from "next-auth/react";

function NewSchedulePage() {
  const client = useStreamVideoClient();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isInterviewer, isLoading: roleLoading } = useUserRole();
  const [isCreating, setIsCreating] = useState(false);
  const users = useQuery(api.users.getUsers) ?? [];

  const candidates = users?.filter((u) => u.role === "candidate");
  const interviewers = users?.filter((u) => u.role === "interviewer");
  const currentUserEmail = session?.user?.email;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    candidateId: "",
    interviewerIds: currentUserEmail ? [currentUserEmail] : [],
  });

  const createInterview = useMutation(api.interviews.createInterview);

  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  const removeInterviewer = (interviewerId: string) => {
    if (interviewerId === currentUserEmail) return;
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
    }));
  };

  const selectedInterviewers = interviewers.filter((i) =>
    formData.interviewerIds.includes(i.email)
  );

  const availableInterviewers = interviewers.filter(
    (i) => !formData.interviewerIds.includes(i.email)
  );

  // Redirect if not authenticated or not an interviewer
  useEffect(() => {
    if (status === "authenticated" && !roleLoading && !isInterviewer) {
      router.push("/");
    }
  }, [isInterviewer, roleLoading, router, status]);

  const scheduleMeeting = async () => {
    if (!client || !currentUserEmail) return;
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }

    setIsCreating(true);

    try {
      const { title, description, date, time, candidateId, interviewerIds } =
        formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId,
        interviewerIds,
      });

      toast.success("Meeting scheduled successfully!");
      router.push("/schedule");
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Show loading while checking authentication and role
  if (status === "loading" || roleLoading) {
    return <LoaderUI />;
  }

  // Show sign-in page if not authenticated
  if (status !== "authenticated") {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
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

  // Don't render if not an interviewer
  if (!isInterviewer) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-24 justify-start">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/schedule")}
          className="flex items-center gap-2 justify-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Interviews
        </Button>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">
            Schedule New Interview
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a new technical interview session
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Interview Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="Enter interview title"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
            />
          </div>

          {/* Interview Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter interview description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              rows={4}
            />
          </div>

          {/* Candidate Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Candidate</label>
            <Select
              value={formData.candidateId}
              onValueChange={(candidateId) =>
                setFormData({
                  ...formData,
                  candidateId,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select candidate" />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((candidate) => (
                  <SelectItem key={candidate.email} value={candidate.email}>
                    <UserInfo user={candidate} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interviewers Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Interviewers</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedInterviewers.map((interviewer) => (
                <div
                  key={interviewer.email}
                  className="inline-flex items-center gap-2 bg-secondary px-3 py-2 rounded-md text-sm"
                >
                  <UserInfo user={interviewer} />
                  {interviewer.email !== currentUserEmail && (
                    <button
                      onClick={() => removeInterviewer(interviewer.email)}
                      className="hover:text-destructive transition-colors"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {availableInterviewers.length > 0 && (
              <Select onValueChange={addInterviewer}>
                <SelectTrigger>
                  <SelectValue placeholder="Add interviewer" />
                </SelectTrigger>
                <SelectContent>
                  {availableInterviewers.map((interviewer) => (
                    <SelectItem
                      key={interviewer.email}
                      value={interviewer.email}
                    >
                      <UserInfo user={interviewer} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formData.date}
                  onChange={(newValue) =>
                    newValue && setFormData({ ...formData, date: newValue })
                  }
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      placeholder: "Select date",
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6px",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Select
                value={formData.time}
                onValueChange={(time) => setFormData({ ...formData, time })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => router.push("/schedule")}>
              Cancel
            </Button>
            <Button
              onClick={scheduleMeeting}
              disabled={isCreating}
              className="min-w-[140px]"
            >
              {isCreating ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Interview"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NewSchedulePage;
