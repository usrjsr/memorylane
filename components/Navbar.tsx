"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <header className="bg-amber-50 border-b-2 border-amber-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-amber-900 hidden sm:inline">
              MemoryLane
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {status === "authenticated" ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg text-amber-800 hover:bg-amber-100 transition-colors duration-200 text-sm sm:text-base font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/create/capsule"
                  className="px-3 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors duration-200 text-sm sm:text-base font-medium shadow-sm"
                >
                  <span className="hidden sm:inline">Create Memory</span>
                  <span className="sm:hidden">Create</span>
                </Link>
                <div className="flex items-center gap-2 sm:gap-3 ml-2 pl-2 sm:pl-4 border-l-2 border-amber-200">
                  <span className="text-sm text-amber-700 hidden lg:inline font-medium">
                    Hi, {session.user?.name}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="border-amber-300 text-amber-800 hover:bg-amber-100 hover:border-amber-400 text-xs sm:text-sm"
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-amber-800 hover:bg-amber-100 text-sm sm:text-base"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm text-sm sm:text-base">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
