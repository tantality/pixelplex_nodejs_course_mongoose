import { NextFunction } from 'express';
import { ObjectId } from 'mongoose';
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
      const createdTask = await TasksService.create(req.userId as ObjectId, req.body);
      res.status(201).json(createdTask);
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
