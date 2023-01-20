import { Response } from 'express';
import { TaskDTO } from '../task.dto';
import { CreatedTaskDTO, ITask, Statistics } from './tasks.types';

export type GetTasksResponse = Response<{ count: number; tasks: ITask[] }>;
export type GetStatisticsResponse = Response<{ statistics: Statistics[] }>;
export type CreateTaskResponse = Response<CreatedTaskDTO>;
export type UpdateTaskResponse = Response<TaskDTO>;
