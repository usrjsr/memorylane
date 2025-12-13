"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface CommentSectionProps {
  capsuleId: string;
  initialComments: any[];
  userId: string;
}

export default function CommentSection({ capsuleId, initialComments }: CommentSectionProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/capsules/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capsuleId, text }),
      });

      if (response.ok) {
        setText("");
        router.refresh(); // This triggers the Server Component to re-fetch comments
      } else {
        const errData = await response.text();
        console.error("Failed to post:", errData);
      }
    } catch (err) {
      console.error("Comment error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share a reflection..."
          className="bg-white dark:bg-zinc-900"
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting || !text.trim()}>
          {isSubmitting ? "..." : "Post"}
        </Button>
      </form>

      <div className="space-y-4">
        {initialComments.map((comment: any) => (
          <div key={comment._id} className="flex gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.userImage} />
              <AvatarFallback>{comment.userName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold">{comment.userName}</p>
                <p className="text-[10px] text-zinc-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}