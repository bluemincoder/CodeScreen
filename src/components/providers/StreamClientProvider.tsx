"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
// import LoaderUI from "../LoaderUI";
import { streamTokenProvider } from "@/actions/stream.actions";
import { sanitizeUserId } from "@/lib/utils";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] =
    useState<StreamVideoClient>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const clientRef = useRef<StreamVideoClient | null>(null);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializingRef.current) return;

    if (status !== "authenticated" || !session?.user) {
      setIsLoading(false);
      return;
    }

    const initializeClient = async () => {
      // Prevent multiple simultaneous initializations
      if (isInitializingRef.current || clientRef.current) return;

      try {
        isInitializingRef.current = true;
        setIsLoading(true);
        setError(null);

        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
        if (!apiKey) {
          setError("Stream API key not configured");
          setIsLoading(false);
          return;
        }

        const sanitizedUserId = sanitizeUserId(
          session?.user?.email || "unknown"
        );

        // Create client with minimal configuration
        const client = new StreamVideoClient({
          apiKey,
          user: {
            id: sanitizedUserId,
            name: session?.user?.name || session?.user?.email || "Unknown",
          },
          tokenProvider: streamTokenProvider,
        });

        try {
          await client.connectUser({
            id: sanitizedUserId,
            name: session?.user?.name || session?.user?.email || "Unknown",
          });

          clientRef.current = client;
          setStreamVideoClient(client);
        } catch (error) {
          console.error("Stream connection error:", error);
          setError(
            error instanceof Error ? error.message : "Connection failed"
          );
        }
      } catch (error) {
        console.error("Stream initialization error:", error);
        setError("Failed to initialize Stream client");
      } finally {
        setIsLoading(false);
        isInitializingRef.current = false;
      }
    };

    initializeClient();

    return () => {
      // Cleanup function
      if (clientRef.current) {
        try {
          clientRef.current.disconnectUser();
        } catch (error) {
          console.error("Error disconnecting user:", error);
        }
        clientRef.current = null;
      }
    };
  }, [session?.user, status]); // Added session?.user to dependencies

  // Handle session changes
  useEffect(() => {
    if (status === "unauthenticated" && clientRef.current) {
      try {
        clientRef.current.disconnectUser();
      } catch (error) {
        console.error("Error disconnecting user:", error);
      }
      clientRef.current = null;
      setStreamVideoClient(undefined);
      setError(null);
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <div className="text-red-500 text-lg font-semibold">
            Video Call Error
          </div>
          <p className="text-muted-foreground text-sm">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              if (clientRef.current) {
                try {
                  clientRef.current.disconnectUser();
                } catch (error) {
                  console.error("Error disconnecting user:", error);
                }
                clientRef.current = null;
              }
              setStreamVideoClient(undefined);
              isInitializingRef.current = false;
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!streamVideoClient) {
    return <div>{children}</div>;
  }

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
