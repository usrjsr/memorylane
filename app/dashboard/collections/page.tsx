import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { redirect } from "next/navigation";
import Link from "next/link";

const THEMES = [
  {
    name: "Childhood",
    emoji: "🧒",
    color: "from-violet-600 to-purple-600",
    bgColor: "bg-violet-950",
    borderColor: "border-violet-500",
  },
  {
    name: "Family History",
    emoji: "👨‍👩‍👧‍👦",
    color: "from-rose-600 to-pink-600",
    bgColor: "bg-rose-950",
    borderColor: "border-rose-500",
  },
  {
    name: "College Years",
    emoji: "🎓",
    color: "from-blue-600 to-cyan-600",
    bgColor: "bg-blue-950",
    borderColor: "border-blue-500",
  },
  {
    name: "Wedding",
    emoji: "💒",
    color: "from-fuchsia-600 to-pink-600",
    bgColor: "bg-fuchsia-950",
    borderColor: "border-fuchsia-500",
  },
  {
    name: "Travel",
    emoji: "✈️",
    color: "from-sky-600 to-cyan-600",
    bgColor: "bg-sky-950",
    borderColor: "border-sky-500",
  },
  {
    name: "Milestones",
    emoji: "🏆",
    color: "from-amber-600 to-orange-600",
    bgColor: "bg-amber-950",
    borderColor: "border-amber-500",
  },
  {
    name: "Holidays",
    emoji: "🎄",
    color: "from-emerald-600 to-green-600",
    bgColor: "bg-emerald-950",
    borderColor: "border-emerald-500",
  },
  {
    name: "Other",
    emoji: "📦",
    color: "from-slate-600 to-gray-600",
    bgColor: "bg-slate-800",
    borderColor: "border-slate-500",
  },
];

export default async function CollectionsPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  await dbConnect();

  const capsules = await Capsule.find({
    $or: [
      { ownerId: session.user.id },
      { collaborators: session.user.id },
      { recipientEmails: session.user.email },
    ],
  }).lean();

  const themeCounts: Record<string, number> = {};
  capsules.forEach((c: any) => {
    const theme = c.theme || "Other";
    themeCounts[theme] = (themeCounts[theme] || 0) + 1;
  });

  const totalCapsules = capsules.length;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold mb-8 group transition-all duration-200"
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

        <div className="mb-12 lg:mb-16 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/50">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
            Memory Collections
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Organize your time capsules by themes and life events
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-900/40 border-2 border-cyan-500 rounded-lg">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className="text-lg font-bold text-cyan-300">
              {totalCapsules} Total Capsules
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {THEMES.map((theme) => {
            const count = themeCounts[theme.name] || 0;

            return (
              <Link
                key={theme.name}
                href={`/dashboard/collections/${encodeURIComponent(theme.name)}`}
                className={`${theme.bgColor} ${theme.borderColor} border-2 rounded-2xl p-6 sm:p-8 transition-all duration-300 cursor-pointer group relative overflow-hidden hover:border-opacity-100 hover:scale-105`}
              >
                <div className="relative z-10">
                  <div className="text-5xl sm:text-6xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">
                    {theme.emoji}
                  </div>

                  <h3 className="font-black text-xl sm:text-2xl mb-4 text-white">
                    {theme.name}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm font-bold">Progress</span>
                      <span className="text-white font-black text-lg">
                        {count}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50">
                      <div
                        className={`h-full bg-gradient-to-r ${theme.color} transition-all duration-500`}
                        style={{
                          width:
                            totalCapsules > 0
                              ? `${(count / totalCapsules) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2 border-white/10 rounded-2xl" />
              </Link>
            );
          })}
        </div>

        {capsules.length === 0 && (
          <div className="text-center py-20 sm:py-24 border-2 border-dashed border-cyan-500/50 rounded-2xl mt-10 lg:mt-16 bg-slate-900/50 backdrop-blur-sm">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-cyan-900/60 to-indigo-900/60 rounded-2xl flex items-center justify-center mx-auto mb-8 border-2 border-cyan-500/30">
              <svg
                className="w-14 h-14 sm:w-20 sm:h-20 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
            <p className="text-white text-2xl sm:text-3xl font-black mb-3">
              No Capsules Yet
            </p>
            <p className="text-slate-400 text-lg mb-8">
              Start preserving your memories by creating your first time capsule
            </p>
            <Link
              href="/create/capsule"
              className="inline-block px-10 py-4 bg-cyan-500 text-slate-900 rounded-lg hover:bg-cyan-400 font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              Create Your First Capsule
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}