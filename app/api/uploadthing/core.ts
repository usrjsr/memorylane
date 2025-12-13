import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuthSession } from "@/lib/auth";

const f = createUploadthing();

function normalizeType(mime?: string): "image" | "video" | "audio" | "pdf" {
  if (!mime) return "image";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "pdf";
  return "image";
}

export const ourFileRouter = {
  // Use ONE endpoint name everywhere
  capsuleUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
    video: { maxFileSize: "128MB", maxFileCount: 5 },
    audio: { maxFileSize: "32MB", maxFileCount: 10 },
    pdf: { maxFileSize: "16MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const session = await getAuthSession();
      if (!session?.user?.id) throw new Error("Unauthorized");
      return { userId: session.user.id, email: session.user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileType = normalizeType(file.type);

      console.log("✅ [UPLOADTHING] Uploaded", {
        userId: metadata.userId,
        name: file.name,
        url: file.url,
        mime: file.type,
        fileType,
        key: file.key,
      });

      // This becomes available on client as `serverData`
      return {
        fileType,
        uploadedBy: metadata.userId,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;