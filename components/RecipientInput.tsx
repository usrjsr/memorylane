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
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Enter recipient's email..."
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button type="button" onClick={addRecipient} variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {recipients.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {recipients.map((recipientEmail) => (
            <div
              key={recipientEmail}
              className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{recipientEmail}</span>
              <button
                type="button"
                onClick={() => removeRecipient(recipientEmail)}
                className="hover:bg-indigo-200 rounded-full p-0.5"
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