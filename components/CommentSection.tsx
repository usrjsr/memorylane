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
        router.refresh();
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
    <div className="space-y-8">
      <div className="bg-slate-800/50 border-2 border-indigo-500/30 p-7 rounded-2xl hover:border-indigo-500/60 transition-all">
        <div className="flex items-center gap-3 mb-5">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="font-black text-white text-lg">Share Your Thoughts</h3>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share a reflection..."
            className="flex-1 bg-slate-900 border-2 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/50 px-6 font-bold whitespace-nowrap"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </form>
      </div>

      <div className="space-y-5">
        {initialComments.length > 0 ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <h4 className="font-black text-white text-lg">
                {initialComments.length} Reflection{initialComments.length !== 1 ? 's' : ''}
              </h4>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {initialComments.map((comment: any) => (
                <div key={comment._id} className="flex gap-4 p-5 bg-slate-800/40 rounded-2xl border-2 border-slate-700/50 hover:border-indigo-500/30 transition-all group">
                  <Avatar className="h-12 w-12 border-2 border-indigo-500/50 flex-shrink-0">
                    <AvatarImage src={comment.userImage} />
                    <AvatarFallback className="bg-indigo-900/40 text-indigo-300 font-bold">
                      {comment.userName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <p className="text-sm font-bold text-white">{comment.userName || "Anonymous"}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: comment.createdAt ? new Date(comment.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined : undefined
                        })}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-700">
            <div className="w-16 h-16 bg-slate-800/50 border-2 border-indigo-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white mb-1">No reflections yet</p>
            <p className="text-xs text-slate-400">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}