// app/dashboard/collections/page.tsx

import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { redirect } from "next/navigation";
import Link from "next/link";

const THEMES = [
  { name: "Childhood", emoji: "🧒", color: "bg-yellow-100 border-yellow-300" },
  { name: "Family History", emoji: "👨‍👩‍👧‍👦", color: "bg-blue-100 border-blue-300" },
  { name: "College Years", emoji: "🎓", color: "bg-purple-100 border-purple-300" },
  { name: "Wedding", emoji: "💒", color: "bg-pink-100 border-pink-300" },
  { name: "Travel", emoji: "✈️", color: "bg-green-100 border-green-300" },
  { name: "Milestones", emoji: "🏆", color: "bg-orange-100 border-orange-300" },
  { name: "Holidays", emoji: "🎄", color: "bg-red-100 border-red-300" },
  { name: "Other", emoji: "📦", color: "bg-gray-100 border-gray-300" },
];

export default async function CollectionsPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  await dbConnect();

  // Get capsule counts grouped by theme
  const capsules = await Capsule.find({
    $or: [
      { ownerId: session.user.id },
      { collaborators: session.user.id },
      { recipientEmails: session.user.email },
    ],
  }).lean();

  // Count capsules per theme
  const themeCounts: Record<string, number> = {};
  capsules.forEach((c: any) => {
    const theme = c.theme || "Other";
    themeCounts[theme] = (themeCounts[theme] || 0) + 1;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">Memory Collections</h1>
      <p className="text-gray-600 mb-8">
        Browse your time capsules organized by themes and life events.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {THEMES.map((theme) => {
          const count = themeCounts[theme.name] || 0;
          
          return (
            <Link
              key={theme.name}
              href={`/dashboard/collections/${encodeURIComponent(theme.name)}`}
              className={`${theme.color} border-2 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="text-4xl mb-3">{theme.emoji}</div>
              <h3 className="font-bold text-lg">{theme.name}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {count} capsule{count !== 1 ? "s" : ""}
              </p>
            </Link>
          );
        })}
      </div>

      {capsules.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-xl mt-8">
          <p className="text-gray-500 text-lg">No capsules yet!</p>
          <Link
            href="/create/capsule"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Create your first time capsule →
          </Link>
        </div>
      )}
    </div>
  );
}