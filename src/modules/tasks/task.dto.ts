import { ObjectId } from 'mongoose';
import { ITask } from './types';

export class TaskDTO implements Omit<ITask, 'updatedAt' | 'userId' | '_id'> {
  public readonly id: ObjectId;
  public readonly nativeLanguageId: ObjectId;
  public readonly foreignLanguageId: ObjectId;
  public readonly type: string;
  public readonly status: string;
  public readonly hiddenWord: string;
  public readonly correctAnswers: string[];
  public readonly receivedAnswer: string;
  public readonly createdAt: Date;
  constructor(task: ITask) {
    this.id = task._id;
    this.nativeLanguageId = task.nativeLanguageId;
    this.foreignLanguageId = task.foreignLanguageId;
    this.type = task.type;
    this.status = task.status;
    this.hiddenWord = task.hiddenWord;
    this.correctAnswers = task.correctAnswers as string[];
    this.receivedAnswer = task.receivedAnswer as string;
    this.createdAt = task.createdAt;
  }
}
