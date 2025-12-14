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
    <div className="space-y-6">
      <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="font-bold text-amber-900">Share Your Thoughts</h3>
        </div>
        <div onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share a reflection..."
            className="bg-white border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600"
            disabled={isSubmitting}
          />
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !text.trim()}
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-md px-6 font-semibold"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {initialComments.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <h4 className="font-bold text-amber-900">
                {initialComments.length} Reflection{initialComments.length !== 1 ? 's' : ''}
              </h4>
            </div>
            {initialComments.map((comment: any) => (
              <div key={comment._id} className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border-2 border-amber-200 hover:border-amber-300 transition-colors">
                <Avatar className="h-12 w-12 border-2 border-amber-200">
                  <AvatarImage src={comment.userImage} />
                  <AvatarFallback className="bg-amber-100 text-amber-700 font-bold">
                    {comment.userName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <p className="text-sm font-bold text-amber-900">{comment.userName}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-600 flex-shrink-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(comment.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-12 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-300">
            <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-amber-700 font-medium">No reflections yet</p>
            <p className="text-xs text-amber-600 mt-1">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}