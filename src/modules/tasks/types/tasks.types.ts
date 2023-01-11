import { ObjectId } from 'mongoose';
import { LanguageDTO } from '../../languages/language.dto';
import { TaskDTO } from '../task.dto';

export interface ITask {
  _id: ObjectId;
  userId: ObjectId;
  nativeLanguageId: ObjectId;
  foreignLanguageId: ObjectId;
  type: string;
  status: string;
  hiddenWord: string;
  correctAnswers: string[] | null;
  receivedAnswer: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum TASK_STATUS {
  UNANSWERED = 'unanswered',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
}

export enum TASK_TYPE {
  TO_NATIVE = 'to_native',
  TO_FOREIGN = 'to_foreign',
}

export enum TASK_SORT_BY {
  DATE = 'date',
}

export type CreateTaskData = Pick<ITask, 'hiddenWord' | 'userId' | 'type'>;
export type CreatedTaskDTO = Pick<TaskDTO, 'id' | 'nativeLanguageId' | 'foreignLanguageId' | 'type' | 'hiddenWord'>;
export type Answers = Record<TASK_STATUS, number>;
export type Statistics = { language: LanguageDTO; answers: Answers };
