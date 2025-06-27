import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Doc } from "../../convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to sanitize email for Stream Video user ID
export const sanitizeUserId = (email: string): string => {
  return email
    .toLowerCase()
    .replace(/[^a-z0-9@._-]/g, "_") // Replace invalid chars with underscore
    .replace(/\./g, "_") // Replace dots with underscores
    .replace(/@/g, "_at_"); // Replace @ with _at_
};

type Interview = Doc<"interviews">;
type User = Doc<"users">;

export const groupInterviews = (interviews: Interview[]) => {
  const now = Date.now();

  return {
    upcoming: interviews.filter(
      (interview) =>
        interview.startTime > now && interview.status === "scheduled"
    ),
    live: interviews.filter(
      (interview) =>
        interview.startTime <= now &&
        interview.status === "scheduled" &&
        !interview.endTime
    ),
    completed: interviews.filter(
      (interview) => interview.status === "completed"
    ),
    succeeded: interviews.filter(
      (interview) => interview.status === "succeeded"
    ),
    failed: interviews.filter((interview) => interview.status === "failed"),
  };
};

export const getCandidateInfo = (users: User[], candidateId: string) => {
  const candidate = users?.find((user) => user.email === candidateId);
  return {
    name: candidate?.name || "Unknown Candidate",
    image: candidate?.image || "",
    initials:
      candidate?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "UC",
  };
};

export const getInterviewerInfo = (users: User[], interviewerId: string) => {
  const interviewer = users?.find((user) => user.email === interviewerId);
  return {
    name: interviewer?.name || "Unknown Interviewer",
    image: interviewer?.image,
    initials:
      interviewer?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "UI",
  };
};

export const calculateRecordingDuration = (
  startTime: string,
  endTime: string
) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();

  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
};

export const getMeetingStatus = (interview: Interview) => {
  const now = Date.now();
  const startTime = interview.startTime;
  const endTime = interview.endTime;

  if (interview.status === "completed") {
    return "completed";
  }

  if (startTime <= now && !endTime) {
    return "live";
  }

  if (startTime > now) {
    return "upcoming";
  }

  return "unknown";
};
