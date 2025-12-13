import { Schema, model, models } from "mongoose";

const MediaSchema = new Schema(
  {
    capsuleId: { type: Schema.Types.ObjectId, ref: "Capsule", required: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ["image", "video", "audio", "pdf"], required: true },
    fileName: { type: String },
    fileKey: { type: String }, // optional: lets you delete later from UploadThing
  },
  { timestamps: true }
);

export const Media = models.Media || model("Media", MediaSchema);