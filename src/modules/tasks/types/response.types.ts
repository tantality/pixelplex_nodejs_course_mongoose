import { Response } from 'express';
import { TaskDTO } from '../task.dto';
import { CreatedTaskDTO, ITask, AnswerStatisticsByLanguage } from './tasks.types';

export type GetTasksResponse = Response<{ count: number; tasks: ITask[] }>;
export type GetStatisticsResponse = Response<{ statistics: AnswerStatisticsByLanguage[] }>;
export type CreateTaskResponse = Response<CreatedTaskDTO>;
export type UpdateTaskResponse = Response<TaskDTO>;
