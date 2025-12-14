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
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter collaborator's email..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600"
        />
        <Button
          type="button"
          onClick={addCollaborator}
          variant="outline"
          className="border-2 border-amber-300 text-amber-800 hover:bg-amber-50"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      {collaborators.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {collaborators.map((collaboratorEmail) => (
            <div
              key={collaboratorEmail}
              className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-amber-200"
            >
              <span>{collaboratorEmail}</span>
              <button
                type="button"
                onClick={() => removeCollaborator(collaboratorEmail)}
                className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}