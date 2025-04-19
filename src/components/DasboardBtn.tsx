"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { SparklesIcon } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

function DasboardBtn() {
  const { isCandidate, isLoading } = useUserRole();

  if (isCandidate || isLoading) return null;

  return (
    <Link href={"/dashboard"}>
      <Button className="gap-2 font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600" size={"sm"}>
        <SparklesIcon className="size-4" />
        Dashboard
      </Button>
    </Link>
  );
}
export default DasboardBtn;
