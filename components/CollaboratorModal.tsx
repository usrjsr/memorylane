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
        <Button variant="outline" className="gap-2 border-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold">
          <Users className="h-4 w-4" />
          Manage Contributors
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-900 border-2 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-black">Manage Collaborators</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <p className="text-sm text-slate-400">
            Invite registered users to add their own media and messages to this capsule.
          </p>

          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="collaborator@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
            />
            <Button 
              onClick={handleInvite} 
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-4 whitespace-nowrap"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </>
              )}
            </Button>
          </div>

          <div className="border-t-2 border-slate-700 pt-5">
            <p className="text-sm font-bold text-white mb-4">Current Team:</p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {initialCollaborators.map((collab, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-800/50 border-2 border-purple-500/30 px-4 py-3 rounded-lg hover:border-purple-400 transition-all"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{collab.name || "Unknown"}</p>
                    <p className="text-xs text-slate-400">{collab.email}</p>
                  </div>
                  <span className="text-xs font-bold text-purple-400 bg-purple-900/40 px-2 py-1 rounded">
                    Contributor
                  </span>
                </div>
              ))}
              {initialCollaborators.length === 0 && (
                <div className="text-center py-6 text-slate-400 italic">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Only you are contributing.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}