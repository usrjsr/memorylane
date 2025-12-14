import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { redirect } from "next/navigation";
import Link from "next/link";

const THEMES = [
  { name: "Childhood", emoji: "🧒", color: "bg-amber-50 border-amber-300 hover:bg-amber-100" },
  { name: "Family History", emoji: "👨‍👩‍👧‍👦", color: "bg-orange-50 border-orange-300 hover:bg-orange-100" },
  { name: "College Years", emoji: "🎓", color: "bg-purple-50 border-purple-300 hover:bg-purple-100" },
  { name: "Wedding", emoji: "💒", color: "bg-pink-50 border-pink-300 hover:bg-pink-100" },
  { name: "Travel", emoji: "✈️", color: "bg-sky-50 border-sky-300 hover:bg-sky-100" },
  { name: "Milestones", emoji: "🏆", color: "bg-yellow-50 border-yellow-300 hover:bg-yellow-100" },
  { name: "Holidays", emoji: "🎄", color: "bg-red-50 border-red-300 hover:bg-red-100" },
  { name: "Other", emoji: "📦", color: "bg-gray-50 border-gray-300 hover:bg-gray-100" },
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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
         <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-800 font-semibold mb-6 group transition-colors"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
        
      </div>

      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-amber-900">Memory Collections</h1>
        <p className="text-amber-700 text-lg max-w-2xl mx-auto">
          Browse your time capsules organized by themes and life events.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-100 border-2 border-amber-300 rounded-xl">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-sm font-bold text-amber-900">{totalCapsules} Total Capsules</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {THEMES.map((theme) => {
          const count = themeCounts[theme.name] || 0;
          
          return (
            <Link
              key={theme.name}
              href={`/dashboard/collections/${encodeURIComponent(theme.name)}`}
              className={`${theme.color} border-2 rounded-2xl p-6 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {theme.emoji}
                </div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">{theme.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-600 transition-all duration-500"
                      style={{ width: totalCapsules > 0 ? `${(count / totalCapsules) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-gray-700 text-sm font-bold min-w-[3rem] text-right">
                    {count} capsule{count !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          );
        })}
      </div>

      {capsules.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-amber-300 rounded-2xl mt-10 bg-amber-50">
          <div className="w-24 h-24 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-amber-300">
            <svg className="w-14 h-14 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <p className="text-amber-900 text-xl font-bold mb-2">No capsules yet!</p>
          <p className="text-amber-700 mb-6">Start preserving your memories today</p>
          <Link
            href="/create/capsule"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 font-semibold shadow-lg transition-colors"
          >
            Create your first time capsule
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}