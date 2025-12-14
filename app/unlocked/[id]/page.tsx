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
        <div className="text-center py-10">
          <h2 className="text-xl font-bold text-red-600">Capsule not found 🥲</h2>
          <p className="text-gray-600 mt-2">Looking for ID: {id}</p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Available capsules:</p>
            {allCapsules.map((c: any) => (
              <div key={c._id.toString()} className="mt-2">
                <Link
                  href={`/unlocked/${c._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {c.title} (ID: {c._id.toString()})
                </Link>
              </div>
            ))}
          </div>
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
      );
    }

    // Access checks
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
        <div className="text-center py-10">
          <h2 className="text-xl font-bold text-red-600">Access denied 🚫</h2>
          <p className="text-gray-600 mt-2">You don't have permission to view this capsule.</p>
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
      );
    }

    const isUnlocked = capsule.status === "unlocked";
    const isPastUnlockDate = new Date(capsule.unlockDate) <= new Date();

    if (!isUnlocked && !isPastUnlockDate) {
      return (
        <div className="text-center py-10">
          <h2 className="text-xl font-bold mb-2">⏳ This capsule is still locked</h2>
          <p>Expected unlock date:</p>
          <p className="font-semibold text-blue-600 mt-1">
            {new Date(capsule.unlockDate).toLocaleDateString()}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Debug info:</p>
            <p>Status: {capsule.status}</p>
            <p>Current time: {new Date().toISOString()}</p>
            <p>Unlock time: {capsule.unlockDate}</p>
          </div>
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
      );
    }

    // Fetch media files
    const media = await Media.find({ capsuleId: capsule._id }).lean();
    console.log("🖼️ [UNLOCKED] Media files found:", media.length);

    // Fetch post-unlock interactions (only if unlocked)
    // FIX: Explicitly type these variables to resolve TS error 7034
    let comments: any[] = [];
    let reactions: any[] = [];

    if (isUnlocked || isPastUnlockDate) {
      // Fetch comments
      comments = await Comment.find({ capsuleId: capsule._id })
        .sort({ createdAt: -1 })
        .lean();

      // Fetch reactions
      reactions = await Reaction.find({ capsuleId: capsule._id }).lean();

      console.log("💬 [UNLOCKED] Interactions:", {
        comments: comments.length,
        reactions: reactions.length
      });
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-4">
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

        <h1 className="text-4xl font-bold text-center mb-4">{capsule.title}</h1>
        <p className="text-center text-gray-600 mb-1 italic">
          Theme: {capsule.theme || "Other"}
        </p>
        <p className="text-center text-sm text-green-600 font-semibold mb-6">
          🎉 This capsule has been {isUnlocked ? 'unlocked' : 'available to view'}!
        </p>

        {capsule.description && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-gray-700">{capsule.description}</p>
          </div>
        )}

        {media.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {media.map((file: any, i: number) => (
              <div
                key={i}
                className="border rounded-lg p-4 shadow-md bg-white"
              >
                <p className="text-sm font-medium truncate mb-2">
                  {file.fileName || `File ${i + 1}`}
                </p>
                <div className="mt-2">
                  {file.fileType === "image" && (
                    <img
                      src={file.fileUrl}
                      alt={file.fileName || "Memory"}
                      className="rounded-md w-full h-48 object-cover"
                    />
                  )}

                  {file.fileType === "video" && (
                    <video controls className="w-full rounded-md">
                      <source src={file.fileUrl} />
                      Your browser does not support video.
                    </video>
                  )}

                  {file.fileType === "audio" && (
                    <audio controls className="w-full">
                      <source src={file.fileUrl} />
                      Your browser does not support audio.
                    </audio>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">No media files in this capsule</p>
          </div>
        )}

        {/* POST-UNLOCK INTERACTIONS SECTION */}
        {(isUnlocked || isPastUnlockDate) && (
          <div className="mt-12 pt-8 border-t">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Share Your Reaction</h2>
              <p className="text-gray-600 mb-4">
                How does this memory make you feel? React with an emoji!
              </p>
              <ReactionBar
                capsuleId={capsule._id.toString()}
                initialReactions={reactions}
                userId={session.user.id}
              />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Reflections & Memories</h2>
              <p className="text-gray-600 mb-4">
                Share your thoughts, memories, or reflections about this capsule.
              </p>
              <CommentSection
                capsuleId={capsule._id.toString()}
                initialComments={comments}
                userId={session.user.id}
              />
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <span>{comments.length} reflection{comments.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">❤️</span>
                <span>{reactions.length} reaction{reactions.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}

        {/* Debug info (remove in production) */}
        <div className="mt-12 pt-6 border-t text-xs text-gray-400">
          <p>Debug: Capsule ID: {capsule._id.toString()}</p>
          <p>Unlock Date: {new Date(capsule.unlockDate).toLocaleString()}</p>
          <p>Current Time: {new Date().toLocaleString()}</p>
          <p>Status: {capsule.status}</p>
          <p>Can Interact: {(isUnlocked || isPastUnlockDate) ? "Yes" : "No"}</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("💥 [UNLOCKED] Error:", error);
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold text-red-600">Error loading capsule</h2>
        <p className="text-gray-600 mt-2">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <p className="text-sm text-gray-500 mt-2">ID: {(await params).id}</p>
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
    );
  }
}