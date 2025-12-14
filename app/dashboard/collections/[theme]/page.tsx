// app/dashboard/collections/[theme]/page.tsx

import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CapsuleCard } from "@/components/CapsuleCard";

type Props = {
  params: Promise<{ theme: string }>;
};

export default async function ThemeCollectionPage({ params }: Props) {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  await dbConnect();

  const { theme } = await params;
  const decodedTheme = decodeURIComponent(theme);

  // Fetch capsules with this theme
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

  // Sanitize for client components
  const capsules = rawCapsules.map((c: any) => ({
    ...c,
    _id: c._id.toString(),
    ownerId: c.ownerId?.toString(),
    unlockDate: c.unlockDate?.toISOString(),
    createdAt: c.createdAt?.toISOString(),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/dashboard/collections" className="text-blue-600 hover:underline">
          ← Back to Collections
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">{decodedTheme}</h1>
      <p className="text-gray-600 mb-8">
        {capsules.length} capsule{capsules.length !== 1 ? "s" : ""} in this collection
      </p>

      {capsules.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capsules.map((capsule: any) => (
            <CapsuleCard key={capsule._id} capsule={capsule} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-xl">
          <p className="text-gray-500">No capsules in this theme yet.</p>
          <Link
            href="/create/capsule"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Create a new capsule →
          </Link>
        </div>
      )}
    </div>
  );
}