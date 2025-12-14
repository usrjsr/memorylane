"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2 } from "lucide-react";
import { Media } from "@/models/Media";

type MediaFile = {
  url: string;
  type: "image" | "video" | "audio" | "pdf";
  name: string;
  key?: string;
};

export default function CapsuleUploadPage() {
  const router = useRouter();
  const params = useParams();
  const capsuleId = params.id;

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { startUpload, isUploading } = useUploadThing("capsuleUploader", {
    onClientUploadComplete: (files) => {
      if (!files || files.length === 0) return;

      const mappedFiles: MediaFile[] = files.map((f: any) => ({
        url: f.url,
        type: (f.serverData?.fileType ?? "image") as MediaFile["type"],
        name: f.name,
        key: f.key,
      }));

      setMediaFiles((prev) => [...prev, ...mappedFiles]);
      toast.success(`${files.length} file(s) uploaded!`);
    },
    onUploadError: (err) => {
      console.error("Upload Error:", err);
      toast.error("Upload failed");
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await startUpload(Array.from(files));
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (mediaFiles.length === 0) {
      toast.error("Please upload at least one file");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/capsules/uploadmedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          capsuleId,
          mediaFiles,
        }),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res?.details || "Upload failed");
      }

      toast.success("Media added successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">Add Media to Capsule</h1>

      <div className="w-full max-w-3xl space-y-6 bg-white rounded-2xl p-8 border-2 border-amber-200 shadow-lg">
        <div className="border-2 border-dashed border-amber-300 rounded-2xl p-10 bg-amber-50 hover:bg-amber-100 transition-colors">
          <Input
            type="file"
            multiple
            accept="image/*,video/*,audio/*,application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-amber-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 file:shadow-md cursor-pointer"
          />
          {isUploading && (
            <div className="flex items-center gap-2 mt-3">
              <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
              <p className="text-sm text-amber-600 font-medium">Uploading...</p>
            </div>
          )}
        </div>

        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-1 gap-3 mt-4">
            {mediaFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border-2 border-amber-200 hover:border-amber-300 transition-colors"
              >
                <span className="text-sm font-bold text-amber-900">
                  [{file.type.toUpperCase()}] {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-red-500 hover:text-red-700 ml-3 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || mediaFiles.length === 0}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg h-12 font-bold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Add Media"
          )}
        </Button>
      </div>
    </div>
  );
}
