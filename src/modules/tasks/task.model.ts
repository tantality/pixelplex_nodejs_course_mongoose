import { Schema, Types, model } from 'mongoose';
import { TASK_TYPE, TASK_STATUS, ITask } from './types';

const taskSchema = new Schema<ITask>(
  {
    userId: { ref: 'user', type: Types.ObjectId, index: true, required: true },
    hiddenWord: { type: String, index: true, required: true },
    hiddenWordLanguageId: { ref: 'language', type: Types.ObjectId, index: true, required: true },
    nativeLanguageId: { ref: 'language', type: Types.ObjectId, required: true },
    foreignLanguageId: { ref: 'language', type: Types.ObjectId, required: true },
    type: { type: String, enum: Object.values(TASK_TYPE), required: true },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.UNANSWERED,
      index: true,
      required: true,
    },
    correctAnswers: { type: [String] },
    receivedAnswer: { type: String, default: null },
  },
  { timestamps: true },
);

taskSchema.index({ createdAt: 1 });
taskSchema.index({ nativeLanguageId: 1, foreignLanguageId: 1 });

export const Task = model('task', taskSchema);
