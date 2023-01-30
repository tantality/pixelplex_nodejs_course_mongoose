import { Aggregate, FilterQuery, ObjectId, PipelineStage, ProjectionType } from 'mongoose';
import { changeTypeFromObjectIdToTypesObjectId, changeTypeOfArrayFromObjectIdToTypesObjectId } from '../../utils';
import { Task } from './task.model';
import { DEFAULT_ANSWER_STATISTICS } from './tasks.constants';
import { AnswerStatisticsByLanguage, CreateTaskData, GetStatisticsQuery, GetTasksQuery, ITask, UpdateTaskData } from './types';
import { createSortingCondition, isObjectEmpty } from './utils';

export class TasksRepository {
  static findAndCountAll = async (userId: ObjectId, query: GetTasksQuery): Promise<{ count: number; tasks: ITask[] }> => {
    const { sortDirection, sortBy, limit, offset, ...conditionParameters } = query;

    const findCondition = TasksRepository.createConditionToFindTasks({ ...conditionParameters, userId });
    const fieldSelectionConfig = TasksRepository.createDTOFieldSelectionConfig();
    const sortingCondition = createSortingCondition(sortBy, sortDirection);

    const tasksCountPromise = TasksRepository.countAll(findCondition);
    const tasksAggregate: Aggregate<ITask[]> = Task.aggregate([
      { $match: findCondition },
      { $project: fieldSelectionConfig as { [field: string]: any } },
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
      userId: changeTypeFromObjectIdToTypesObjectId(userId),
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

    const recreatedLanguageId = changeTypeFromObjectIdToTypesObjectId(languageId);
    const languagesCondition = { $or: [{ nativeLanguageId: recreatedLanguageId }, { foreignLanguageId: recreatedLanguageId }] };

    return languagesCondition;
  };

  private static createDTOFieldSelectionConfig = (): ProjectionType<ITask> => {
    const fieldSelectionConfig: ProjectionType<ITask> = {
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

    return fieldSelectionConfig;
  };

  static countAll = async (condition: FilterQuery<ITask>): Promise<number> => {
    const count = await Task.where(condition).countDocuments();
    return count;
  };

  static findOne = async (condition: FilterQuery<ITask>): Promise<ITask | null> => {
    const task = await Task.findOne(condition);
    return task;
  };

  static calculateAnswerStatisticsByLanguage = async (
    userId: ObjectId,
    query: GetStatisticsQuery,
  ): Promise<{ statistics: AnswerStatisticsByLanguage[] }> => {
    const findCondition = TasksRepository.createFindConditionToCalculateStatistics({ ...query, userId });

    const statistics: AnswerStatisticsByLanguage[] = await Task.aggregate([
      { $match: findCondition },
      { $group: TasksRepository.countAnswersNumberForGroupStage() },
      { $group: TasksRepository.formAnswerStatisticsForGroupStage() },
      { $set: { defaultAnswerStatistics: DEFAULT_ANSWER_STATISTICS } },
      { $lookup: TasksRepository.getLanguageByHiddenWordLanguageIdInArrayForLookUpStage() },
      { $set: { language: { $first: '$language' } } },
      { $set: { missedStatuses: { $setDifference: ['$defaultAnswerStatistics.status', '$answerStatistics.status'] } } },
      { $project: TasksRepository.filterMissedDefaultAnswersStatisticsForProjectStage() },
      {
        $project: {
          answers: { $concatArrays: ['$missedDefaultAnswerStatistics', '$answerStatistics'] },
          language: 1,
        },
      },
    ]);

    return { statistics };
  };

  private static createFindConditionToCalculateStatistics = (
    conditionParameters: GetStatisticsQuery & { userId: ObjectId },
  ): FilterQuery<ITask> => {
    const { fromDate, toDate, languageIds, userId } = conditionParameters;

    const hiddenWordLanguageIdCondition = TasksRepository.createHiddenWordLanguageIdInIdsCondition(languageIds);
    const createdAtCondition = TasksRepository.createCreatedAtCondition(fromDate, toDate);

    const condition: FilterQuery<ITask> = {
      userId: changeTypeFromObjectIdToTypesObjectId(userId),
      ...hiddenWordLanguageIdCondition,
      ...createdAtCondition,
    };

    return condition;
  };

  private static createHiddenWordLanguageIdInIdsCondition = (languageIds?: ObjectId[]): FilterQuery<ITask> => {
    if (!languageIds) {
      return {};
    }

    const updatedLanguageIds = changeTypeOfArrayFromObjectIdToTypesObjectId(languageIds);

    const hiddenWordLanguageIdInIdsCondition = { hiddenWordLanguageId: { $in: updatedLanguageIds } };

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
    return isObjectEmpty(fromDate) && isObjectEmpty(toDate);
  };

  private static countAnswersNumberForGroupStage = (): PipelineStage.Group['$group'] => {
    const groupConfig: PipelineStage.Group['$group'] = {
      _id: {
        hiddenWordLanguageId: '$hiddenWordLanguageId',
        status: '$status',
      },
      count: { $sum: 1 },
    };

    return groupConfig;
  };

  private static formAnswerStatisticsForGroupStage = (): PipelineStage.Group['$group'] => {
    const groupConfig: PipelineStage.Group['$group'] = {
      _id: '$_id.hiddenWordLanguageId',
      answerStatistics: {
        $push: {
          count: '$count',
          status: '$_id.status',
        },
      },
      hiddenWordLanguageId: { $first: '$_id.hiddenWordLanguageId' },
    };

    return groupConfig;
  };

  private static getLanguageByHiddenWordLanguageIdInArrayForLookUpStage = (): PipelineStage.Lookup['$lookup'] => {
    const lookUpConfig: PipelineStage.Lookup['$lookup'] = {
      from: 'languages',
      let: { hiddenWordLanguageId: '$hiddenWordLanguageId' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$hiddenWordLanguageId'] } } },
        { $project: { _id: 0, id: '$_id', code: 1, name: 1, createdAt: 1 } },
      ],
      as: 'language',
    };

    return lookUpConfig;
  };

  private static filterMissedDefaultAnswersStatisticsForProjectStage = (): PipelineStage.Project['$project'] => {
    const projectConfig: PipelineStage.Project['$project'] = {
      _id: 0,
      language: 1,
      answerStatistics: 1,
      missedDefaultAnswerStatistics: {
        $filter: {
          input: '$defaultAnswerStatistics',
          as: 'statistics',
          cond: { $in: ['$$statistics.status', '$missedStatuses'] },
        },
      },
    };

    return projectConfig;
  };

  static create = async (taskData: CreateTaskData): Promise<ITask> => {
    const createdTask = await Task.create(taskData);
    return createdTask;
  };

  static update = async (_id: ObjectId, taskData: UpdateTaskData): Promise<ITask> => {
    await Task.updateOne({ _id }, taskData);

    const updatedTask = (await TasksRepository.findOne({ _id })) as ITask;

    return updatedTask;
  };
}
