// models/Reaction.ts
import mongoose, { Schema, model, models } from "mongoose";

const ReactionSchema = new Schema({
  capsuleId: { type: Schema.Types.ObjectId, ref: "Capsule", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  emoji: { type: String, required: true }, // ✅ Use "emoji" field
});

export const Reaction = models.Reaction || model("Reaction", ReactionSchema);