"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UserPlus, Users, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";

interface CollaboratorModalProps {
  capsuleId: string;
  initialCollaborators: { email: string; name: string }[];
  onCollaboratorChange: () => void;
}

export default function CollaboratorModal({
  capsuleId,
  initialCollaborators,
  onCollaboratorChange,
}: CollaboratorModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (initialCollaborators.some(c => c.email === trimmedEmail)) {
      toast.warning("User is already a collaborator.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/capsules/collaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capsuleId, email: trimmedEmail }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add collaborator");
      }

      toast.success(`${trimmedEmail} added! They can now contribute.`);
      setEmail("");
      onCollaboratorChange();
    } catch (err: any) {
      toast.error(err.message || "Failed to add collaborator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" />
          Manage Contributors
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Collaborators</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Invite registered users to add their own media and messages to this capsule.
          </p>

          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="collaborator@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleInvite} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Invite"}
            </Button>
          </div>

          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-medium mb-2">Current Team:</p>
            <div className="space-y-2">
              {initialCollaborators.map((collab, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm"
                >
                  <span>{collab.name || collab.email}</span>
                  <span className="text-xs text-gray-500">
                    {collab.email}
                  </span>
                </div>
              ))}
              {initialCollaborators.length === 0 && (
                <p className="text-gray-400 text-sm italic">
                  Only you are contributing.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}