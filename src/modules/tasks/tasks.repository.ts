import { Aggregate, FilterQuery, ObjectId, ProjectionType } from 'mongoose';
import { Task } from '../../models/task.model';
import { recreateObjectIdField } from '../cards/utils';
import { CreateTaskData, GetStatisticsQuery, GetTasksQuery, ITask, Statistics, UpdateTaskData } from './types';
import { createSortingCondition, isObjectEmpty } from './utils';

export class TasksRepository {
  static findAndCountAll = async (userId: ObjectId, query: GetTasksQuery): Promise<{ count: number; tasks: ITask[] }> => {
    const { sortDirection, sortBy, limit, offset, ...conditionParameters } = query;

    const findCondition = TasksRepository.createConditionToFindTasks({ ...conditionParameters, userId });
    const fieldSelectionConfiguration = TasksRepository.createDTOFieldSelectionConfiguration();
    const sortingCondition = createSortingCondition(sortBy, sortDirection);

    const tasksCountPromise = TasksRepository.countAll(findCondition);
    const tasksAggregate: Aggregate<ITask[]> = Task.aggregate([
      { $match: findCondition },
      { $project: fieldSelectionConfiguration as { [field: string]: any } },
      { $sort: sortingCondition },
      { $skip: offset },
      { $limit: limit },
    ]);

    const [count, tasks] = await Promise.all([tasksCountPromise, tasksAggregate]);

    return { count, tasks };
  };

  private static createConditionToFindTasks = (
    conditionParameters: Pick<GetTasksQuery, 'search' | 'taskStatus' | 'languageId'> & { userId: ObjectId },
  ): FilterQuery<ITask> => {
    const { search, taskStatus, userId, languageId } = conditionParameters;

    const searchByHiddenWordCondition = TasksRepository.createSearchByHiddenWordCondition(search);
    const languagesCondition = TasksRepository.createLanguagesCondition(languageId);
    const taskStatusCondition = taskStatus ? { status: taskStatus } : {};

    const condition: FilterQuery<ITask> = {
      userId: recreateObjectIdField(userId),
      ...taskStatusCondition,
      ...searchByHiddenWordCondition,
      ...languagesCondition,
    };

    return condition;
  };

  private static createSearchByHiddenWordCondition = (search?: string): FilterQuery<ITask> => {
    const searchCondition = search ? { $regex: new RegExp(search, 'i') } : null;
    const searchInWordsCondition = searchCondition ? { hiddenWord: searchCondition } : {};

    return searchInWordsCondition;
  };

  private static createLanguagesCondition = (languageId?: ObjectId): FilterQuery<ITask> => {
    if (!languageId) {
      return {};
    }

    const recreatedLanguageId = recreateObjectIdField(languageId);
    const languagesCondition = { $or: [{ nativeLanguageId: recreatedLanguageId }, { foreignLanguageId: recreatedLanguageId }] };

    return languagesCondition;
  };

  private static createDTOFieldSelectionConfiguration = (): ProjectionType<ITask> => {
    const fieldSelectionConfiguration: ProjectionType<ITask> = {
      _id: 0,
      id: '$_id',
      nativeLanguageId: 1,
      foreignLanguageId: 1,
      type: 1,
      status: 1,
      hiddenWord: 1,
      correctAnswers: { $cond: { if: { $size: '$correctAnswers' }, then: '$correctAnswers', else: '$$REMOVE' } },
      receivedAnswer: { $ifNull: ['$receivedAnswer', '$$REMOVE'] },
      createdAt: 1,
    };

    return fieldSelectionConfiguration;
  };

  static countAll = async (condition: FilterQuery<ITask>): Promise<number> => {
    const count = await Task.where(condition).countDocuments();
    return count;
  };

  static findOneByCondition = async (condition: FilterQuery<ITask>): Promise<ITask | null> => {
    const task = await Task.findOne(condition);
    return task;
  };

  static calculateStatistics = async (userId: ObjectId, query: GetStatisticsQuery): Promise<{ statistics: Statistics[] }> => {
    const findCondition = TasksRepository.createFindConditionToCalculateStatistics({ ...query, userId });

    const taskStatistics: ITask[] = await Task.aggregate([{ $match: findCondition }]);

    return { statistics: [] };
  };

  private static createFindConditionToCalculateStatistics = (
    conditionParameters: GetStatisticsQuery & { userId: ObjectId },
  ): FilterQuery<ITask> => {
    const { fromDate, toDate, languageIds, userId } = conditionParameters;

    const hiddenWordLanguageIdCondition = TasksRepository.createHiddenWordLanguageIdInIdsCondition(languageIds);
    const createdAtCondition = TasksRepository.createCreatedAtCondition(fromDate, toDate);

    const condition: FilterQuery<ITask> = {
      userId: recreateObjectIdField(userId),
      ...hiddenWordLanguageIdCondition,
      ...createdAtCondition,
    };

    return condition;
  };

  private static createHiddenWordLanguageIdInIdsCondition = (languageIds?: ObjectId[]): FilterQuery<ITask> => {
    if (!languageIds) {
      return {};
    }

    const recreatedLanguageIds = languageIds.map((languageId) => {
      return recreateObjectIdField(languageId);
    });

    const hiddenWordLanguageIdInIdsCondition = { hiddenWordLanguageId: { $in: recreatedLanguageIds } };

    return hiddenWordLanguageIdInIdsCondition;
  };

  private static createCreatedAtCondition = (fromDate?: Date, toDate?: Date): FilterQuery<ITask> => {
    const fromDateCondition = TasksRepository.createLimitingDateFromBelowCondition(fromDate);
    const toDateCondition = TasksRepository.createLimitingDateFromAboveCondition(toDate);

    if (TasksRepository.areDateConditionsEmpty(fromDateCondition, toDateCondition)) {
      return {};
    }

    const createdAtCondition = { createdAt: { ...fromDateCondition, ...toDateCondition } };

    return createdAtCondition;
  };

  private static createLimitingDateFromBelowCondition = (fromDate?: Date): FilterQuery<ITask> => {
    if (!fromDate) {
      return {};
    }

    const fromDateCondition = { $gte: fromDate };

    return fromDateCondition;
  };

  private static createLimitingDateFromAboveCondition = (toDate?: Date): FilterQuery<ITask> => {
    if (!toDate) {
      return {};
    }

    const toDateCondition = { $lte: toDate };

    return toDateCondition;
  };

  private static areDateConditionsEmpty = (fromDate: FilterQuery<ITask>, toDate: FilterQuery<ITask>): boolean => {
    const conditionsAreEmpty = isObjectEmpty(fromDate) && isObjectEmpty(toDate);
    return conditionsAreEmpty;
  };

  static create = async (taskData: CreateTaskData): Promise<ITask> => {
    const createdTask = await Task.create(taskData);
    return createdTask;
  };

  static update = async (_id: ObjectId, taskData: UpdateTaskData): Promise<ITask> => {
    await Task.updateOne({ _id }, taskData);

    const updatedTask1 = (await TasksRepository.findOneByCondition({ _id })) as ITask;

    return updatedTask1;
  };
}
