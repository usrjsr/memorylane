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

    // Optimistic update
    const userCurrent = reactions.find((r) => r.userId === userId);

    setReactions((prev) => {
      // Remove any existing reaction from this user
      const withoutUser = prev.filter((r) => r.userId !== userId);

      if (userCurrent?.emoji === emoji) {
        // Clicking the same → remove it
        return withoutUser;
      } else {
        // Add or replace with new emoji
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

      router.refresh(); // Get real data back
    } catch (err) {
      console.error(err);
      setReactions(initialReactions); // Revert on error
    } finally {
      setLoading(null);
    }
  };

  const getCount = (emoji: string) =>
    reactions.filter((r) => r.emoji === emoji).length;

  const hasReacted = (emoji: string) =>
    reactions.some((r) => r.emoji === emoji && r.userId === userId);

  return (
    <div className="flex flex-wrap gap-3">
      {EMOJIS.map((emoji) => (
        <Button
          key={emoji}
          variant={hasReacted(emoji) ? "default" : "outline"}
          onClick={() => handleReact(emoji)}
          disabled={!!loading}
          className={`rounded-full px-4 py-2 flex items-center gap-2 transition-all hover:scale-110 ${
            hasReacted(emoji) ? "bg-blue-600 text-white" : ""
          }`}
        >
          <span>{emoji}</span>
          <span className="text-xs font-bold">{getCount(emoji)}</span>
        </Button>
      ))}
    </div>
  );
}