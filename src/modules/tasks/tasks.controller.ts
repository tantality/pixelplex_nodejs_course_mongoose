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
  GetStatisticsCommon,
} from './types';

export class TasksController {
  static getTasks = async (req: GetTasksRequest, res: GetTasksResponse, next: NextFunction): Promise<void> => {
    try {
      const tasks = await TasksService.findAndCountAll(req.userId as ObjectId, req.query);
      res.status(200).json(tasks);
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
      const updatedTask = await TasksService.update(req.userId as ObjectId, req.params, req.body);
      res.status(200).json(updatedTask);
    } catch (err) {
      next(err);
    }
  };
}
