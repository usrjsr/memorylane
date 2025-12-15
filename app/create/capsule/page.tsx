"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { X, Loader2 } from "lucide-react";
import Link from "next/link";
import { AiAssistant } from "@/components/AiAssistant";
import RecipientInput from "@/components/RecipientInput";
import CollaboratorInput from "@/components/CollaboratorInput";

type MediaFile = {
  url: string;
  type: "image" | "video" | "audio" | "pdf";
  name: string;
  key?: string;
  caption?: string;
};

export default function CreateCapsulePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [aiMemoryIdeas, setAiMemoryIdeas] = useState<string[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    unlockDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    theme: "Childhood",
    privacy: "recipients-only" as "private" | "recipients-only" | "public",
    mediaFiles: [] as MediaFile[],
    unlockHour: "09",
    unlockMinute: "00",
  });

  const { startUpload, isUploading } = useUploadThing("capsuleUploader", {
    onClientUploadComplete: (files) => {
      console.log("✅ [UPLOAD] Complete:", files);

      if (files && files.length > 0) {
        const mappedFiles: MediaFile[] = files.map((f: any) => ({
          url: f.url,
          type: (f.serverData?.fileType ?? "image") as MediaFile["type"],
          name: f.name,
          key: f.key,
          caption: "",
        }));

        console.log("📦 [UPLOAD] Mapped files:", mappedFiles);

        setFormData((prev) => ({
          ...prev,
          mediaFiles: [...prev.mediaFiles, ...mappedFiles],
        }));

        toast.success(`${files.length} file(s) uploaded!`);
      }
    },
    onUploadError: (error) => {
      console.error("❌ [UPLOAD] Error:", error);
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log("📁 [FILE_INPUT] Files selected:", files.length);
    await startUpload(Array.from(files));
  };

  const parseAiIdeas = (rawText: string): string[] => {
    console.log("[parseAiIdeas] Raw text:", rawText);

    const lines = rawText.split("\n");

    const parsed = lines
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        return line
          .replace(/^[-*•]\s*/, "")
          .replace(/^\d+[.)]\s*/, "")
          .replace(/^\*\*(.+?)\*\*:?\s*/, "$1: ")
          .replace(/^#+\s*/, "")
          .trim();
      })
      .filter((line) => line.length > 5);

    console.log("[parseAiIdeas] Parsed ideas:", parsed);

    if (parsed.length === 0) {
      return [rawText.trim()];
    }

    return parsed.slice(0, 7);
  };

  const fetchMemoryIdeas = async () => {
    setIsLoadingIdeas(true);
    try {
      const response = await fetch("/api/capsules/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "suggest-ideas",
          theme: formData.theme,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Failed to get ideas");
      }

      const data = await response.json();
      console.log("[fetchMemoryIdeas] Response:", data);

      const ideas = parseAiIdeas(data.result);
      setAiMemoryIdeas(ideas);
      toast.success(`Generated ${ideas.length} memory ideas!`);
    } catch (error) {
      console.error("[fetchMemoryIdeas] Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to get ideas"
      );
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  const addIdeaToDescription = (idea: string) => {
    setFormData((prev) => ({
      ...prev,
      description: prev.description
        ? `${prev.description}\n\n• ${idea}`
        : `• ${idea}`,
    }));
    toast.success("Idea added to description!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.privacy !== "private") {
      const validRecipients = recipients.filter((r) => r.trim());
      if (validRecipients.length === 0) {
        toast.error("Please add at least one recipient");
        return;
      }
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/capsules/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          unlockDate: formData.unlockDate.toISOString(),
          recipients: recipients.filter((r) => r.trim()),
          collaborators: collaborators.filter((c) => c.trim()),
          mediaFiles: formData.mediaFiles,
          theme: formData.theme,
          privacy: formData.privacy,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.details || result.error || "Failed to create capsule"
        );
      }

      toast.success("🎉 Capsule created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("💥 [ERROR]", err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
    }));
  };

  const progressSteps = [
    { step: 1, label: "Details", icon: "📝" },
    { step: 2, label: "Media", icon: "🖼️" },
    { step: 3, label: "Recipients", icon: "👥" },
    { step: 4, label: "Review", icon: "✅" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/50">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            Create a Time Capsule
          </h1>
          <p className="text-slate-400 text-lg">
            Preserve precious memories for the future
          </p>
        </div>

        <div className="mb-10">
          <div className="flex justify-between mb-6 px-2">
            {progressSteps.map((s) => (
              <div
                key={s.step}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  step >= s.step ? "opacity-100" : "opacity-40"
                }`}
                onClick={() => step >= s.step && setStep(s.step)}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all shadow-md ${
                    step === s.step
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50 scale-110"
                      : step > s.step
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-800 text-slate-400 border-2 border-slate-700"
                  }`}
                >
                  {step > s.step ? "✓" : s.icon}
                </div>
                <p className="text-xs sm:text-sm mt-2 font-bold text-slate-300">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 shadow-lg shadow-cyan-500/50"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 sm:p-10 border-2 border-cyan-500/30">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-white font-bold text-lg"
                  >
                    Capsule Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Letters to my 2030 self"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="theme"
                    className="text-white font-bold text-lg"
                  >
                    Theme
                  </Label>
                  <select
                    id="theme"
                    value={formData.theme}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        theme: e.target.value,
                      }));
                      setAiMemoryIdeas([]);
                    }}
                    className="w-full p-3 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white bg-slate-800 font-medium"
                  >
                    <option value="Childhood">Childhood</option>
                    <option value="Family History">Family History</option>
                    <option value="College Years">College Years</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Travel Adventures">Travel Adventures</option>
                    <option value="Career Milestones">Career Milestones</option>
                    <option value="Friendship">Friendship</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="privacy"
                    className="text-white font-bold text-lg"
                  >
                    Privacy Level
                  </Label>
                  <select
                    id="privacy"
                    value={formData.privacy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        privacy: e.target.value as
                          | "private"
                          | "recipients-only"
                          | "public",
                      })
                    }
                    className="w-full p-3 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white bg-slate-800 font-medium"
                  >
                    <option value="private">Private (Only you)</option>
                    <option value="recipients-only">Recipients Only</option>
                    <option value="public">Public</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-2">
                    {formData.privacy === "private" &&
                      "Only you can view this capsule."}
                    {formData.privacy === "recipients-only" &&
                      "Only you and recipients can view this capsule."}
                    {formData.privacy === "public" &&
                      "Anyone can view this capsule."}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="description"
                      className="text-white font-bold text-lg"
                    >
                      The Story / Description
                    </Label>
                    {formData.description.trim().length > 10 && (
                      <AiAssistant
                        action="enhance"
                        text={formData.description}
                        onResult={(enhancedText) => {
                          setFormData((prev) => ({
                            ...prev,
                            description: enhancedText,
                          }));
                          toast.success("Description enhanced!");
                        }}
                        buttonText="✨ Enhance"
                        variant="ghost"
                        size="sm"
                      />
                    )}
                  </div>
                  <Textarea
                    id="description"
                    placeholder="What memories will this capsule hold? What story do you want to tell?"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={5}
                    className="resize-none border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>

                <div className="bg-cyan-900/20 p-6 rounded-2xl border-2 border-cyan-500/40">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-cyan-300">
                        💡 Need inspiration?
                      </p>
                      <p className="text-xs text-cyan-400">
                        Get AI-powered memory ideas for your "{formData.theme}"
                        capsule
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fetchMemoryIdeas}
                      disabled={isLoadingIdeas}
                      className="gap-2 bg-slate-800 hover:bg-slate-700 border-2 border-cyan-500/50 text-cyan-300"
                    >
                      {isLoadingIdeas ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>✨ Get Memory Ideas</>
                      )}
                    </Button>
                  </div>

                  {aiMemoryIdeas.length > 0 && (
                    <div className="mt-4 bg-slate-800/50 p-5 rounded-xl border-2 border-slate-700/50 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-sm text-cyan-300">
                          📝 Click any idea to add it to your description:
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAiMemoryIdeas([])}
                          className="text-slate-400 hover:text-white h-6 w-6 p-0"
                        >
                          <X size={16} />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {aiMemoryIdeas.map((idea, index) => (
                          <div
                            key={index}
                            onClick={() => addIdeaToDescription(idea)}
                            className="group p-4 text-sm text-slate-300 bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-700 transition-all duration-200 border-2 border-transparent hover:border-cyan-500/50 hover:shadow-md"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                                💭
                              </span>
                              <span className="flex-1 font-medium">{idea}</span>
                              <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                                Click to add →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t-2 border-slate-700">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={fetchMemoryIdeas}
                          disabled={isLoadingIdeas}
                          className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold"
                        >
                          🔄 Generate new ideas
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg hover:shadow-cyan-500/50 h-12 sm:h-14 text-sm sm:text-base font-bold"
                  onClick={() => setStep(2)}
                >
                  Next Step →
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <Label className="text-xl font-black mb-4 block text-white">
                    Upload Media (Photos, Videos, Audio)
                  </Label>
                  <p className="text-sm text-slate-400 mb-4">
                    Add up to 10 images, 5 videos, or 10 audio files
                  </p>

                  <div className="border-2 border-dashed border-cyan-500/50 rounded-2xl p-10 bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    <Input
                      type="file"
                      multiple
                      accept="image/*,video/*,audio/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="block w-full text-sm text-slate-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-slate-900 hover:file:bg-cyan-400 file:shadow-md cursor-pointer"
                    />
                    {isUploading && (
                      <div className="flex items-center gap-2 mt-3">
                        <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
                        <p className="text-sm text-cyan-400 font-medium">
                          Uploading...
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {formData.mediaFiles.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 mt-6">
                    {formData.mediaFiles.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border-2 border-slate-700/50 hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-bold text-white">
                            <span className="inline-block px-2 py-1 bg-cyan-500 text-slate-900 text-xs rounded-md mr-2 font-black">
                              {file.type.toUpperCase()}
                            </span>
                            {file.name}
                          </span>

                          {file.caption ? (
                            <Textarea
                              value={file.caption}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  mediaFiles: prev.mediaFiles.map((f, idx) =>
                                    idx === i
                                      ? { ...f, caption: e.target.value }
                                      : f
                                  ),
                                }));
                              }}
                              rows={2}
                              className="mt-2 text-xs border-2 border-slate-700 bg-slate-700/50 text-slate-200 focus:border-cyan-500 focus:ring-cyan-500"
                              placeholder="Edit caption..."
                            />
                          ) : (
                            <div className="mt-2">
                              <AiAssistant
                                action="generate-caption"
                                text={file.name}
                                onResult={(caption) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    mediaFiles: prev.mediaFiles.map((f, idx) =>
                                      idx === i ? { ...f, caption } : f
                                    ),
                                  }));
                                  toast.success(
                                    `Caption generated for ${file.name}!`
                                  );
                                }}
                                buttonText="Generate Caption"
                                variant="ghost"
                                size="sm"
                              />
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeMedia(i)}
                          className="text-red-500 hover:text-red-400 ml-3 p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="text-cyan-400 hover:text-cyan-300 font-bold h-12 sm:h-auto px-4 sm:px-6"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg hover:shadow-cyan-500/50 px-4 sm:px-8 font-bold h-12 sm:h-auto text-sm sm:text-base"
                  >
                    Next: Recipients →
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <Label className="text-xl font-black mb-3 block text-white">
                    Unlock Date & Time *
                  </Label>
                  <div className="space-y-3">
                    <Input
                      type="date"
                      value={formData.unlockDate.toISOString().split("T")[0]}
                      onChange={(e) => {
                        const dateStr = e.target.value;
                        const date = new Date(dateStr);
                        date.setHours(
                          parseInt(formData.unlockHour),
                          parseInt(formData.unlockMinute)
                        );
                        setFormData((prev) => ({
                          ...prev,
                          unlockDate: date,
                        }));
                      }}
                      className="text-base p-4 border-2 border-slate-700 bg-slate-800 text-white focus:border-cyan-500 focus:ring-cyan-500"
                      required
                    />
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Label className="text-sm text-slate-300 font-medium mb-1 block">
                          Hour
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="23"
                          value={formData.unlockHour}
                          onChange={(e) => {
                            const hour = e.target.value.padStart(2, "0");
                            const date = new Date(formData.unlockDate);
                            date.setHours(
                              parseInt(hour),
                              parseInt(formData.unlockMinute)
                            );
                            setFormData((prev) => ({
                              ...prev,
                              unlockHour: hour,
                              unlockDate: date,
                            }));
                          }}
                          className="text-base p-3 border-2 border-slate-700 bg-slate-800 text-white focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm text-slate-300 font-medium mb-1 block">
                          Minute
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={formData.unlockMinute}
                          onChange={(e) => {
                            const minute = e.target.value.padStart(2, "0");
                            const date = new Date(formData.unlockDate);
                            date.setHours(
                              parseInt(formData.unlockHour),
                              parseInt(minute)
                            );
                            setFormData((prev) => ({
                              ...prev,
                              unlockMinute: minute,
                              unlockDate: date,
                            }));
                          }}
                          className="text-base p-3 border-2 border-slate-700 bg-slate-800 text-white focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    This capsule will automatically unlock on this date
                  </p>
                </div>

                {formData.privacy !== "private" && (
                  <>
                    <div>
                      <Label className="text-xl font-black mb-3 block text-white">
                        Recipients (Email Addresses) *
                      </Label>
                      <p className="text-sm text-slate-400 mb-4">
                        Add email addresses of people who should receive this
                        capsule
                      </p>

                      <RecipientInput
                        recipients={recipients}
                        setRecipients={setRecipients}
                      />
                    </div>

                    <div>
                      <Label className="text-xl font-black mb-3 block text-white">
                        Collaborators (Optional)
                      </Label>
                      <p className="text-sm text-slate-400 mb-4">
                        Add email addresses of people who can contribute media
                        and messages to this capsule
                      </p>

                      <CollaboratorInput
                        collaborators={collaborators}
                        setCollaborators={setCollaborators}
                      />
                    </div>
                  </>
                )}

                {formData.privacy === "private" && (
                  <div className="bg-indigo-900/20 border-2 border-indigo-500/40 rounded-xl p-4">
                    <p className="text-sm text-indigo-300 font-semibold flex items-center gap-2">
                      <span>ℹ️</span>
                      This is a private capsule. Recipients and collaborators
                      are not needed.
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(2)}
                    className="text-cyan-400 hover:text-cyan-300 font-bold h-12 sm:h-auto px-4 sm:px-6"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(4)}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg hover:shadow-cyan-500/50 px-4 sm:px-8 font-bold h-12 sm:h-auto text-sm sm:text-base"
                  >
                    Next: Review →
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-cyan-900/20 p-6 rounded-2xl border-2 border-cyan-500/40">
                  <p className="font-black mb-4 text-xl text-cyan-300 flex items-center gap-2">
                    📋 Capsule Summary
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-xl">📝</span>
                      <div>
                        <strong className="text-white">Title:</strong>
                        <p className="text-slate-400">
                          {formData.title || "Not set"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-xl">📖</span>
                      <div>
                        <strong className="text-white">Description:</strong>
                        <p className="text-slate-400">
                          {formData.description
                            ? `${formData.description.substring(0, 100)}...`
                            : "Not set"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-xl">🖼️</span>
                      <div>
                        <strong className="text-white">Media:</strong>
                        <p className="text-slate-400">
                          {formData.mediaFiles.length} files
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-xl">👥</span>
                      <div>
                        <strong className="text-white">Recipients:</strong>
                        <p className="text-slate-400">
                          {recipients.filter((r) => r.trim()).join(", ") ||
                            "None"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-xl">🤝</span>
                      <div>
                        <strong className="text-white">
                          Collaborators:
                        </strong>
                        <p className="text-slate-400">
                          {collaborators.filter((c) => c.trim()).join(", ") ||
                            "None"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-xl">📅</span>
                      <div>
                        <strong className="text-white">
                          Unlock Date & Time:
                        </strong>
                        <p className="text-slate-400">
                          {format(formData.unlockDate, "PPP")} at{" "}
                          {formData.unlockHour}:{formData.unlockMinute}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-xl">🎨</span>
                      <div>
                        <strong className="text-white">Theme:</strong>
                        <p className="text-slate-400">{formData.theme}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-xl">🔒</span>
                      <div>
                        <strong className="text-white">Privacy:</strong>
                        <p className="text-slate-400">
                          {formData.privacy === "private" &&
                            "Private (Only you)"}
                          {formData.privacy === "recipients-only" &&
                            "Recipients Only"}
                          {formData.privacy === "public" && "Public"}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(3)}
                    className="text-cyan-400 hover:text-cyan-300 font-bold h-12 sm:h-auto px-4 sm:px-6"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/50 px-4 sm:px-8 font-bold h-12 sm:h-auto text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "🎉 Create Capsule"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="text-center mt-8 text-sm text-slate-400 font-medium">
          <p>Step {step} of 4</p>
        </div>
      </div>
    </div>
  );
}