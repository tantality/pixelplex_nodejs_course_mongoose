/* eslint-disable require-await */
import { ObjectId } from 'mongoose';
import { logRequest } from '../../utils';
import { TaskDTO } from './task.dto';
import {
  GetTasksRequest,
  GetTasksCommon,
  GetStatisticsCommon,
  GetStatisticsRequest,
  CreateTaskCommon,
  UpdateTaskRequest,
  CreateTaskRequest,
  ITask,
} from './types';

const id = '23832rhi22' as unknown as ObjectId;
const task: ITask = {
  _id: id,
  userId: id,
  nativeLanguageId: id,
  foreignLanguageId: id,
  type: 'to_foreign',
  status: 'correct',
  hiddenWord: 'привет',
  correctAnswers: ['hi'],
  receivedAnswer: 'hi',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const taskDTO = new TaskDTO(task);

export class TasksService {
  static findAll = async (req: GetTasksRequest): Promise<GetTasksCommon | null> => {
    logRequest(req);
    return {
      count: 30,
      tasks: [taskDTO],
    };
  };

  static calculateStatistics = async (req: GetStatisticsRequest): Promise<GetStatisticsCommon | null> => {
    logRequest(req);
    const statistics = [
      {
        language: {
          id,
          name: 'russian',
          code: 'ru',
          createdAt: new Date(),
        },
        answers: {
          correct: 10,
          incorrect: 1,
        },
      },
    ];

    return statistics;
  };

  static create = async (req: CreateTaskRequest): Promise<CreateTaskCommon> => {
    logRequest(req);
    return {
      id,
      nativeLanguageId: id,
      foreignLanguageId: id,
      word: 'hello',
      type: 'to_native',
    };
  };

  static update = async (req: UpdateTaskRequest): Promise<TaskDTO> => {
    logRequest(req);
    return taskDTO;
  };
}
