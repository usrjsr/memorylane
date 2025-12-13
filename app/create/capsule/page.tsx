// app/create/capsule/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import Link from 'next/link';

type MediaFile = {
  url: string;
  type: 'image' | 'video' | 'audio' | 'pdf';
  name: string;
  key?: string;
};

export default function CreateCapsulePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unlockDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    recipients: [''],
    theme: 'Childhood',
    privacy: 'recipients-only' as 'private' | 'recipients-only' | 'public',
    mediaFiles: [] as MediaFile[],
  });

  const { startUpload, isUploading } = useUploadThing('capsuleUploader', {
    onClientUploadComplete: (files) => {
      console.log('✅ [UPLOAD] Complete:', files);

      if (files && files.length > 0) {
        const mappedFiles: MediaFile[] = files.map((f: any) => ({
          url: f.url,
          type: (f.serverData?.fileType ?? 'image') as MediaFile['type'],
          name: f.name,
          key: f.key,
        }));

        console.log('📦 [UPLOAD] Mapped files:', mappedFiles);

        setFormData((prev) => ({
          ...prev,
          mediaFiles: [...prev.mediaFiles, ...mappedFiles],
        }));

        toast.success(`${files.length} file(s) uploaded!`);
      }
    },
    onUploadError: (error) => {
      console.error('❌ [UPLOAD] Error:', error);
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log('📁 [FILE_INPUT] Files selected:', files.length);
    await startUpload(Array.from(files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validRecipients = formData.recipients.filter((r) => r.trim());
    if (validRecipients.length === 0) {
      toast.error('Please add at least one recipient');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/capsules/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          unlockDate: formData.unlockDate.toISOString(),
          recipients: validRecipients,
          mediaFiles: formData.mediaFiles,
          theme: formData.theme,
          privacy: formData.privacy,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Failed to create capsule');
      }

      toast.success('🎉 Capsule created successfully!');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('💥 [ERROR]', err);
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRecipient = () => {
    setFormData((prev) => ({
      ...prev,
      recipients: [...prev.recipients, ''],
    }));
  };

  const removeRecipient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index),
    }));
  };

  const updateRecipient = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.map((email, i) => (i === index ? value : email)),
    }));
  };

  const removeMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
    }));
  };

  const progressSteps = [
    { step: 1, label: 'Details', icon: '📝' },
    { step: 2, label: 'Media', icon: '🖼️' },
    { step: 3, label: 'Recipients', icon: '👥' },
    { step: 4, label: 'Review', icon: '✅' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create a Time Capsule
          </h1>
          <p className="text-gray-600">Preserve precious memories for the future</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {progressSteps.map((s) => (
              <div
                key={s.step}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  step >= s.step ? 'opacity-100' : 'opacity-50'
                }`}
                onClick={() => step >= s.step && setStep(s.step)}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${
                    step === s.step
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : step > s.step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step > s.step ? '✓' : s.icon}
                </div>
                <p className="text-xs mt-2 text-gray-700">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Title & Description */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <Label htmlFor="title" className="text-lg font-semibold mb-2 block">
                    Capsule Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g., Summer 2024 Memories"
                    className="text-lg p-3"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Give your capsule a meaningful name
                  </p>
                </div>

                <div>
                  <Label htmlFor="description" className="text-lg font-semibold mb-2 block">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Write about what makes this capsule special..."
                    rows={4}
                    className="text-base p-3"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Add context that will make opening this capsule more meaningful
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Next: Add Media →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Media Upload */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <Label className="text-lg font-semibold mb-4 block">
                    Upload Media (Photos, Videos, Audio)
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Add up to 10 images, 5 videos, or 10 audio files
                  </p>

                  <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                    <Input
                      type="file"
                      multiple
                      accept="image/*,video/*,audio/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {isUploading && (
                      <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                    )}
                  </div>
                </div>

                {/* Display uploaded files */}
                {formData.mediaFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-3">
                      📦 Uploaded Files ({formData.mediaFiles.length})
                    </h3>
                    <div className="space-y-2">
                      {formData.mediaFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Type: {file.type}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-3"
                            title="Remove file"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Next: Recipients →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Recipients & Date */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <Label className="text-lg font-semibold mb-2 block">
                    Unlock Date *
                  </Label>
                  <Input
                    type="date"
                    value={formData.unlockDate.toISOString().split('T')[0]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        unlockDate: new Date(e.target.value),
                      }))
                    }
                    className="text-base p-3"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This capsule will automatically unlock on this date
                  </p>
                </div>

                <div>
                  <Label className="text-lg font-semibold mb-3 block">
                    Recipients (Email Addresses) *
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Add email addresses of people who should receive this capsule
                  </p>

                  <div className="space-y-3">
                    {formData.recipients.map((email, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => updateRecipient(index, e.target.value)}
                          placeholder="recipient@example.com"
                          className="flex-1 text-base p-3"
                          required
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeRecipient(index)}
                            className="px-3"
                          >
                            <X size={18} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addRecipient}
                    className="mt-3 w-full"
                  >
                    + Add Another Recipient
                  </Button>
                </div>

                <div className="flex justify-between gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(4)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Next: Review →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Theme & Submit */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    value={formData.theme}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, theme: e.target.value }))
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="Childhood">Childhood</option>
                    <option value="Family History">Family History</option>
                    <option value="College Years">College Years</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="font-semibold mb-3">Summary:</p>
                  <ul className="space-y-2 text-sm">
                    <li>📝 <strong>Title:</strong> {formData.title || 'Not set'}</li>
                    <li>🖼️ <strong>Media:</strong> {formData.mediaFiles.length} files</li>
                    <li>👥 <strong>Recipients:</strong> {formData.recipients.filter(r => r).length} people</li>
                    <li>📅 <strong>Unlock Date:</strong> {format(formData.unlockDate, 'PPP')}</li>
                    <li>🎨 <strong>Theme:</strong> {formData.theme}</li>
                  </ul>
                </div>

                <div className="flex justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(3)}
                  >
                    ← Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? 'Creating...' : '🎉 Create Capsule'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Step {step} of 4</p>
        </div>
      </div>
    </div>
  );
}