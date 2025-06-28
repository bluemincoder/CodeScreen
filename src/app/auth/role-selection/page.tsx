"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCheck, Users, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function RoleSelectionPage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const updateUserRole = useMutation(api.users.updateUserRole);
  const [selectedRole, setSelectedRole] = useState<
    "candidate" | "interviewer" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  // If user already has a role, redirect to home
  useEffect(() => {
    if (status === "loading") return;

    if (session?.user && (session.user as any).role) {
      router.push("/");
    }
  }, [session, status, router]);

  const handleRoleSelection = async (role: "candidate" | "interviewer") => {
    if (!session?.user?.email) {
      toast.error("User session not found");
      return;
    }

    setIsLoading(true);
    try {
      await updateUserRole({
        email: session.user.email,
        role,
      });

      // Update the session with the new role
      await update({
        ...session,
        user: {
          ...session.user,
          role,
        },
      });

      toast.success(`Role set to ${role}`);
      router.push("/");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking session
  if (status === "loading" || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If user already has a role, show loading while redirecting
  if ((session.user as any).role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to CodeScreen!
          </CardTitle>
          <CardDescription>
            Please select your role to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Button
              variant={selectedRole === "interviewer" ? "default" : "outline"}
              className="h-auto p-6 flex flex-col items-center gap-3"
              onClick={() => setSelectedRole("interviewer")}
              disabled={isLoading}
            >
              <UserCheck className="h-8 w-8" />
              <div className="text-left">
                <div className="font-semibold">Interviewer</div>
                <div className="text-sm ">
                  Conduct technical interviews and assess candidates
                </div>
              </div>
            </Button>

            <Button
              variant={selectedRole === "candidate" ? "default" : "outline"}
              className="h-auto p-6 flex flex-col items-center gap-3"
              onClick={() => setSelectedRole("candidate")}
              disabled={isLoading}
            >
              <Users className="h-8 w-8" />
              <div className="text-left">
                <div className="font-semibold">Candidate</div>
                <div className="text-sm ">
                  Participate in technical interviews and assessments
                </div>
              </div>
            </Button>
          </div>

          {selectedRole && (
            <Button
              className="w-full"
              onClick={() => handleRoleSelection(selectedRole)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
