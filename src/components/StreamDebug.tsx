"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function StreamDebug() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkStreamConnection = async () => {
      try {
        // Test environment variables
        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

        // Test server-side API
        const envResponse = await fetch("/api/test-env");
        const envData = await envResponse.json();

        const streamResponse = await fetch("/api/test-stream");
        const streamData = await streamResponse.json();

        setDebugInfo({
          sessionStatus: status,
          userEmail: session?.user?.email,
          apiKeyAvailable: !!apiKey,
          apiKeyLength: apiKey?.length,
          envTest: envData,
          streamTest: streamData,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        setDebugInfo({
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        });
      }
    };

    checkStreamConnection();
  }, [session, status]);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Stream Debug Info</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-64">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}
