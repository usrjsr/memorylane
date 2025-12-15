"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 border-b-4 border-cyan-500 sticky top-0 z-50 backdrop-blur-xl bg-opacity-98 shadow-2xl">
      <nav className="container mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-cyan-500/50 group-hover:shadow-2xl">
              <svg
                className="w-5 h-5 sm:w-7 sm:h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 8v8m-4-4h8M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-2xl font-black text-white tracking-tight">
                MemoryLane
              </span>
              <span className="text-[9px] sm:text-xs text-cyan-400 font-semibold tracking-widest">
                TIME CAPSULES
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {status === "authenticated" ? (
              <>
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800 transition-all duration-200 text-sm sm:text-base font-semibold"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/create/capsule"
                    className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-900 hover:bg-cyan-400 transition-all duration-200 text-sm sm:text-base font-bold shadow-lg hover:shadow-cyan-500/50 hover:shadow-xl whitespace-nowrap"
                  >
                    Create Memory
                  </Link>
                  <div className="flex items-center gap-3 ml-2 pl-4 border-l-2 border-cyan-500/30">
                    <span className="text-sm text-slate-300 hidden lg:inline font-semibold">
                      {session.user?.name}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="border-cyan-500/50 text-cyan-400 hover:bg-slate-800 hover:border-cyan-400 hover:text-cyan-300 text-xs sm:text-sm font-semibold transition-all duration-200"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-slate-700 transition-all duration-200 border border-cyan-500/30"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-3 w-56 bg-slate-800 rounded-xl shadow-2xl border border-cyan-500/30 overflow-hidden z-50">
                        <div className="p-4 border-b border-slate-700">
                          <p className="text-sm font-semibold text-white truncate">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {session.user?.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-slate-700 hover:text-white transition-all duration-200"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                            <span className="font-semibold">Dashboard</span>
                          </Link>
                          <Link
                            href="/create/capsule"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-cyan-400 hover:bg-slate-700 hover:text-cyan-300 transition-all duration-200"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            <span className="font-semibold">Create Memory</span>
                          </Link>
                        </div>
                        <div className="border-t border-slate-700 p-2">
                          <button
                            onClick={() => {
                              setIsMenuOpen(false);
                              signOut({ callbackUrl: "/" });
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-700 hover:text-red-300 transition-all duration-200 w-full rounded-lg"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            <span className="font-semibold">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-800 text-xs sm:text-base font-semibold transition-all duration-200 px-3 sm:px-4"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg hover:shadow-cyan-500/50 hover:shadow-xl text-xs sm:text-base font-bold transition-all duration-200 px-3 sm:px-4">
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