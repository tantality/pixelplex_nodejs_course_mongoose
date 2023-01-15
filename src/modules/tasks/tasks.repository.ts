import { Task } from '../../models/task.model';
import { CreateTaskData, ITask } from './types';

export class TasksRepository {
  static create = async (taskData: CreateTaskData): Promise<ITask> => {
    const createdTask = await Task.create(taskData);
    return createdTask;
  };
}
