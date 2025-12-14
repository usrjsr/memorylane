import mongoose, { Schema, model, models } from "mongoose";

const CapsuleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],

    recipientEmails: [{ type: String, required: true }],

    unlockType: { type: String, enum: ["date", "event"], default: "date" },
    unlockDate: { type: Date, required: true },
    unlockEventName: { type: String },

    status: { type: String, enum: ["locked", "unlocked"], default: "locked" },

    theme: {
      type: String,
      enum: [
        "Childhood",
        "Family History",
        "College Years",
        "Wedding",
        "Other",
      ],
      default: "Other",
    },

    privacy: {
      type: String,
      enum: ["private", "public", "recipients-only"],
      default: "recipients-only",
    },

    mediaIds: [{ type: Schema.Types.ObjectId, ref: "Media" }],
  },
  { timestamps: true }
);

CapsuleSchema.index({ unlockDate: 1, status: 1 });

export const Capsule = models.Capsule || model("Capsule", CapsuleSchema);
