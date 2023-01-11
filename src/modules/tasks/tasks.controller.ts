import { NextFunction } from 'express';
import { TasksService } from './tasks.service';
import {
  GetTasksRequest,
  GetTasksResponse,
  GetStatisticsRequest,
  GetStatisticsResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  GetTasksCommon,
  GetStatisticsCommon,
  CreateTaskCommon,
} from './types';

export class TasksController {
  static getTasks = async (req: GetTasksRequest, res: GetTasksResponse, next: NextFunction): Promise<void> => {
    try {
      const tasks = await TasksService.findAll(req);
      res.status(200).json(tasks as GetTasksCommon);
    } catch (err) {
      next(err);
    }
  };

  static getStatistics = async (req: GetStatisticsRequest, res: GetStatisticsResponse, next: NextFunction): Promise<void> => {
    try {
      const statistics = await TasksService.calculateStatistics(req);
      res.status(200).json({ statistics: statistics as GetStatisticsCommon });
    } catch (err) {
      next(err);
    }
  };

  static createTask = async (req: CreateTaskRequest, res: CreateTaskResponse, next: NextFunction): Promise<void> => {
    try {
      const task = await TasksService.create(req);
      res.status(201).json(task as CreateTaskCommon);
    } catch (err) {
      next(err);
    }
  };

  static updateTask = async (req: UpdateTaskRequest, res: UpdateTaskResponse, next: NextFunction): Promise<void> => {
    try {
      const task = await TasksService.update(req);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  };
}
