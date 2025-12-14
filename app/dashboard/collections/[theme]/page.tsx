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
  "Childhood": "🧒",
  "Family History": "👨‍👩‍👧‍👦",
  "College Years": "🎓",
  "Wedding": "💒",
  "Travel": "✈️",
  "Milestones": "🏆",
  "Holidays": "🎄",
  "Other": "📦",
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link 
          href="/dashboard/collections" 
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 font-semibold group transition-colors"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Collections
        </Link>
      </div>

      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-4xl sm:text-5xl">{themeEmoji}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-2">{decodedTheme}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border-2 border-amber-300 rounded-lg">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-sm font-bold text-amber-900">
                  {capsules.length} capsule{capsules.length !== 1 ? "s" : ""}
                </span>
              </div>
              <Link
                href="/create/capsule"
                className="inline-flex items-center gap-1 px-3 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New
              </Link>
            </div>
          </div>
        </div>
      </div>

      {capsules.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capsules.map((capsule: any) => (
            <CapsuleCard key={capsule._id} capsule={capsule} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-amber-300 rounded-2xl bg-amber-50">
          <div className="w-24 h-24 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-amber-300">
            <span className="text-6xl">{themeEmoji}</span>
          </div>
          <h3 className="text-xl font-bold text-amber-900 mb-2">No capsules in this theme yet</h3>
          <p className="text-amber-700 mb-6">Start preserving your {decodedTheme.toLowerCase()} memories</p>
          <Link
            href="/create/capsule"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 font-semibold shadow-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create a new capsule
          </Link>
        </div>
      )}
    </div>
  );
}