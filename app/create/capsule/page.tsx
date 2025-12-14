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
import { X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AiAssistant } from '@/components/AiAssistant';
import RecipientInput from '@/components/RecipientInput';

type MediaFile = {
  url: string;
  type: 'image' | 'video' | 'audio' | 'pdf';
  name: string;
  key?: string;
  caption?: string;
};

export default function CreateCapsulePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Separate state for recipients managed by RecipientInput
const [recipients, setRecipients] = useState<string[]>([]);
  
  const [aiMemoryIdeas, setAiMemoryIdeas] = useState<string[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unlockDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
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
          caption: '',
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

  
  const parseAiIdeas = (rawText: string): string[] => {
    console.log("[parseAiIdeas] Raw text:", rawText);
    
    
    const lines = rawText.split('\n');
    
    const parsed = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        
        return line
          .replace(/^[-*•]\s*/, '')        
          .replace(/^\d+[.)]\s*/, '')      
          .replace(/^\*\*(.+?)\*\*:?\s*/, '$1: ') 
          .replace(/^#+\s*/, '')           
          .trim();
      })
      .filter(line => line.length > 5);   
    
    console.log("[parseAiIdeas] Parsed ideas:", parsed);
    
    
    if (parsed.length === 0) {
      return [rawText.trim()];
    }
    
    return parsed.slice(0, 7); 
  };


  const fetchMemoryIdeas = async () => {
    setIsLoadingIdeas(true);
    try {
      const response = await fetch('/api/capsules/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'suggest-ideas', 
          theme: formData.theme 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to get ideas');
      }

      const data = await response.json();
      console.log("[fetchMemoryIdeas] Response:", data);
      
      const ideas = parseAiIdeas(data.result);
      setAiMemoryIdeas(ideas);
      toast.success(`Generated ${ideas.length} memory ideas!`);
    } catch (error) {
      console.error('[fetchMemoryIdeas] Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get ideas');
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  
  const addIdeaToDescription = (idea: string) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description
        ? `${prev.description}\n\n• ${idea}`
        : `• ${idea}`,
    }));
    toast.success('Idea added to description!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use recipients state from RecipientInput
    const validRecipients = recipients.filter((r) => r.trim());
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
          recipients: validRecipients, // Use the recipients state
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
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create a Time Capsule
          </h1>
          <p className="text-gray-600">Preserve precious memories for the future</p>
        </div>

        
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

        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title">Capsule Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Letters to my 2030 self"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    value={formData.theme}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, theme: e.target.value }));
                      
                      setAiMemoryIdeas([]);
                    }}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    <Label htmlFor="description">The Story / Description</Label>
                    {formData.description.trim().length > 10 && (
                      <AiAssistant
                        action="enhance"
                        text={formData.description}
                        onResult={(enhancedText) => {
                          setFormData(prev => ({ ...prev, description: enhancedText }));
                          toast.success('Description enhanced!');
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
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="resize-none"
                  />
                </div>
                
                
                <div className="bg-linear-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-indigo-900">
                        💡 Need inspiration?
                      </p>
                      <p className="text-xs text-indigo-600">
                        Get AI-powered memory ideas for your "{formData.theme}" capsule
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fetchMemoryIdeas}
                      disabled={isLoadingIdeas}
                      className="gap-2 bg-white hover:bg-indigo-100"
                    >
                      {isLoadingIdeas ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          ✨ Get Memory Ideas
                        </>
                      )}
                    </Button>
                  </div>
                  
                  
                  {aiMemoryIdeas.length > 0 && (
                    <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-sm text-gray-700">
                          📝 Click any idea to add it to your description:
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAiMemoryIdeas([])}
                          className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {aiMemoryIdeas.map((idea, index) => (
                          <div
                            key={index}
                            onClick={() => addIdeaToDescription(idea)}
                            className="group p-3 text-sm text-gray-700 bg-linear-to-r from-indigo-50 to-transparent rounded-lg cursor-pointer hover:from-indigo-100 hover:to-purple-50 transition-all duration-200 border border-transparent hover:border-indigo-300 hover:shadow-sm"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-indigo-500 group-hover:text-indigo-600">💭</span>
                              <span className="flex-1">{idea}</span>
                              <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to add →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={fetchMemoryIdeas}
                          disabled={isLoadingIdeas}
                          className="text-indigo-600 hover:text-indigo-800 text-xs"
                        >
                          🔄 Generate new ideas
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                
                <Button 
                  type="button" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700" 
                  onClick={() => setStep(2)}
                >
                  Next Step →
                </Button>
              </div>
            )}

           
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
                      <div className="flex items-center gap-2 mt-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <p className="text-sm text-blue-600">Uploading...</p>
                      </div>
                    )}
                  </div>
                </div>

                
                {formData.mediaFiles.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    {formData.mediaFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <span className="text-sm font-medium">[{file.type.toUpperCase()}] {file.name}</span>
                          
                          {file.caption ? (
                            <Textarea
                              value={file.caption}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  mediaFiles: prev.mediaFiles.map((f, idx) =>
                                    idx === i ? { ...f, caption: e.target.value } : f
                                  ),
                                }));
                              }}
                              rows={1}
                              className="mt-1 text-xs"
                              placeholder="Edit caption..."
                            />
                          ) : (
                            <div className="mt-1">
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
                                  toast.success(`Caption generated for ${file.name}!`);
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
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
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

                  {/* Replace custom recipient input with the new component */}
                  <RecipientInput 
                    recipients={recipients} 
                    setRecipients={setRecipients} 
                  />

                  <Button
                    type="button"
                    variant="outline"
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

           
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="font-semibold mb-3 text-lg">📋 Capsule Summary</p>
                  <ul className="space-y-2 text-sm">
                    <li>📝 <strong>Title:</strong> {formData.title || 'Not set'}</li>
                    <li>📖 <strong>Description:</strong> {formData.description ? `${formData.description.substring(0, 100)}...` : 'Not set'}</li>
                    <li>🖼️ <strong>Media:</strong> {formData.mediaFiles.length} files</li>
                    <li>👥 <strong>Recipients:</strong> {recipients.filter(r => r.trim()).join(', ') || 'None'}</li>
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
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      '🎉 Create Capsule'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

      
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Step {step} of 4</p>
        </div>
      </div>
    </div>
  );
}