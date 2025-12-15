"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, Upload } from "lucide-react";
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/50">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Add Media to Capsule
          </h1>
          <p className="text-slate-400 text-lg">
            Upload photos, videos, or audio files to enrich your memories
          </p>
        </div>

        <div className="space-y-8 bg-slate-900 rounded-2xl p-8 sm:p-10 border-2 border-cyan-500/30 shadow-2xl">
          <div className="border-2 border-dashed border-cyan-500/50 rounded-2xl p-10 sm:p-12 bg-slate-800/50 hover:bg-slate-800 hover:border-cyan-400 transition-all duration-300 group">
            <Input
              type="file"
              multiple
              accept="image/*,video/*,audio/*,application/pdf"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-slate-900 hover:file:bg-cyan-400 file:shadow-md file:cursor-pointer cursor-pointer"
            />
            <p className="text-center text-slate-500 text-sm mt-4 font-medium">
              Drag and drop files here or click to select
            </p>
            {isUploading && (
              <div className="flex items-center justify-center gap-3 mt-5">
                <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                <p className="text-sm text-cyan-400 font-semibold">Uploading your memories...</p>
              </div>
            )}
          </div>

          {mediaFiles.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-cyan-500/20 border-2 border-cyan-500 rounded-full flex items-center justify-center text-sm font-bold text-cyan-400">
                  {mediaFiles.length}
                </span>
                File{mediaFiles.length !== 1 ? "s" : ""} Selected
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {mediaFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 sm:p-5 bg-slate-800/50 rounded-xl border-2 border-slate-700/50 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 rounded-md text-xs font-black whitespace-nowrap">
                        {file.type.toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold text-slate-200 truncate">
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-red-400 hover:text-red-300 ml-3 p-2 hover:bg-red-900/30 rounded-lg transition-all flex-shrink-0"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || mediaFiles.length === 0}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg hover:shadow-cyan-500/50 h-12 sm:h-14 font-bold text-base sm:text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Saving Memories...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Add {mediaFiles.length > 0 ? `${mediaFiles.length} File${mediaFiles.length !== 1 ? 's' : ''}` : 'Media'}
              </>
            )}
          </Button>

          {mediaFiles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm font-medium">
                Upload at least one file to continue
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-slate-800/30 border-2 border-slate-700/50 rounded-xl">
          <p className="text-sm text-slate-400">
            <span className="font-bold text-slate-300">Supported formats:</span> JPG, PNG, GIF, MP4, WebM, MP3, WAV, PDF
          </p>
        </div>
      </div>
    </div>
  );
}