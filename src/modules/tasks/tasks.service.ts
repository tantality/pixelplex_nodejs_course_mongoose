/* eslint-disable require-await */
import { FilterQuery, ObjectId } from 'mongoose';
import {
  ANSWER_TO_TASK_ALREADY_EXISTS_MESSAGE,
  BadRequestError,
  NotFoundError,
  NO_CARDS_FOUND_WITH_THE_LANGUAGE_MESSAGE,
  TASK_NOT_FOUND_MESSAGE,
} from '../../errors';
import { checkLanguagesValidity } from '../../utils';
import { CardsService } from '../cards/cards.service';
import { IUser } from '../users/types';
import { UsersService } from '../users/users.service';
import { TaskDTO } from './task.dto';
import { TasksRepository } from './tasks.repository';
import {
  ITask,
  CreatedTaskDTO,
  CreateTaskBody,
  TASK_TYPE,
  TASK_STATUS,
  UpdateTaskBody,
  UpdateTaskParams,
  GetTasksQuery,
  GetStatisticsQuery,
  Statistics,
} from './types';
import { getAnswerStatus } from './utils';

export class TasksService {
  static findAndCountAll = async (userId: ObjectId, query: GetTasksQuery): Promise<{ count: number; tasks: ITask[] }> => {
    const tasksAndTheirNumber = await TasksRepository.findAndCountAll(userId, query);
    return tasksAndTheirNumber;
  };

  static findOneByCondition = async (condition: FilterQuery<ITask>): Promise<ITask | null> => {
    const task = await TasksRepository.findOneByCondition(condition);
    return task;
  };

  static calculateStatistics = async (userId: ObjectId, query: GetStatisticsQuery): Promise<{ statistics: Statistics[] }> => {
    const statistics = await TasksRepository.calculateStatistics(userId, query);
    return statistics;
  };

  static create = async (userId: ObjectId, { type, foreignLanguageId }: CreateTaskBody): Promise<CreatedTaskDTO> => {
    let { nativeLanguageId } = (await UsersService.findOneByCondition({ _id: userId })) as IUser;

    await checkLanguagesValidity(nativeLanguageId, foreignLanguageId);

    nativeLanguageId = nativeLanguageId as ObjectId;

    const hiddenWordLanguageId = type === TASK_TYPE.TO_NATIVE ? foreignLanguageId : nativeLanguageId;
    const hiddenWord = await CardsService.findRandomWord(userId, nativeLanguageId, foreignLanguageId, hiddenWordLanguageId);
    if (!hiddenWord) {
      throw new BadRequestError(NO_CARDS_FOUND_WITH_THE_LANGUAGE_MESSAGE);
    }

    const createdTask = await TasksRepository.create({
      userId,
      hiddenWord,
      type,
      nativeLanguageId,
      foreignLanguageId,
      hiddenWordLanguageId,
    });

    return {
      id: createdTask._id,
      nativeLanguageId,
      foreignLanguageId,
      word: hiddenWord,
      type,
    };
  };

  static update = async (userId: ObjectId, { taskId }: UpdateTaskParams, { answer }: UpdateTaskBody): Promise<TaskDTO> => {
    const taskToUpdate = await TasksService.findOneByCondition({ _id: taskId, userId });
    if (!taskToUpdate) {
      throw new NotFoundError(TASK_NOT_FOUND_MESSAGE);
    }

    const { _id, hiddenWord, type, status, nativeLanguageId, foreignLanguageId } = taskToUpdate;

    if (status !== TASK_STATUS.UNANSWERED) {
      throw new BadRequestError(ANSWER_TO_TASK_ALREADY_EXISTS_MESSAGE);
    }

    const taskDataToFindAnswers = { hiddenWord, userId, type, nativeLanguageId, foreignLanguageId };
    const correctAnswers = await CardsService.findCorrectAnswersToTask(taskDataToFindAnswers);

    const answerStatus = getAnswerStatus(correctAnswers, answer);

    const taskDataToUpdate = { correctAnswers, receivedAnswer: answer, status: answerStatus };
    const updatedTask = await TasksRepository.update(_id, taskDataToUpdate);

    return new TaskDTO(updatedTask);
  };
}
