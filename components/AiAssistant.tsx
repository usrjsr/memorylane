'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type AiAssistantProps = {
  onResult: (result: string) => void;
  action: 'generate-caption' | 'summarize' | 'enhance' | 'suggest-ideas';
  text?: string;
  theme?: string;
  buttonText?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
};

export function AiAssistant({
  onResult,
  action,
  text,
  theme,
  buttonText,
  variant = 'outline',
  size = 'sm',
}: AiAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/capsules/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, text, theme }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'AI processing failed');
      }

      const data = await response.json();
      console.log("[AiAssistant] Response data:", data);
      onResult(data.result);
    } catch (error) {
      console.error('[AI Assistant] Error:', error);
      toast.error(error instanceof Error ? error.message : 'AI failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultText = () => {
    switch (action) {
      case 'generate-caption':
        return 'Generate Caption';
      case 'summarize':
        return 'Summarize';
      case 'enhance':
        return 'Enhance with AI';
      case 'suggest-ideas':
        return 'Get Ideas';
      default:
        return 'AI Assist';
    }
  };

  const customClassName = variant === 'outline'
    ? 'border-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/20 hover:border-cyan-400 hover:text-cyan-200'
    : variant === 'ghost'
      ? 'text-cyan-400 hover:bg-slate-800 hover:text-cyan-300'
      : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900';

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={`gap-2 ${customClassName} transition-all duration-200 font-semibold`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {buttonText || getDefaultText()}
    </Button>
  );
}