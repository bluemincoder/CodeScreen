"use client";

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import { Loader2Icon, LogIn } from "lucide-react";
import MeetingCard from "@/components/MeetingCard";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
    const router = useRouter();

    const { isInterviewer, isLoading } = useUserRole();
    const interviews = useQuery(api.interviews.getMyInterviews);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"start" | "join">();

    const handleQuickAction = (title: string) => {
        switch (title) {
            case "New Call":
                setModalType("start");
                setShowModal(true);
                break;
            case "Join Interview":
                setModalType("join");
                setShowModal(true);
                break;
            default:
                router.push(`/${title.toLowerCase()}`);
        }
    };

    if (isLoading) return <LoaderUI />;
    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            {/* Background Grid */}
            {/* <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="absolute inset-0 bg-[linear-gradient(#1f1f1f_1px,transparent_1px),linear-gradient(90deg,#1f1f1f_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div> */}

            <section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
                        {/* Left Content */}
                        <div className="lg:col-span-7 space-y-6">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                                <div>Welcome to</div>
                                <div className="text-blue-500">CodeScreen</div>
                                <div className="pt-2 text-xl md:text-2xl lg:text-4xl">
                                    Your all-in-one
                                </div>
                                <div className="pt-2 text-xl md:text-2xl lg:text-4xl">
                                    Technical Interview{" "}
                                    <span className="text-blue-500">
                                        Platform
                                    </span>
                                </div>
                            </h1>

                            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-600 max-w-xl">
                                Conduct, record, and review coding interviews in
                                real-time with support for C++, Python, Java,
                                and more. Schedule interviews, assess candidates
                                live, and streamline your tech hiring—all in one
                                place.
                            </p>

                            {/* Stats */}
                            <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-8 text-sm text-zinc-700 dark:text-zinc-600">
                                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-500">
                                        100+
                                    </div>
                                    <div className="uppercase tracking-wider">
                                        Interviews Done
                                    </div>
                                </div>

                                <div className="hidden sm:block h-12 w-px bg-gray-600" />

                                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-500">
                                        4
                                    </div>
                                    <div className="uppercase tracking-wider">
                                        Languages Supported
                                    </div>
                                </div>

                                <div className="hidden sm:block h-12 w-px bg-gray-600" />

                                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-500">
                                        100%
                                    </div>
                                    <div className="uppercase tracking-wider">
                                        Session Recording
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg">
                                        <LogIn className="w-4 h-4 transition-transform" />
                                        <span className="max-sm:hidden">
                                            Get Started!
                                        </span>
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </div>

                        {/* Right Content (Image) — remains unchanged and hidden on small screens */}
                        <div className="absolute right-0 hidden lg:flex lg:col-span-5 justify-center items-center">
                            <div className="relative w-[500px] h-[500px] xl:w-[700px] xl:h-[700px]">
                                <div className="relative overflow-hidden w-full h-full">
                                    <Image
                                        src="/hero.png"
                                        alt="CodeScreen Platform"
                                        className="w-full h-full object-contain object-center"
                                        fill
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Add UserPrograms section if needed */}
            <div className="py-10 flex flex-col gap-10 mx-auto container">
                {isInterviewer ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {QUICK_ACTIONS.map((action) => (
                                <ActionCard
                                    key={action.title}
                                    action={action}
                                    onClick={() =>
                                        handleQuickAction(action.title)
                                    }
                                />
                            ))}
                        </div>

                        <MeetingModal
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            title={
                                modalType === "join"
                                    ? "Join Meeting"
                                    : "Start Meeting"
                            }
                            isJoinMeeting={modalType === "join"}
                        />
                    </>
                ) : (
                    <>
                        <div>
                            <h1 className="text-3xl font-bold">
                                Your Interviews
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                View and join your scheduled interviews
                            </p>
                        </div>

                        <div className="mt-8">
                            {interviews === undefined ? (
                                <div className="flex justify-center py-12">
                                    <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : interviews.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {interviews.map((interview) => (
                                        <MeetingCard
                                            key={interview._id}
                                            interview={interview}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    You have no scheduled interviews at the
                                    moment
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
