"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "convex/react";
import { useState, useEffect, useRef } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import {
  Loader2Icon,
  LogIn,
  Code2,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
import MeetingCard from "@/components/MeetingCard";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { motion, useInView, useAnimation } from "framer-motion";
import LoaderUI from "@/components/LoaderUI";
import SpotlightCard from "@/components/ui/SpotlightCard";

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return { ref, controls };
};

// Component for signed-in functionality
function SignedInContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isInterviewer, isLoading } = useUserRole();
  const interviews = useQuery(api.interviews.getMyInterviews, {
    userEmail: session?.user?.email || "",
  });
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

  // If user is not signed in, show interviewer UI with login prompts
  if (status !== "authenticated") {
    return (
      <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* New Call */}
          <SpotlightCard
            className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
            spotlightColor="rgba(30, 60, 114, 0.6)"
          >
            <div
              className="w-full h-full flex flex-col justify-between cursor-pointer"
              style={{ minHeight: "100%" }}
              onClick={() => handleQuickAction("New Call")}
            >
              <div className="flex items-start justify-start mb-6">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                  }}
                >
                  <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                New Call
              </h3>
              <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                Start an instant call
              </p>
            </div>
          </SpotlightCard>

          {/* Join Interview */}
          <SpotlightCard
            className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
            spotlightColor="rgba(66, 39, 90, 0.6)"
          >
            <div
              className="w-full h-full flex flex-col justify-between cursor-pointer"
              style={{ minHeight: "100%" }}
              onClick={() => handleQuickAction("Join Interview")}
            >
              <div className="flex items-start justify-start mb-6">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #42275a, #734b6d)",
                  }}
                >
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                Join Interview
              </h3>
              <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                Enter via invitation link
              </p>
            </div>
          </SpotlightCard>

          {/* Schedule */}
          <SpotlightCard
            className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
            spotlightColor="rgba(19, 78, 74, 0.6)"
          >
            <div
              className="w-full h-full flex flex-col justify-between cursor-pointer"
              style={{ minHeight: "100%" }}
              onClick={() => router.push("/schedule")}
            >
              <div className="flex items-start justify-start mb-6">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #134e4a, #2dd4bf)",
                  }}
                >
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                Schedule
              </h3>
              <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                Plan upcoming interviews
              </p>
            </div>
          </SpotlightCard>

          {/* Recordings */}
          <SpotlightCard
            className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
            spotlightColor="rgba(40, 62, 81, 0.6)"
          >
            <div
              className="w-full h-full flex flex-col justify-between cursor-pointer"
              style={{ minHeight: "100%" }}
              onClick={() => router.push("/recordings")}
            >
              <div className="flex items-start justify-start mb-6">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #283E51, #485563)",
                  }}
                >
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                Recordings
              </h3>
              <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                Access past interviews
              </p>
            </div>
          </SpotlightCard>
        </div>
      </div>
    );
  }

  // If user is signed in but still loading
  if (isLoading) return <LoaderUI />;

  return (
    <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-8">
      {isInterviewer ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* New Call */}
            <SpotlightCard
              className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
              spotlightColor="rgba(30, 60, 114, 0.6)"
            >
              <div
                className="w-full h-full flex flex-col justify-between cursor-pointer"
                style={{ minHeight: "100%" }}
                onClick={() => handleQuickAction("New Call")}
              >
                <div className="flex items-start justify-start mb-6">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                    }}
                  >
                    <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                  New Call
                </h3>
                <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                  Start an instant call
                </p>
              </div>
            </SpotlightCard>

            {/* Join Interview */}
            <SpotlightCard
              className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
              spotlightColor="rgba(66, 39, 90, 0.6)"
            >
              <div
                className="w-full h-full flex flex-col justify-between cursor-pointer"
                style={{ minHeight: "100%" }}
                onClick={() => handleQuickAction("Join Interview")}
              >
                <div className="flex items-start justify-start mb-6">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #42275a, #734b6d)",
                    }}
                  >
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                  Join Interview
                </h3>
                <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                  Enter via invitation link
                </p>
              </div>
            </SpotlightCard>

            {/* Schedule */}
            <SpotlightCard
              className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
              spotlightColor="rgba(19, 78, 74, 0.6)"
            >
              <div
                className="w-full h-full flex flex-col justify-between cursor-pointer"
                style={{ minHeight: "100%" }}
                onClick={() => router.push("/schedule")}
              >
                <div className="flex items-start justify-start mb-6">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #134e4a, #2dd4bf)",
                    }}
                  >
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                  Schedule
                </h3>
                <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                  Plan upcoming interviews
                </p>
              </div>
            </SpotlightCard>

            {/* Recordings */}
            <SpotlightCard
              className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
              spotlightColor="rgba(40, 62, 81, 0.6)"
            >
              <div
                className="w-full h-full flex flex-col justify-between cursor-pointer"
                style={{ minHeight: "100%" }}
                onClick={() => router.push("/recordings")}
              >
                <div className="flex items-start justify-start mb-6">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #283E51, #485563)",
                    }}
                  >
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                  Recordings
                </h3>
                <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                  Access past interviews
                </p>
              </div>
            </SpotlightCard>
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold">Your Interviews</h1>
            <p className="text-muted-foreground mt-1">
              View and join your scheduled interviews
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            {interviews === undefined ? (
              <div className="flex justify-center py-12">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : interviews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview) => (
                  <div
                    key={interview._id}
                    className="h-full w-full cursor-pointer"
                  >
                    <MeetingCard interview={interview} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                You have no scheduled interviews at the moment
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const { status } = useSession();

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Get animation controls
  const statsAnimation = useScrollAnimation();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Background Grid */}
      {/* <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="absolute inset-0 bg-[linear-gradient(#1f1f1f_1px,transparent_1px),linear-gradient(90deg,#1f1f1f_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div> */}

      <section className="relative z-10 pt-5 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* Left Content */}
            <motion.div
              className="lg:col-span-7 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Welcome to
                </motion.div>
                <motion.div
                  className="text-blue-500"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  CodeScreen
                </motion.div>
                <motion.div
                  className="pt-2 text-2xl md:text-2xl lg:text-4xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  Your all-in-one
                </motion.div>
                <motion.div
                  className="pt-2 text-2xl md:text-2xl lg:text-4xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  Technical Interview{" "}
                  <span className="text-blue-500">Platform</span>
                </motion.div>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg text-zinc-700 dark:text-zinc-600 max-w-xl -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                Conduct, record, and review coding interviews in real-time with
                support for C++, Python, Java, and more. Schedule interviews,
                assess candidates live, and streamline your tech hiring—all in
                one place.
              </motion.p>

              {/* Stats */}
              <motion.div
                ref={statsAnimation.ref}
                variants={fadeInUpVariants}
                initial=""
                animate={statsAnimation.controls}
                className="flex flex-row items-center gap-4 xs:gap-6 sm:gap-8 text-xs sm:text-sm text-zinc-700 dark:text-zinc-600"
              >
                {/* Interviews Done */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-[80px]">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500">
                    100+
                  </div>
                  <div className="uppercase text-[10px] sm:text-xs ">
                    Interviews Done
                  </div>
                </div>

                {/* Languages Supported */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-[80px]">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500">
                    4
                  </div>
                  <div className="uppercase text-[10px] sm:text-xs ">
                    Languages Supported
                  </div>
                </div>

                {/* Session Recording */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-[80px]">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500">
                    100%
                  </div>
                  <div className="uppercase text-[10px] sm:text-xs ">
                    Session Recording
                  </div>
                </div>
              </motion.div>

              {/* CTA Button - Show for signed out users */}
              {status !== "authenticated" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => signIn("google")}
                    className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
                  >
                    <LogIn className="w-4 h-4 transition-transform" />
                    <span className="max-sm:hidden">Get Started!</span>
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Right Content (Image) — remains unchanged and hidden on small screens */}
            <motion.div
              className="absolute right-0 hidden lg:flex lg:col-span-5 justify-center items-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.div
                className="relative w-[550px] h-[550px] xl:w-[750px] xl:h-[750px]"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                <div className="relative overflow-hidden w-full h-full">
                  <Image
                    src="/hero.png"
                    alt="CodeScreen Platform"
                    className="w-full h-full object-contain object-center drop-shadow-2xl z-50"
                    fill
                    style={{
                      filter: "drop-shadow(0 20px 13px rgb(0 0 0 / 0.25)) z-50",
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Show functionality for everyone */}
      <SignedInContent />

      {/* Show sign-in prompt for signed-out users */}
      {status !== "authenticated" && (
        <div className="flex flex-col gap-10 mx-auto container">
          <motion.div
            variants={fadeInUpVariants}
            initial=""
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center py-12"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Sign in to access your dashboard, schedule interviews, and start
              conducting technical assessments.
            </p>
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg mx-auto"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Continue
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
