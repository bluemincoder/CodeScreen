import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  LayoutListIcon,
  LoaderIcon,
  UsersIcon,
  AlertCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";
import CollaborativeCodeEditor from "./CollaborativeCodeEditor";

function MeetingRoom() {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  // Check if Stream API is configured - memoized to prevent re-renders
  const isStreamConfigured = useMemo(() => {
    return !!process.env.NEXT_PUBLIC_STREAM_API_KEY;
  }, []);

  // Handle connection errors with debouncing
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      setConnectionError("You have left the video call");
    } else if (callingState === CallingState.JOINED) {
      setConnectionError(null);
    }
  }, [callingState]);

  const getConnectionStatusMessage = () => {
    switch (callingState) {
      case CallingState.JOINING:
        return "Joining video call...";
      case CallingState.RINGING:
        return "Call is ringing...";
      case CallingState.LEFT:
        return "You left the call";
      case CallingState.UNKNOWN:
        return "Connecting to video call...";
      default:
        return "Connecting to video call...";
    }
  };

  const handleReconnect = () => {
    setConnectionError(null);
    // Don't reload the page, just reset the error state
    // The Stream client should handle reconnection automatically
  };

  return (
    <div className="h-[calc(100vh-4rem-1px)]">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={25}
          maxSize={100}
          className="relative"
        >
          {/* VIDEO LAYOUT */}
          {!isStreamConfigured ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 p-6">
                <AlertCircleIcon className="size-8 text-yellow-500 mx-auto" />
                <h3 className="text-lg font-semibold">
                  Video Call Not Configured
                </h3>
                <p className="text-muted-foreground text-sm">
                  Stream API keys are not configured. Video calls are disabled.
                </p>
                <p className="text-xs text-muted-foreground">
                  Add NEXT_PUBLIC_STREAM_API_KEY to your environment variables.
                </p>
              </div>
            </div>
          ) : callingState === CallingState.JOINED ? (
            <div className="absolute inset-0">
              {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

              {/* PARTICIPANTS LIST OVERLAY */}
              {showParticipants && (
                <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <CallParticipantsList
                    onClose={() => setShowParticipants(false)}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                {connectionError ? (
                  <>
                    <AlertCircleIcon className="size-8 text-red-500 mx-auto" />
                    <p className="text-red-600 font-medium">
                      {connectionError}
                    </p>
                    <Button onClick={handleReconnect} variant="outline">
                      Reconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <LoaderIcon className="size-8 animate-spin mx-auto" />
                    <p className="text-muted-foreground">
                      {getConnectionStatusMessage()}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* VIDEO CONTROLS */}
          {isStreamConfigured && callingState === CallingState.JOINED && (
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                  <CallControls onLeave={() => router.push("/")} />

                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-10"
                        >
                          <LayoutListIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setLayout("grid")}>
                          Grid View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLayout("speaker")}>
                          Speaker View
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10"
                      onClick={() => setShowParticipants(!showParticipants)}
                    >
                      <UsersIcon className="size-4" />
                    </Button>

                    <EndCallButton />
                  </div>
                </div>
              </div>
            </div>
          )}
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={75} minSize={25}>
          <CollaborativeCodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
export default MeetingRoom;
