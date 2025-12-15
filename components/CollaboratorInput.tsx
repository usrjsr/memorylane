"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X, UserPlus } from "lucide-react";

interface CollaboratorInputProps {
  collaborators: string[];
  setCollaborators: (collaborators: string[]) => void;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function CollaboratorInput({ collaborators, setCollaborators }: CollaboratorInputProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const addCollaborator = () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (collaborators.includes(trimmedEmail)) {
      setError("Collaborator already added.");
      return;
    }

    setCollaborators([...collaborators, trimmedEmail]);
    setEmail("");
    setError("");
  };

  const removeCollaborator = (emailToRemove: string) => {
    setCollaborators(collaborators.filter((c) => c !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCollaborator();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          type="email"
          placeholder="Enter collaborator's email..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500"
        />
        <Button
          type="button"
          onClick={addCollaborator}
          variant="outline"
          className="border-2 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white px-4 font-semibold"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

      {collaborators.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {collaborators.map((collaboratorEmail) => (
            <div
              key={collaboratorEmail}
              className="flex items-center gap-2 bg-purple-900/40 text-purple-300 px-4 py-2 rounded-lg text-sm font-semibold shadow-md border-2 border-purple-500/50 hover:border-purple-400 transition-all"
            >
              <span className="truncate">{collaboratorEmail}</span>
              <button
                type="button"
                onClick={() => removeCollaborator(collaboratorEmail)}
                className="hover:bg-purple-800/40 rounded-md p-1 transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}