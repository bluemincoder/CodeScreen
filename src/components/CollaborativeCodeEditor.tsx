"use client";

import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  AlertCircleIcon,
  BookIcon,
  LightbulbIcon,
  UsersIcon,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Client {
  socketId: string;
  username: string;
}

interface RoomData {
  code: string;
  language: string;
  questionId: string;
  clients: Client[];
}

function CollaborativeCodeEditor() {
  const { id: meetingId } = useParams();
  const { data: session } = useSession();
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<
    "javascript" | "python" | "java" | "cpp"
  >(LANGUAGES[0].id);
  const [code, setCode] = useState(selectedQuestion.starterCode[language]);

  useEffect(() => {
    if (!meetingId || !session?.user?.name) return;

    const initSocket = async () => {
      try {
        const { default: io } = await import("socket.io-client");

        // Use environment variable for server URL, fallback to localhost for development
        const serverUrl =
          process.env.NEXT_PUBLIC_COLLABORATIVE_SERVER_URL ||
          "http://localhost:5001";
        socketRef.current = io(serverUrl, {
          transports: ["websocket", "polling"],
        });

        socketRef.current.on("connect", () => {
          console.log("Connected to collaborative server");
          setIsConnected(true);
          socketRef.current?.emit("join-room", {
            roomId: meetingId,
            username: session.user?.name || "Anonymous",
          });
        });

        socketRef.current.on("disconnect", () => {
          console.log("Disconnected from collaborative server");
          setIsConnected(false);
        });

        socketRef.current.on("room-data", (data: RoomData) => {
          console.log("Received room data:", data);
          setCode(data.code);
          setLanguage(data.language as any);
          const question = CODING_QUESTIONS.find(
            (q) => q.id === data.questionId
          );
          if (question) {
            setSelectedQuestion(question);
          }
          setClients(data.clients);
        });

        socketRef.current.on("user-joined", (data: { clients: Client[] }) => {
          console.log("User joined:", data);
          setClients(data.clients);
        });

        socketRef.current.on("user-left", (data: { clients: Client[] }) => {
          console.log("User left:", data);
          setClients(data.clients);
        });

        socketRef.current.on("code-updated", (data: { code: string }) => {
          console.log("Code updated:", data);
          setCode(data.code);
        });

        socketRef.current.on(
          "language-updated",
          (data: { language: string }) => {
            console.log("Language updated:", data);
            setLanguage(data.language as any);
            const newLanguage = data.language as
              | "javascript"
              | "python"
              | "java"
              | "cpp";
            setCode(selectedQuestion.starterCode[newLanguage]);
          }
        );

        socketRef.current.on(
          "question-updated",
          (data: { questionId: string }) => {
            console.log("Question updated:", data);
            const question = CODING_QUESTIONS.find(
              (q) => q.id === data.questionId
            );
            if (question) {
              setSelectedQuestion(question);
              setCode(question.starterCode[language]);
            }
          }
        );

        socketRef.current.on("connect_error", (error: any) => {
          console.error("Socket connection error:", error);
          setIsConnected(false);
        });
      } catch (error) {
        console.error("Error initializing socket:", error);
        setIsConnected(false);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        try {
          socketRef.current.disconnect();
        } catch (error) {
          console.error("Error disconnecting socket:", error);
        }
        socketRef.current = null;
      }
    };
  }, [meetingId, session?.user?.name, language, selectedQuestion.starterCode]);

  const handleQuestionChange = useCallback(
    (questionId: string) => {
      const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
      setSelectedQuestion(question);
      setCode(question.starterCode[language]);
      socketRef.current?.emit("question-change", {
        roomId: meetingId,
        questionId,
      });
    },
    [language, meetingId]
  );

  const handleLanguageChange = useCallback(
    (newLanguage: "javascript" | "python" | "java" | "cpp") => {
      setLanguage(newLanguage);
      setCode(selectedQuestion.starterCode[newLanguage]);
      socketRef.current?.emit("language-change", {
        roomId: meetingId,
        language: newLanguage,
      });
    },
    [selectedQuestion.starterCode, meetingId]
  );

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const newCode = value || "";
      setCode(newCode);
      socketRef.current?.emit("code-change", {
        roomId: meetingId,
        code: newCode,
      });
    },
    [meetingId]
  );

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="min-h-[calc(100vh-4rem-1px)]"
    >
      <ResizablePanel>
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {selectedQuestion.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <Badge variant={isConnected ? "default" : "destructive"}>
                        {isConnected ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose your language and solve the problem
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowParticipants(!showParticipants)}
                    className="flex items-center gap-2"
                  >
                    <UsersIcon className="h-4 w-4" />
                    <span>{clients.length}</span>
                  </Button>

                  <Select
                    value={selectedQuestion.id}
                    onValueChange={handleQuestionChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select question" />
                    </SelectTrigger>
                    <SelectContent>
                      {CODING_QUESTIONS.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <Image
                            src={`/${language}.png`}
                            alt={language}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                          {LANGUAGES.find((l) => l.id === language)?.name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={`/${lang.id}.png`}
                              alt={lang.name}
                              width={20}
                              height={20}
                              className="object-contain"
                              priority
                            />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showParticipants && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UsersIcon className="h-5 w-5" />
                      Connected Participants ({clients.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {clients.map((client) => (
                        <Badge key={client.socketId} variant="secondary">
                          {client.username}
                        </Badge>
                      ))}
                      {clients.length === 0 && (
                        <p className="text-muted-foreground">
                          No other participants
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <BookIcon className="h-5 w-5 text-primary/80" />
                  <CardTitle>Problem Description</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">
                      {selectedQuestion.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                  <CardTitle>Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-full w-full rounded-md border">
                    <div className="p-4 space-y-4">
                      {selectedQuestion.examples.map(
                        (example: any, index: any) => (
                          <div key={index} className="space-y-2">
                            <p className="font-medium text-sm">
                              Example {index + 1}:
                            </p>
                            <ScrollArea className="h-full w-full rounded-md">
                              <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
                                <div>Input: {example.input}</div>
                                <div>Output: {example.output}</div>
                                {example.explanation && (
                                  <div className="pt-2 text-muted-foreground">
                                    Explanation: {example.explanation}
                                  </div>
                                )}
                              </pre>
                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                          </div>
                        )
                      )}
                    </div>
                    <ScrollBar />
                  </ScrollArea>
                </CardContent>
              </Card>

              {selectedQuestion.constraints && (
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                    <CardTitle>Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                      {selectedQuestion.constraints.map(
                        (constraint: string, index: number) => (
                          <li key={index} className="text-muted-foreground">
                            {constraint}
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={60} maxSize={100}>
        <div className="h-full relative">
          <Editor
            height={"100%"}
            defaultLanguage={language}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              minimap: { enabled: false },
              fontSize: 18,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              wordWrap: "on",
              wrappingIndent: "indent",
            }}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CollaborativeCodeEditor;
