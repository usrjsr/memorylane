import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String 
  },
  password: { 
    type: String 
  }, 
  emailVerified: { 
    type: Date, 
    default: null 
  },
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);