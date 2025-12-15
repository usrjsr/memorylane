"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-4xl">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/50">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 text-white leading-tight tracking-tight">
            Preserve Memories for the Future
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create digital time capsules with photos, videos, letters, and messages that unlock on special dates or life events. Share with loved ones and relive precious moments forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-16 justify-center">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full px-8 bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg hover:shadow-cyan-500/50 h-12 sm:h-14 text-base sm:text-lg font-bold"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full px-8 border-2 border-slate-700 text-cyan-400 hover:bg-slate-800 h-12 sm:h-14 text-base sm:text-lg font-bold"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border-y border-cyan-500/20 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white text-center mb-4 tracking-tight">
            Core Features
          </h2>
          <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto mb-12">
            Everything you need to create, manage, and share your most precious memories
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="p-8 border-2 border-cyan-500/30 rounded-2xl bg-slate-800/40 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="w-14 h-14 bg-cyan-900/40 border-2 border-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all">
                <svg
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">
                Create Digital Time Capsules
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Upload text, images, audio, and video to build personalized memory capsules. Organize your most precious moments with descriptions and themes.
              </p>
            </div>

            <div className="p-8 border-2 border-cyan-500/30 rounded-2xl bg-slate-800/40 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="w-14 h-14 bg-cyan-900/40 border-2 border-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all">
                <svg
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">
                Flexible Unlock Conditions
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Choose specific future dates or major life events like graduations and weddings. Your capsules unlock automatically when the time comes.
              </p>
            </div>

            <div className="p-8 border-2 border-cyan-500/30 rounded-2xl bg-slate-800/40 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="w-14 h-14 bg-cyan-900/40 border-2 border-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all">
                <svg
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">
                Recipient Assignment
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Add intended recipients who will receive notifications when capsules unlock. Share your memories with family and loved ones securely.
              </p>
            </div>

            <div className="p-8 border-2 border-cyan-500/30 rounded-2xl bg-slate-800/40 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="w-14 h-14 bg-indigo-900/40 border-2 border-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all">
                <svg
                  className="w-8 h-8 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">
                Email Notifications
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Recipients automatically receive notifications when their capsules unlock. Never miss an important memory moment with smart email alerts.
              </p>
            </div>

            <div className="p-8 border-2 border-cyan-500/30 rounded-2xl bg-slate-800/40 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-900/40 border-2 border-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all">
                <svg
                  className="w-8 h-8 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">
                Themed Memory Collections
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Group capsules under themes like Childhood, Family History, College Years, Weddings, Travel, and Milestones for better organization.
              </p>
            </div>

            <div className="p-8 border-2 border-cyan-500/30 rounded-2xl bg-slate-800/40 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="w-14 h-14 bg-rose-900/40 border-2 border-rose-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-rose-500/30 transition-all">
                <svg
                  className="w-8 h-8 text-rose-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4.354a4 4 0 110 5.292 4 4 0 010-5.292zM15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">
                Collaboration Mode
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Enable multiple family members to contribute memories to shared capsules. Build collective time capsules with loved ones' contributions.
              </p>
            </div>

            <div className="p-8 border-2 border-cyan-500/30 rounded-2xl bg-slate-800/40 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="w-14 h-14 bg-amber-900/40 border-2 border-amber-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-all">
                <svg
                  className="w-8 h-8 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">
                Countdown Timer
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Display remaining time before your capsule unlocks. Build anticipation with dynamic countdown timers on every time capsule.
              </p>
            </div>

            <div className="p-8 border-2 border-cyan-500/30 rounded-2xl bg-slate-800/40 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-900/40 border-2 border-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all">
                <svg
                  className="w-8 h-8 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">
                Privacy Controls
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Set each capsule as private, recipient-only, or public. Maintain full control over who can view your precious memories.
              </p>
            </div>

            <div className="p-8 border-2 border-cyan-500/30 rounded-2xl bg-slate-800/40 hover:border-cyan-500/60 hover:bg-slate-800/60 transition-all duration-300 group">
              <div className="w-14 h-14 bg-sky-900/40 border-2 border-sky-500 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-sky-500/30 transition-all">
                <svg
                  className="w-8 h-8 text-sky-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-white">
                AI-Powered Assistance
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Get AI suggestions for captions, memory summaries, and audio transcription. Let AI enhance your storytelling with intelligent assistance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
              Why Choose MemoryLane?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Your memories deserve more than just storage – they deserve to be cherished
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-900/40 border-2 border-cyan-500">
                  <svg className="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Emotional Storytelling</h3>
                <p className="text-slate-400">Express your memories with rich media and heartfelt descriptions for maximum emotional impact.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-900/40 border-2 border-cyan-500">
                  <svg className="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Secure & Private</h3>
                <p className="text-slate-400">Your memories are encrypted and secure. Complete control over who sees what, when.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-900/40 border-2 border-cyan-500">
                  <svg className="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Family Connection</h3>
                <p className="text-slate-400">Bring families together across time zones and generations with shared capsules.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-900/40 border-2 border-cyan-500">
                  <svg className="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Forever Accessible</h3>
                <p className="text-slate-400">Your memories preserved forever in a beautiful, accessible digital format.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-y border-cyan-500/20 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
            Ready to Preserve Your Memories?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Start creating your digital time capsules today. It's free, secure, and takes just minutes to get started.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full px-10 bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg hover:shadow-cyan-500/50 h-12 sm:h-14 text-base sm:text-lg font-bold"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full px-10 border-2 border-slate-700 text-cyan-400 hover:bg-slate-800 h-12 sm:h-14 text-base sm:text-lg font-bold"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}