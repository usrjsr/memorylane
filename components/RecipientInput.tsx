"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X, UserPlus } from "lucide-react";

interface RecipientInputProps {
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function RecipientInput({ recipients, setRecipients }: RecipientInputProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const addRecipient = () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (recipients.includes(trimmedEmail)) {
      setError("Recipient already added.");
      return;
    }

    setRecipients([...recipients, trimmedEmail]);
    setEmail("");
    setError("");
  };

  const removeRecipient = (emailToRemove: string) => {
    setRecipients(recipients.filter((r) => r !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRecipient();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          type="email"
          placeholder="Enter recipient's email..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 border-2 border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
        />
        <Button
          type="button"
          onClick={addRecipient}
          variant="outline"
          className="border-2 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white px-4 font-semibold"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

      {recipients.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {recipients.map((recipientEmail) => (
            <div
              key={recipientEmail}
              className="flex items-center gap-2 bg-cyan-900/40 text-cyan-300 px-4 py-2 rounded-lg text-sm font-semibold shadow-md border-2 border-cyan-500/50 hover:border-cyan-400 transition-all"
            >
              <span className="truncate">{recipientEmail}</span>
              <button
                type="button"
                onClick={() => removeRecipient(recipientEmail)}
                className="hover:bg-cyan-800/40 rounded-md p-1 transition-colors flex-shrink-0"
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