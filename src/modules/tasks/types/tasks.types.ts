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
  hiddenWordLanguageId: ObjectId;
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

export type CreateTaskData = Pick<
ITask,
'hiddenWord' | 'userId' | 'type' | 'nativeLanguageId' | 'foreignLanguageId' | 'hiddenWordLanguageId'
>;
export type CreatedTaskDTO = Pick<TaskDTO, 'id' | 'nativeLanguageId' | 'foreignLanguageId' | 'type'> & { word: string };
export type UpdateTaskData = Pick<ITask, 'correctAnswers' | 'status' | 'receivedAnswer'>;
export type FindAnswersTaskData = Pick<ITask, 'hiddenWord' | 'userId' | 'type' | 'nativeLanguageId' | 'foreignLanguageId'>;
export type AnswerStatistics = { count: number; status: TASK_STATUS };
export type AnswerStatisticsByLanguage = { language: LanguageDTO; answers: AnswerStatistics[] };
