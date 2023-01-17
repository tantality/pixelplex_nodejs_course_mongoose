import { Response } from 'express';
import { TaskDTO } from '../task.dto';
import { GetStatisticsCommon } from './common.types';
import { CreatedTaskDTO, ITask } from './tasks.types';

export type GetTasksResponse = Response<{ count: number; tasks: ITask[] }>;
export type GetStatisticsResponse = Response<{ statistics: GetStatisticsCommon }>;
export type CreateTaskResponse = Response<CreatedTaskDTO>;
export type UpdateTaskResponse = Response<TaskDTO>;
