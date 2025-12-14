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
          className="flex-1 border-2 border-amber-200 focus:border-amber-600 focus:ring-amber-600"
        />
        <Button 
          type="button" 
          onClick={addRecipient} 
          variant="outline"
          className="border-2 border-amber-300 text-amber-800 hover:bg-amber-50"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
      
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      {recipients.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {recipients.map((recipientEmail) => (
            <div
              key={recipientEmail}
              className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-amber-200"
            >
              <span>{recipientEmail}</span>
              <button
                type="button"
                onClick={() => removeRecipient(recipientEmail)}
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