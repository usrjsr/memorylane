import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Capsule } from "@/models/Capsule";
import { Media } from "@/models/Media";
import { Comment } from "@/models/Comment";
import { Reaction } from "@/models/Reaction";
import { redirect } from "next/navigation";
import Link from "next/link";
import ReactionBar from "@/components/ReactionBar";
import CommentSection from "@/components/CommentSection";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UnlockedCapsulePage({ params }: Props) {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  await dbConnect();

  console.log("🔍 [UNLOCKED] Looking for capsule ID:", (await params).id);

  try {
    const { id } = await params;
    const capsule = await Capsule.findById(id);

    console.log("📦 [UNLOCKED] Query result:", capsule ? "Found" : "Not found");

    if (!capsule) {
      const allCapsules = await Capsule.find({}).select('_id title').limit(5).lean();
      console.log("📊 [UNLOCKED] Sample capsules in DB:", allCapsules);

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-900/40 border-2 border-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Capsule Not Found 🥲</h2>
            <p className="text-slate-400 mb-6">Looking for ID: {id}</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 text-slate-900 rounded-lg hover:bg-cyan-400 font-bold transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      );
    }

    const isRecipient = capsule.recipientEmails?.includes(session.user.email!);
    const isOwner = capsule.ownerId?.toString() === session.user.id;
    const isCollaborator = capsule.collaborators?.some(
      (cid: any) => cid?.toString() === session.user.id
    );

    console.log("🔐 [UNLOCKED] Access check:", {
      isOwner,
      isRecipient,
      isCollaborator,
      sessionUserId: session.user.id,
      capsuleOwnerId: capsule.ownerId?.toString()
    });

    if (!isRecipient && !isOwner && !isCollaborator) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-900/40 border-2 border-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Access Denied 🚫</h2>
            <p className="text-slate-400 mb-6">You don't have permission to view this capsule.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 text-slate-900 rounded-lg hover:bg-cyan-400 font-bold transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      );
    }

    const isUnlocked = capsule.status === "unlocked";
    const isPastUnlockDate = new Date(capsule.unlockDate) <= new Date();

    if (!isUnlocked && !isPastUnlockDate) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-cyan-900/40 border-2 border-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-4">⏳ Capsule Still Locked</h2>
            <p className="text-slate-400 mb-2">Expected unlock date:</p>
            <p className="text-2xl font-black text-cyan-400 mb-8">
              {new Date(capsule.unlockDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 text-slate-900 rounded-lg hover:bg-cyan-400 font-bold transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      );
    }

    const media = await Media.find({ capsuleId: capsule._id }).lean();
    console.log("🖼️ [UNLOCKED] Media files found:", media.length);

    let comments: any[] = [];
    let reactions: any[] = [];

    if (isUnlocked || isPastUnlockDate) {
      comments = await Comment.find({ capsuleId: capsule._id })
        .sort({ createdAt: -1 })
        .lean();

      reactions = await Reaction.find({ capsuleId: capsule._id }).lean();

      console.log("💬 [UNLOCKED] Interactions:", {
        comments: comments.length,
        reactions: reactions.length
      });
    }

    return (
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold mb-10 group transition-all duration-200"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-b-2 border-cyan-500/30 p-8 sm:p-10 lg:p-12">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                  {capsule.title}
                </h1>
                <p className="text-slate-400 text-lg mb-4">
                  Theme: {capsule.theme || "Other"}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/40 border-2 border-emerald-500 text-emerald-300 rounded-lg font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  🎉 Capsule Unlocked!
                </div>
              </div>
            </div>

            {capsule.description && (
              <div className="p-8 sm:p-10 lg:p-12">
                <div className="text-center max-w-3xl mx-auto">
                  <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {capsule.description}
                  </p>
                </div>
              </div>
            )}

            {media.length > 0 && (
              <div className="p-8 sm:p-10 lg:p-12 border-t border-cyan-500/20">
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-8 text-center">
                  📸 Memories & Media
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {media.map((file: any, i: number) => (
                    <div
                      key={i}
                      className="bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-200 group"
                    >
                      <div className="aspect-video bg-slate-700 overflow-hidden">
                        {file.fileType === "image" && (
                          <img
                            src={file.fileUrl}
                            alt={file.fileName || "Memory"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        {file.fileType === "video" && (
                          <video controls className="w-full h-full">
                            <source src={file.fileUrl} />
                            Your browser does not support video.
                          </video>
                        )}

                        {file.fileType === "audio" && (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/40 to-blue-900/40">
                            <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-bold text-white truncate">
                          {file.fileName || `File ${i + 1}`}
                        </p>
                        {file.fileType === "audio" && (
                          <audio controls className="w-full mt-3 h-8">
                            <source src={file.fileUrl} />
                            Your browser does not support audio.
                          </audio>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {media.length === 0 && (
              <div className="p-12 text-center border-t border-cyan-500/20">
                <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-400 text-lg">No media files in this capsule</p>
              </div>
            )}

            {(isUnlocked || isPastUnlockDate) && (
              <>
                <div className="border-t border-cyan-500/20 p-8 sm:p-10 lg:p-12">
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                    Share Your Reaction
                  </h2>
                  <p className="text-slate-400 mb-6">
                    How does this memory make you feel? React with an emoji!
                  </p>
                  <ReactionBar
                    capsuleId={capsule._id.toString()}
                    initialReactions={reactions}
                    userId={session.user.id}
                  />
                </div>

                <div className="border-t border-cyan-500/20 p-8 sm:p-10 lg:p-12">
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                    Reflections & Memories
                  </h2>
                  <p className="text-slate-400 mb-6">
                    Share your thoughts, memories, or reflections about this capsule.
                  </p>
                  <CommentSection
                    capsuleId={capsule._id.toString()}
                    initialComments={comments}
                    userId={session.user.id}
                  />
                </div>

                <div className="border-t border-cyan-500/20 p-8 sm:p-10 lg:p-12">
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-900/40 border-2 border-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">💬</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-medium">Reflections</p>
                        <p className="text-2xl font-black text-white">{comments.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-rose-900/40 border-2 border-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">❤️</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-medium">Reactions</p>
                        <p className="text-2xl font-black text-white">{reactions.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("💥 [UNLOCKED] Error:", error);
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-900/40 border-2 border-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Error Loading Capsule</h2>
          <p className="text-slate-400 mb-8">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 text-slate-900 rounded-lg hover:bg-cyan-400 font-bold transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
}