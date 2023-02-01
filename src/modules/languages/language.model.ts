import mongoose from 'mongoose';
import { ILanguage } from './types';

const languageSchema = new mongoose.Schema<ILanguage>(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true, index: true, required: true },
  },
  { timestamps: true },
);

languageSchema.index({ createdAt: 1 });

export const Language = mongoose.model('language', languageSchema);
