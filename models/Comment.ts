import mongoose, { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
  capsuleId: { type: Schema.Types.ObjectId, ref: 'Capsule', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export const Comment = models.Comment || model('Comment', CommentSchema);