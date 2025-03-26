import { Blocks } from "lucide-react";
import Link from "next/link";

function Footer() {
    return (
        <footer className="relative mt-auto">
            {/* <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white to-transparent" /> */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Blocks className="size-5" />
                        <span>Built for Interviews, by bluemincoder</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            href="https://github.com/bluemincoder"
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                        >
                            Github
                        </Link>
                        <Link
                            href="https://www.linkedin.com/in/bluemincoder/"
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                        >
                            LinkedIn
                        </Link>
                        <Link
                            href="mailto:minaal07satankar@gmail.com?subject=Hello%20There&body=I%20would%20like%20to%20connect%20with%20you."
                            className="text-gray-400 hover:text-gray-300 transition-colors"
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
