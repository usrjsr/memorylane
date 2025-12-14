import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
  capsuleId: { type: Schema.Types.ObjectId, ref: "Capsule", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String },
  userImage: { type: String },
  text: { type: String, required: true }, // Ensure this is 'text'
  createdAt: { type: Date, default: Date.now },
});

export const Comment = models.Comment || model("Comment", CommentSchema);
