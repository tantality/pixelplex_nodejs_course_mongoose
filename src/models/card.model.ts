import { Schema, Types, model } from 'mongoose';
import { ICard } from '../modules/cards/types';

const cardSchema = new Schema<ICard>(
  {
    userId: { ref: 'user', type: Types.ObjectId, index: true, required: true },
    nativeLanguageId: { ref: 'language', type: Types.ObjectId, required: true },
    nativeWords: { type: [String], index: true, required: true },
    foreignLanguageId: { ref: 'language', type: Types.ObjectId, required: true },
    foreignWords: { type: [String], index: true, required: true },
  },
  { timestamps: true },
);

cardSchema.index({ createdAt: 1 });
cardSchema.index({ nativeLanguageId: 1, foreignLanguageId: 1 });

export const Card = model('card', cardSchema);
