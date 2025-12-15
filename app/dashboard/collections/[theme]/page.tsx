import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CapsuleCard } from "@/components/CapsuleCard";

type Props = {
  params: Promise<{ theme: string }>;
};

const THEME_ICONS: Record<string, string> = {
  Childhood: "🧒",
  "Family History": "👨‍👩‍👧‍👦",
  "College Years": "🎓",
  Wedding: "💒",
  Travel: "✈️",
  Milestones: "🏆",
  Holidays: "🎄",
  Other: "📦",
};

const THEME_COLORS: Record<string, { bg: string; gradient: string; border: string }> = {
  Childhood: { bg: "bg-violet-950", gradient: "from-violet-600 to-purple-600", border: "border-violet-500" },
  "Family History": { bg: "bg-rose-950", gradient: "from-rose-600 to-pink-600", border: "border-rose-500" },
  "College Years": { bg: "bg-blue-950", gradient: "from-blue-600 to-cyan-600", border: "border-blue-500" },
  Wedding: { bg: "bg-fuchsia-950", gradient: "from-fuchsia-600 to-pink-600", border: "border-fuchsia-500" },
  Travel: { bg: "bg-sky-950", gradient: "from-sky-600 to-cyan-600", border: "border-sky-500" },
  Milestones: { bg: "bg-amber-950", gradient: "from-amber-600 to-orange-600", border: "border-amber-500" },
  Holidays: { bg: "bg-emerald-950", gradient: "from-emerald-600 to-green-600", border: "border-emerald-500" },
  Other: { bg: "bg-slate-800", gradient: "from-slate-600 to-gray-600", border: "border-slate-500" },
};

export default async function ThemeCollectionPage({ params }: Props) {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  await dbConnect();

  const { theme } = await params;
  const decodedTheme = decodeURIComponent(theme);

  const rawCapsules = await Capsule.find({
    theme: decodedTheme,
    $or: [
      { ownerId: session.user.id },
      { collaborators: session.user.id },
      { recipientEmails: session.user.email },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  const capsules = rawCapsules.map((c: any) => ({
    ...c,
    _id: c._id.toString(),
    ownerId: c.ownerId?.toString(),
    unlockDate: c.unlockDate?.toISOString(),
    createdAt: c.createdAt?.toISOString(),
  }));

  const themeEmoji = THEME_ICONS[decodedTheme] || "📦";
  const themeColor = THEME_COLORS[decodedTheme] || THEME_COLORS["Other"];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <Link
          href="/dashboard/collections"
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
          <span>Back to Collections</span>
        </Link>

        <div className="mb-12 lg:mb-16">
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
            <div className={`${themeColor.bg} ${themeColor.border} border-2 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0`}>
              <span className="text-5xl sm:text-6xl">{themeEmoji}</span>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                {decodedTheme}
              </h1>

              <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
                <div className={`inline-flex items-center gap-2 px-4 py-2 ${themeColor.bg} ${themeColor.border} border-2 rounded-lg`}>
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span className="text-white font-black text-lg">
                    {capsules.length} Capsule{capsules.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <Link
                  href="/create/capsule"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-cyan-500 text-slate-900 rounded-lg hover:bg-cyan-400 transition-all duration-200 font-bold shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New
                </Link>
              </div>
            </div>
          </div>
        </div>

        {capsules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {capsules.map((capsule: any) => (
              <CapsuleCard key={capsule._id} capsule={capsule} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 sm:py-24 border-2 border-dashed border-cyan-500/50 rounded-2xl bg-slate-900/50 backdrop-blur-sm">
            <div className={`${themeColor.bg} ${themeColor.border} w-24 h-24 sm:w-32 sm:h-32 border-2 rounded-2xl flex items-center justify-center mx-auto mb-8`}>
              <span className="text-5xl sm:text-6xl">{themeEmoji}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              No capsules in {decodedTheme} yet
            </h3>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
              Start preserving your {decodedTheme.toLowerCase()} memories today
            </p>
            <Link
              href="/create/capsule"
              className="inline-block px-10 py-4 bg-cyan-500 text-slate-900 rounded-lg hover:bg-cyan-400 font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create a new capsule
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}