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

    const validRecipients = recipients.filter((r) => r.trim());
    if (validRecipients.length === 0) {
      toast.error("Please add at least one recipient");
      return;
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
          recipients: validRecipients,
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
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 space-y-4">
          <div className="w-20 h-20 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-amber-900">
            Create a Time Capsule
          </h1>
          <p className="text-amber-700 text-lg">
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
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-all shadow-md ${
                    step === s.step
                      ? "bg-amber-600 text-white shadow-lg scale-110"
                      : step > s.step
                      ? "bg-green-500 text-white"
                      : "bg-amber-100 text-amber-400 border-2 border-amber-200"
                  }`}
                >
                  {step > s.step ? "✓" : s.icon}
                </div>
                <p className="text-xs sm:text-sm mt-2 font-medium text-amber-900">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <div className="h-2 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
            <div
              className="h-full bg-amber-600 transition-all duration-500 shadow-sm"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border-2 border-amber-200">
          <div onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-amber-900 font-semibold"
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
                    className="border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="theme"
                    className="text-amber-900 font-semibold"
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
                    className="w-full p-3 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-amber-900 font-medium bg-white"
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
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="description"
                      className="text-amber-900 font-semibold"
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
                    className="resize-none border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600"
                  />
                </div>

                <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-amber-900">
                        💡 Need inspiration?
                      </p>
                      <p className="text-xs text-amber-700">
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
                      className="gap-2 bg-white hover:bg-amber-100 border-2 border-amber-300 text-amber-800"
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
                    <div className="mt-4 bg-white p-5 rounded-xl border-2 border-amber-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-sm text-amber-900">
                          📝 Click any idea to add it to your description:
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAiMemoryIdeas([])}
                          className="text-amber-400 hover:text-amber-600 h-6 w-6 p-0"
                        >
                          <X size={16} />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {aiMemoryIdeas.map((idea, index) => (
                          <div
                            key={index}
                            onClick={() => addIdeaToDescription(idea)}
                            className="group p-4 text-sm text-amber-800 bg-amber-50 rounded-xl cursor-pointer hover:bg-amber-100 transition-all duration-200 border-2 border-transparent hover:border-amber-300 hover:shadow-md"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                                💭
                              </span>
                              <span className="flex-1 font-medium">{idea}</span>
                              <span className="text-xs text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                                Click to add →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t-2 border-amber-100">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={fetchMemoryIdeas}
                          disabled={isLoadingIdeas}
                          className="text-amber-600 hover:text-amber-800 text-xs font-semibold"
                        >
                          🔄 Generate new ideas
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg h-12 text-base font-semibold"
                  onClick={() => setStep(2)}
                >
                  Next Step →
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <Label className="text-xl font-bold mb-4 block text-amber-900">
                    Upload Media (Photos, Videos, Audio)
                  </Label>
                  <p className="text-sm text-amber-700 mb-4">
                    Add up to 10 images, 5 videos, or 10 audio files
                  </p>

                  <div className="border-2 border-dashed border-amber-300 rounded-2xl p-10 bg-amber-50 hover:bg-amber-100 transition-colors">
                    <Input
                      type="file"
                      multiple
                      accept="image/*,video/*,audio/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="block w-full text-sm text-amber-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 file:shadow-md cursor-pointer"
                    />
                    {isUploading && (
                      <div className="flex items-center gap-2 mt-3">
                        <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                        <p className="text-sm text-amber-600 font-medium">
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
                        className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border-2 border-amber-200 hover:border-amber-300 transition-colors"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-bold text-amber-900">
                            <span className="inline-block px-2 py-1 bg-amber-600 text-white text-xs rounded-md mr-2">
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
                              className="mt-2 text-xs border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600"
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
                          className="text-red-500 hover:text-red-700 ml-3 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-2 border-amber-300 text-amber-800 hover:bg-amber-50 px-6"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg px-8"
                  >
                    Next: Recipients →
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <Label className="text-xl font-bold mb-3 block text-amber-900">
                    Unlock Date *
                  </Label>
                  <Input
                    type="date"
                    value={formData.unlockDate.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        unlockDate: new Date(e.target.value),
                      }))
                    }
                    className="text-base p-4 border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600"
                    required
                  />
                  <p className="text-sm text-amber-700 mt-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    This capsule will automatically unlock on this date
                  </p>
                </div>

                <div>
                  <Label className="text-xl font-bold mb-3 block text-amber-900">
                    Recipients (Email Addresses) *
                  </Label>
                  <p className="text-sm text-amber-700 mb-4">
                    Add email addresses of people who should receive this
                    capsule
                  </p>

                  <RecipientInput
                    recipients={recipients}
                    setRecipients={setRecipients}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full border-2 border-amber-300 text-amber-800 hover:bg-amber-50"
                  >
                    + Add Another Recipient
                  </Button>
                </div>

                <div>
                  <Label className="text-xl font-bold mb-3 block text-amber-900">
                    Collaborators (Optional)
                  </Label>
                  <p className="text-sm text-amber-700 mb-4">
                    Add email addresses of people who can contribute media and messages to this capsule
                  </p>

                  <CollaboratorInput
                    collaborators={collaborators}
                    setCollaborators={setCollaborators}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full border-2 border-blue-300 text-blue-800 hover:bg-blue-50"
                  >
                    + Add Another Collaborator
                  </Button>
                </div>

                <div className="flex justify-between gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="border-2 border-amber-300 text-amber-800 hover:bg-amber-50 px-6"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(4)}
                    className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg px-8"
                  >
                    Next: Review →
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200">
                  <p className="font-bold mb-4 text-xl text-amber-900 flex items-center gap-2">
                    📋 Capsule Summary
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <span className="text-xl">📝</span>
                      <div>
                        <strong className="text-amber-900">Title:</strong>
                        <p className="text-amber-700">
                          {formData.title || "Not set"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <span className="text-xl">📖</span>
                      <div>
                        <strong className="text-amber-900">Description:</strong>
                        <p className="text-amber-700">
                          {formData.description
                            ? `${formData.description.substring(0, 100)}...`
                            : "Not set"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <span className="text-xl">🖼️</span>
                      <div>
                        <strong className="text-amber-900">Media:</strong>
                        <p className="text-amber-700">
                          {formData.mediaFiles.length} files
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <span className="text-xl">👥</span>
                      <div>
                        <strong className="text-amber-900">Recipients:</strong>
                        <p className="text-amber-700">
                          {recipients.filter((r) => r.trim()).join(", ") ||
                            "None"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <span className="text-xl">🤝</span>
                      <div>
                        <strong className="text-amber-900">Collaborators:</strong>
                        <p className="text-amber-700">
                          {collaborators.filter((c) => c.trim()).join(", ") ||
                            "None"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <span className="text-xl">📅</span>
                      <div>
                        <strong className="text-amber-900">Unlock Date:</strong>
                        <p className="text-amber-700">
                          {format(formData.unlockDate, "PPP")}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <span className="text-xl">🎨</span>
                      <div>
                        <strong className="text-amber-900">Theme:</strong>
                        <p className="text-amber-700">{formData.theme}</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-between gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(3)}
                    className="border-2 border-amber-300 text-amber-800 hover:bg-amber-50 px-6"
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg px-8 font-bold"
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
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-amber-700 font-medium">
          <p>Step {step} of 4</p>
        </div>
      </div>
    </div>
  );
}
