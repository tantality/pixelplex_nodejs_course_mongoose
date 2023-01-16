import { FilterQuery, ObjectId } from 'mongoose';
import { Task } from '../../models/task.model';
import { CreateTaskData, ITask, UpdateTaskData } from './types';

export class TasksRepository {
  static findOneByCondition = async (condition: FilterQuery<ITask>): Promise<ITask | null> => {
    const task = await Task.findOne(condition);
    return task;
  };

  static create = async (taskData: CreateTaskData): Promise<ITask> => {
    const createdTask = await Task.create(taskData);
    return createdTask;
  };

  static update = async (_id: ObjectId, taskData: UpdateTaskData): Promise<ITask> => {
    await Task.updateOne({ _id }, taskData);

    const updatedTask = (await TasksRepository.findOneByCondition({ _id })) as ITask;

    return updatedTask;
  };
}
