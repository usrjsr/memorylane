"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface Reaction {
  _id: string;
  capsuleId: string;
  userId: string;
  emoji: string;
}

const EMOJIS = ["❤️", "✨", "😢", "🙏", "🎉"] as const;

interface ReactionBarProps {
  capsuleId: string;
  initialReactions: Reaction[];
  userId: string;
}

export default function ReactionBar({
  capsuleId,
  initialReactions,
  userId,
}: ReactionBarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);

  useEffect(() => {
    setReactions(initialReactions);
  }, [initialReactions]);

  const handleReact = async (emoji: string) => {
    setLoading(emoji);

    const userCurrent = reactions.find((r) => r.userId === userId);

    setReactions((prev) => {
      const withoutUser = prev.filter((r) => r.userId !== userId);

      if (userCurrent?.emoji === emoji) {
        return withoutUser;
      } else {
        return [...withoutUser, { _id: `temp-${Date.now()}`, capsuleId, userId, emoji }];
      }
    });

    try {
      const res = await fetch("/api/capsules/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capsuleId, emoji }),
      });

      if (!res.ok) throw new Error("Failed");

      router.refresh();
    } catch (err) {
      console.error(err);
      setReactions(initialReactions);
    } finally {
      setLoading(null);
    }
  };

  const getCount = (emoji: string) =>
    reactions.filter((r) => r.emoji === emoji).length;

  const hasReacted = (emoji: string) =>
    reactions.some((r) => r.emoji === emoji && r.userId === userId);

  const emojiColors: Record<string, { bg: string; border: string; active: string }> = {
    "❤️": { bg: "bg-rose-900/20", border: "border-rose-500/30", active: "bg-rose-600 hover:bg-rose-500 text-white border-rose-500" },
    "✨": { bg: "bg-amber-900/20", border: "border-amber-500/30", active: "bg-amber-500 hover:bg-amber-400 text-slate-900 border-amber-500" },
    "😢": { bg: "bg-slate-800/30", border: "border-slate-600/30", active: "bg-slate-600 hover:bg-slate-500 text-white border-slate-600" },
    "🙏": { bg: "bg-purple-900/20", border: "border-purple-500/30", active: "bg-purple-600 hover:bg-purple-500 text-white border-purple-500" },
    "🎉": { bg: "bg-cyan-900/20", border: "border-cyan-500/30", active: "bg-cyan-500 hover:bg-cyan-400 text-slate-900 border-cyan-500" },
  };

  return (
    <div className="flex flex-wrap gap-3">
      {EMOJIS.map((emoji) => {
        const colors = emojiColors[emoji];
        const count = getCount(emoji);
        const isReacted = hasReacted(emoji);

        return (
          <Button
            key={emoji}
            onClick={() => handleReact(emoji)}
            disabled={!!loading}
            className={`rounded-full px-4 py-3 sm:px-6 sm:py-3 flex items-center gap-2 transition-all transform hover:scale-110 active:scale-95 font-semibold border-2 shadow-md ${
              isReacted
                ? `${colors.active}`
                : `${colors.bg} ${colors.border} text-slate-300 hover:${colors.bg.replace('/20', '/40')} hover:border-opacity-60`
            }`}
            variant={isReacted ? "default" : "outline"}
          >
            <span className="text-xl sm:text-2xl">{emoji}</span>
            {count > 0 && (
              <span className={`text-xs sm:text-sm font-black ${isReacted ? 'text-current' : 'text-slate-400'}`}>
                {count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}