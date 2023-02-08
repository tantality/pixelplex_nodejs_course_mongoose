import { Aggregate, FilterQuery, ObjectId, PipelineStage, ProjectionType } from 'mongoose';
import { SortingConditionWithDirectionAsNumber, SORT_DIRECTION } from '../../types';
import { changeTypeFromObjectIdToTypesObjectId, changeTypeOfArrayFromObjectIdToTypesObjectId, getSortDirectionAsNumber } from '../../utils';
import { LanguagesRepository } from '../languages/languages.repository';
import { Task } from './task.model';
import { DEFAULT_ANSWER_STATISTICS } from './tasks.constants';
import { AnswerStatisticsByLanguage, CreateTaskData, GetStatisticsQuery, GetTasksQuery, ITask, TASK_SORT_BY, UpdateTaskData } from './types';
import { isObjectEmpty } from './utils';

export class TasksRepository {
  static DTO_FIELD_SELECTION_CONFIG: ProjectionType<ITask> = {
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

  static findAndCountAll = async (userId: ObjectId, query: GetTasksQuery): Promise<{ count: number; tasks: ITask[] }> => {
    const { sortDirection, sortBy, limit, offset, ...conditionParameters } = query;

    const findingCondition = TasksRepository.createFindingConditionForTasks({ ...conditionParameters, userId });
    const sortingCondition = TasksRepository.createSortingConditionForTasks(sortBy, sortDirection);

    const tasksCountPromise = TasksRepository.countAll(findingCondition);
    const tasksAggregate: Aggregate<ITask[]> = Task.aggregate([
      { $match: findingCondition },
      { $project: TasksRepository.DTO_FIELD_SELECTION_CONFIG as { [field: string]: any } },
      { $sort: sortingCondition },
      { $skip: offset },
      { $limit: limit },
    ]);

    const [count, tasks] = await Promise.all([tasksCountPromise, tasksAggregate]);

    return { count, tasks };
  };

  private static createFindingConditionForTasks = (
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

  private static createSortingConditionForTasks = (sortBy: string, sortDirection: string): SortingConditionWithDirectionAsNumber<ITask> => {
    let sortingCondition: SortingConditionWithDirectionAsNumber<ITask> = {};
    const sortDirectionAsNumber = getSortDirectionAsNumber(sortDirection as SORT_DIRECTION);

    switch (sortBy) {
    case TASK_SORT_BY.DATE: {
      sortingCondition = { createdAt: sortDirectionAsNumber };
      break;
    }
    }

    return sortingCondition;
  };

  static countAll = async (condition: FilterQuery<ITask>): Promise<number> => {
    const count = await Task.where(condition).countDocuments();
    return count;
  };

  static calculateAnswerStatisticsByLanguage = async (
    userId: ObjectId,
    query: GetStatisticsQuery,
  ): Promise<{ statistics: AnswerStatisticsByLanguage[] }> => {
    const findingCondition = TasksRepository.createFindingConditionForCalculateStatistics({ ...query, userId });

    const statistics: AnswerStatisticsByLanguage[] = await Task.aggregate([
      { $match: findingCondition },
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

  private static createFindingConditionForCalculateStatistics = (
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
        { $project: LanguagesRepository.DTO_FIELD_SELECTION_CONFIG as { [field: string]: any } },
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

  static findOne = async (condition: FilterQuery<ITask>): Promise<ITask | null> => {
    const task = await Task.findOne(condition);
    return task;
  };
}
