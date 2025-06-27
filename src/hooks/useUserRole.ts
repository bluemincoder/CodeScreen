import { useSession } from "next-auth/react";

export const useUserRole = () => {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isInterviewer = session?.user?.role === "interviewer";
  const isCandidate = session?.user?.role === "candidate";

  return {
    isLoading,
    isInterviewer,
    isCandidate,
    role: session?.user?.role,
  };
};
