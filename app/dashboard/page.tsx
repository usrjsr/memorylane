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
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="mb-12 lg:mb-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
                  Your Time Capsules
                </h1>
                <p className="text-slate-400 text-lg font-medium">
                  Preserve your most precious moments for the future
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-900/40 border-2 border-cyan-500 rounded-lg">
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-cyan-300 font-bold text-sm sm:text-base">
                  {serializedCapsules.length} Active
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/create/capsule"
                className="flex-1 sm:flex-none px-8 py-4 bg-cyan-500 text-slate-900 rounded-lg hover:bg-cyan-400 font-bold text-center text-base transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:shadow-2xl transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Capsule
                </span>
              </Link>

              <Link
                href="/dashboard/collections"
                className="flex-1 sm:flex-none px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-bold text-center text-base transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 hover:shadow-2xl transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Collections
                </span>
              </Link>
            </div>
          </div>
        </div>

        {serializedCapsules.length === 0 ? (
          <div className="text-center py-20 sm:py-24 border-2 border-dashed border-cyan-500/50 rounded-2xl bg-slate-900/50 backdrop-blur-sm">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-cyan-900/60 to-indigo-900/60 rounded-2xl flex items-center justify-center mx-auto mb-8 border-2 border-cyan-500/30">
              <svg className="w-14 h-14 sm:w-20 sm:h-20 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
              No Time Capsules Yet
            </h3>
            <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
              Start preserving your precious memories by creating your first digital time capsule today
            </p>
            <Link
              href="/create/capsule"
              className="inline-block px-10 py-4 bg-cyan-500 text-slate-900 rounded-lg hover:bg-cyan-400 font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              Create Your First Capsule
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {serializedCapsules.map((capsule) => (
              <CapsuleCard key={capsule._id} capsule={capsule} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}