import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-4xl">
        <div className="inline-block mb-6">
          <div className="w-20 h-20 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <svg
              className="w-12 h-12 text-white"
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
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-amber-900 leading-tight">
          Preserve Memories for the Future
        </h1>
        <p className="text-lg sm:text-xl text-amber-800 mb-8 max-w-2xl mx-auto leading-relaxed">
          Create digital time capsules with photos, videos, and messages that
          unlock on special dates or life events. Share with loved ones and
          relive precious moments.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
          <Link href="/register">
            <Button
              size="lg"
              className="px-8 bg-amber-600 hover:bg-amber-700 text-white shadow-lg w-full sm:w-auto text-base"
            >
              Get Started Free
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-2 border-amber-600 text-amber-800 hover:bg-amber-50 w-full sm:w-auto text-base"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 max-w-6xl w-full">
        <div className="p-8 border-2 border-amber-200 rounded-2xl bg-white hover:shadow-xl transition-shadow duration-300">
          <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-amber-900">
            Create Capsules
          </h3>
          <p className="text-amber-700 leading-relaxed">
            Upload photos, videos, audio, and letters into personalized time
            capsules.
          </p>
        </div>

        <div className="p-8 border-2 border-amber-200 rounded-2xl bg-white hover:shadow-xl transition-shadow duration-300">
          <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-amber-900">
            Set Future Unlock
          </h3>
          <p className="text-amber-700 leading-relaxed">
            Choose a date or life event when your capsule will automatically
            unlock.
          </p>
        </div>

        <div className="p-8 border-2 border-amber-200 rounded-2xl bg-white hover:shadow-xl transition-shadow duration-300">
          <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-amber-900">
            Share with Family
          </h3>
          <p className="text-amber-700 leading-relaxed">
            Invite family members to contribute and receive notifications when
            it's time.
          </p>
        </div>
      </div>
    </div>
  );
}
