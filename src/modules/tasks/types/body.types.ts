import { ITask } from '.';

export type CreateTaskBody = Pick<ITask, 'type' | 'foreignLanguageId'>;
export type UpdateTaskBody = { answer: string };
