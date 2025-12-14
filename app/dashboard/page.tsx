import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { CapsuleCard } from "@/components/CapsuleCard";
import Link from "next/link";
import mongoose from "mongoose";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  await dbConnect();

  let userId;
  try {
    userId = new mongoose.Types.ObjectId(session.user.id);
  } catch (e) {
    console.error("Invalid user ID format:", session.user.id);
    userId = session.user.id;
  }

  const capsules = await Capsule.find({
  $or: [
    { ownerId: userId },
    { collaborators: userId },
    { recipientEmails: session.user.email },
  ],
}).populate("ownerId", "name email")
  .sort({ createdAt: -1 });


  const serializedCapsules = capsules.map((capsule) => ({
    ...capsule.toObject(),
    _id: capsule._id.toString(),
    ownerId: capsule.ownerId
  ? {
      _id: capsule.ownerId._id.toString(),
      name: capsule.ownerId.name,
      email: capsule.ownerId.email,
    }
  : null,
    collaborators: capsule.collaborators?.map((c: any) => c.toString()),
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 text-center sm:text-left">
          Your Time Capsules
        </h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/create/capsule"
            className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 text-center font-medium shadow-md transition-colors duration-200"
          >
            + New Capsule
          </Link>

          <Link
            href="/dashboard/collections"
            className="bg-amber-700 text-white px-6 py-3 rounded-xl hover:bg-amber-800 text-center font-medium shadow-md transition-colors duration-200"
          >
            View Collection
          </Link>
        </div>
      </div>

      {serializedCapsules.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-amber-300 rounded-2xl bg-white">
          <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-amber-600"
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
          <h3 className="text-2xl font-bold mb-3 text-amber-900">
            No capsules yet
          </h3>
          <p className="text-amber-700 mb-6 text-lg">
            Create your first time capsule to preserve memories
          </p>
          <Link
            href="/create/capsule"
            className="inline-block bg-amber-600 text-white px-8 py-3 rounded-xl hover:bg-amber-700 font-medium shadow-md transition-colors duration-200"
          >
            Create Your First Capsule
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serializedCapsules.map((capsule) => (
            <CapsuleCard key={capsule._id} capsule={capsule} />
          ))}
        </div>
      )}
    </div>
  );
}
