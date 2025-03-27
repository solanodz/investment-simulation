import { ModeToggle } from "./ModeToggle";
import Link from "next/link";

export function Header() {
    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-6">
                <div className="flex items-center gap-2 font-semibold">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-amber-100 dark:bg-amber-500/20 transition-all duration-200 hover:bg-amber-200 dark:hover:bg-amber-500/30 hover:shadow-md hover:scale-105 cursor-pointer">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-amber-500 dark:text-amber-400 transition-transform duration-200 hover:text-amber-600 dark:hover:text-amber-300"
                        >
                            <path
                                d="M12 2L18.5 5.5V18.5L12 22L5.5 18.5V5.5L12 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 6L16 8.5V13.5L12 16L8 13.5V8.5L12 6Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <span className="text-amber-500 dark:text-amber-400 font-bold tracking-tight text-lg ">
                        Investment<span className="text-foreground dark:text-stone-200 mx-1 font-medium">Simulator</span>
                    </span>

                </div>

                <nav className="flex flex-1 gap-4 items-center justify-end space-x-1">
                    <Link href="./about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About the project</Link>
                    <ModeToggle />
                </nav>
            </div>
        </header>
    )
}