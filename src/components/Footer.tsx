import { Blocks } from "lucide-react";
import Link from "next/link";

function Footer() {
    return (
        <footer className="relative mt-auto w-full bg-transparent">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-sm text-zinc-700 dark:text-zinc-400">
                    {/* Left: Branding */}
                    <div className="flex items-center gap-2">
                        <Blocks className="size-4 sm:size-5 text-blue-500 dark:text-blue-400" />
                        <span className="text-center md:text-left text-xs sm:text-sm">
                            Built for Interviews, by bluemincoder
                        </span>
                    </div>

                    {/* Right: Links */}
                    <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                        <Link
                            href="https://github.com/bluemincoder"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            GitHub
                        </Link>
                        <Link
                            href="https://www.linkedin.com/in/bluemincoder/"
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            LinkedIn
                        </Link>
                        <Link
                            href="mailto:minaal07satankar@gmail.com?subject=Hello%20There&body=I%20would%20like%20to%20connect%20with%20you."
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Email
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
