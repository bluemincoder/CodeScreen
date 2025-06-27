"use client";

import { useState } from "react";
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
  const { data: session, update } = useSession();
  const router = useRouter();
  const updateUserRole = useMutation(api.users.updateUserRole);
  const [selectedRole, setSelectedRole] = useState<
    "candidate" | "interviewer" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

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

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
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
                <div className="text-sm text-muted-foreground">
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
                <div className="text-sm text-muted-foreground">
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
