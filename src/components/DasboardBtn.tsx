"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { SparklesIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

function DasboardBtn() {
    const { isCandidate, isLoading } = useUserRole();

    if (isCandidate || isLoading) return null;

    return (
        <Link href="/dashboard">
            <Button
                className="gap-1 sm:gap-2 font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 px-2 sm:px-4"
                size="sm"
            >
                <SparklesIcon className="size-4 sm:size-5" />
                <span className="hidden sm:inline">Dashboard</span>
            </Button>
        </Link>
    );
}

export default DasboardBtn;
