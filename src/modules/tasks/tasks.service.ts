/* eslint-disable require-await */
import { ObjectId } from 'mongoose';
import { BadRequestError, NO_CARDS_FOUND_WITH_THE_LANGUAGE_MESSAGE } from '../../errors';
import { checkLanguagesValidity, logRequest } from '../../utils';
import { CardsService } from '../cards/cards.service';
import { IUser } from '../users/types';
import { UsersService } from '../users/users.service';
import { TaskDTO } from './task.dto';
import { TasksRepository } from './tasks.repository';
import {
  GetTasksRequest,
  GetTasksCommon,
  GetStatisticsCommon,
  GetStatisticsRequest,
  UpdateTaskRequest,
  ITask,
  CreatedTaskDTO,
  CreateTaskBody,
  TASK_TYPE,
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

  static create = async (userId: ObjectId, { type, foreignLanguageId }: CreateTaskBody): Promise<CreatedTaskDTO> => {
    let { nativeLanguageId } = (await UsersService.findOneByCondition({ _id: userId })) as IUser;

    await checkLanguagesValidity(nativeLanguageId, foreignLanguageId);

    nativeLanguageId = nativeLanguageId as ObjectId;

    const wordLanguageId = type === TASK_TYPE.TO_NATIVE ? foreignLanguageId : nativeLanguageId;
    const hiddenWord = await CardsService.findRandomWord(userId, nativeLanguageId, foreignLanguageId, wordLanguageId);
    if (!hiddenWord) {
      throw new BadRequestError(NO_CARDS_FOUND_WITH_THE_LANGUAGE_MESSAGE);
    }

    const createdTask = await TasksRepository.create({ userId, hiddenWord, type, nativeLanguageId, foreignLanguageId });

    return {
      id: createdTask._id,
      nativeLanguageId,
      foreignLanguageId,
      word: hiddenWord,
      type,
    };
  };

  static update = async (req: UpdateTaskRequest): Promise<TaskDTO> => {
    logRequest(req);
    return taskDTO;
  };
}
