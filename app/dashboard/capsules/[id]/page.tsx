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

  const capsule = await Capsule.findById(id)
    .populate("ownerId", "name email")
    .lean();

  if (!capsule) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-900/40 border-2 border-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4v2m0 4v2M7 9h10" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Capsule Not Found</h2>
          <p className="text-slate-400 text-lg mb-8">The time capsule you're looking for doesn't exist or has been removed.</p>
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

  const isUnlocked = new Date(capsule.unlockDate) <= new Date();
  const timeUntilUnlock = new Date(capsule.unlockDate).getTime() - new Date().getTime();
  const daysRemaining = Math.ceil(timeUntilUnlock / (1000 * 60 * 60 * 24));

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </Link>

        <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8 pb-8 border-b-2 border-cyan-500/20">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                {capsule.title}
              </h1>
              <p className="text-slate-400 text-lg">{capsule.description}</p>
            </div>

            <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 whitespace-nowrap flex-shrink-0 ${
              isUnlocked
                ? "bg-emerald-900/40 border-emerald-500 text-emerald-300"
                : "bg-cyan-900/40 border-cyan-500 text-cyan-300"
            }`}>
              <div className={`w-3 h-3 rounded-full ${isUnlocked ? "bg-emerald-500" : "bg-cyan-500"} ${!isUnlocked && "animate-pulse"}`}></div>
              <span className="font-bold text-sm">
                {isUnlocked ? "Unlocked" : "Locked"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl p-6">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
                Theme
              </p>
              <p className="text-white text-2xl font-black">
                {capsule.theme || "Other"}
              </p>
            </div>

            <div className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl p-6">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
                Status
              </p>
              <p className={`text-2xl font-black capitalize ${
                isUnlocked ? "text-emerald-400" : "text-cyan-400"
              }`}>
                {capsule.status}
              </p>
            </div>

            <div className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl p-6">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
                Unlock Date
              </p>
              <p className="text-white text-2xl font-black">
                {new Date(capsule.unlockDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {!isUnlocked && (
              <div className="bg-cyan-900/30 border-2 border-cyan-500/50 rounded-2xl p-6">
                <p className="text-cyan-300 text-sm font-bold uppercase tracking-widest mb-2">
                  Time Remaining
                </p>
                <p className="text-cyan-400 text-3xl font-black">
                  {daysRemaining > 0 ? `${daysRemaining} days` : "Unlocking soon!"}
                </p>
              </div>
            )}
          </div>

          {!isUnlocked && (
            <div className="mb-10 bg-slate-800/50 border-2 border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-cyan-300 font-bold">Unlock Progress</span>
                <span className="text-cyan-400 font-black text-lg">
                  {Math.round(((new Date().getTime() - new Date(capsule.createdAt).getTime()) / (new Date(capsule.unlockDate).getTime() - new Date(capsule.createdAt).getTime())) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden border border-cyan-500/30">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                  style={{
                    width: `${Math.round(((new Date().getTime() - new Date(capsule.createdAt).getTime()) / (new Date(capsule.unlockDate).getTime() - new Date(capsule.createdAt).getTime())) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {capsule.recipientEmails && capsule.recipientEmails.length > 0 && (
            <div className="mb-10 bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl p-6">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">
                Recipients
              </p>
              <div className="flex flex-wrap gap-2">
                {capsule.recipientEmails.map((email: string, idx: number) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-indigo-900/40 border-2 border-indigo-500/50 text-indigo-300 rounded-lg font-medium text-sm"
                  >
                    {email}
                  </div>
                ))}
              </div>
            </div>
          )}

          {capsule.collaborators && capsule.collaborators.length > 0 && (
            <div className="mb-10 bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl p-6">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">
                Collaborators
              </p>
              <div className="flex flex-wrap gap-2">
                {capsule.collaborators.map((id: string, idx: number) => (
                  <div
                    key={idx}
                    className="px-4 py-2 bg-purple-900/40 border-2 border-purple-500/50 text-purple-300 rounded-lg font-medium text-sm"
                  >
                    Collaborator {idx + 1}
                  </div>
                ))}
              </div>
            </div>
          )}

          {capsule.description && (
            <div className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl p-6">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">
                Full Description
              </p>
              <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">
                {capsule.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}