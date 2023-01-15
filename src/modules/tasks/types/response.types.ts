import { Response } from 'express';
import { TaskDTO } from '../task.dto';
import { GetStatisticsCommon, GetTasksCommon } from './common.types';
import { CreatedTaskDTO } from './tasks.types';

export type GetTasksResponse = Response<GetTasksCommon>;
export type GetStatisticsResponse = Response<{ statistics: GetStatisticsCommon }>;
export type CreateTaskResponse = Response<CreatedTaskDTO>;
export type UpdateTaskResponse = Response<TaskDTO>;
