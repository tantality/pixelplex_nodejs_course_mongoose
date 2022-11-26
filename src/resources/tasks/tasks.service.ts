/* eslint-disable require-await */
import { logRequest } from '../../utils/log-request.utils';
import { LanguageDTO } from '../languages/language.dto';
import { Language } from '../languages/language.entity';
import { TaskDTO } from './task.dto';
import { Task } from './task.entity';
import {
  GetTasksRequest,
  GetTasksCommon,
  GetStatisticsCommon,
  GetStatisticsRequest,
  CreateTaskCommon,
  AddAnswerToTaskRequest,
  CreateTaskRequest,
} from './types';

export class TasksService {
  private static language = new Language('russian', 'ru', new Date(), new Date());
  private static languageDTO = new LanguageDTO(TasksService.language);
  private static task = new Task(1, 1, 'to_foreign', 'correct', ['привет'], 'привет', new Date(), new Date());
  private static taskDTO = new TaskDTO(TasksService.task, 'hello', 1, 2);

  static findAll = async (req: GetTasksRequest): Promise<GetTasksCommon | null> => {
    logRequest(req);
    return {
      count: 30,
      tasks: [TasksService.taskDTO],
    };
  };

  static calculateStatistics = async (req: GetStatisticsRequest): Promise<GetStatisticsCommon | null> => {
    logRequest(req);
    const statistics = [
      {
        language: TasksService.languageDTO,
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
      id: 1,
      nativeLanguageId: 1,
      foreignLanguageId: 2,
      word: 'hello',
      type: 'to_native',
    };
  };

  static addAnswer = async (req: AddAnswerToTaskRequest): Promise<TaskDTO> => {
    logRequest(req);
    return TasksService.taskDTO;
  };
}
