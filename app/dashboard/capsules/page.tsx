import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CapsuleDetailPage({ params }: Props) {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  await dbConnect();

  const capsule = await Capsule.findById(id).lean();

  if (!capsule) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-900/40 border-2 border-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-14 h-14 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Capsule Not Found</h2>
          <p className="text-slate-400 text-lg mb-8">This capsule may have been deleted or doesn't exist.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 text-slate-900 rounded-lg hover:bg-cyan-400 font-bold transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95"
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
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const unlockDate = new Date(capsule.unlockDate);
  const isLocked = capsule.status !== "unlocked" && unlockDate > new Date();

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold mb-10 group transition-all duration-200"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-b-2 border-cyan-500/30 p-8 sm:p-10 lg:p-12">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-cyan-500/50">
                <svg
                  className="w-12 h-12 sm:w-14 sm:h-14 text-white"
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
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                  {capsule.title}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-2 ${
                      isLocked
                        ? "bg-cyan-900/50 border-cyan-500 text-cyan-300"
                        : "bg-emerald-900/50 border-emerald-500 text-emerald-300"
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${isLocked ? "bg-cyan-400 animate-pulse" : "bg-emerald-400"}`}></div>
                    {isLocked ? "Locked" : "Unlocked"}
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-900/50 border-2 border-indigo-500 text-indigo-300 rounded-lg text-sm font-bold">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    {capsule.theme || "Other"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 lg:p-12 space-y-8">
            <div className="bg-cyan-900/20 border-2 border-cyan-500/40 p-6 sm:p-8 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-cyan-900/40 border-2 border-cyan-500/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-cyan-300 font-bold uppercase tracking-widest">Unlock Date</p>
                  <p className="text-2xl font-black text-white">
                    {unlockDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {isLocked && (
                <div className="mt-4 pt-4 border-t border-cyan-500/20">
                  <p className="text-sm text-cyan-300 flex items-center gap-2 font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    This capsule will automatically unlock on the date above
                  </p>
                </div>
              )}
            </div>

            {capsule.description && (
              <div className="bg-slate-800/50 border-2 border-slate-700/50 p-6 sm:p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <svg
                    className="w-5 h-5 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  <h2 className="text-xl font-black text-white">Description</h2>
                </div>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {capsule.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border-2 border-slate-700/50 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h2 className="text-lg font-bold text-white">Status</h2>
                </div>
                <p className="text-cyan-300 text-lg font-black capitalize">{capsule.status}</p>
              </div>

              <div className="bg-slate-800/50 border-2 border-slate-700/50 p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <h2 className="text-lg font-bold text-white">Theme</h2>
                </div>
                <p className="text-indigo-300 text-lg font-black">{capsule.theme || "Other"}</p>
              </div>
            </div>

            {!isLocked && (
              <div className="pt-4">
                <Link
                  href={`/unlocked/${id}`}
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 sm:py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-emerald-500/50 hover:shadow-2xl transform hover:scale-105 active:scale-95"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                  Open Capsule & View Contents
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}