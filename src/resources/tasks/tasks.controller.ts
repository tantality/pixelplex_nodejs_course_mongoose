/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { TasksService } from './tasks.service';
import {
  GetTasksRequest,
  GetTasksResponse,
  GetStatisticsRequest,
  GetStatisticsResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  AddAnswerToTaskRequest,
  AddAnswerToTaskResponse,
  GetTasksCommon,
  GetStatisticsCommon,
  CreateTaskCommon,
} from './types';

export class TasksController {
  static getTasks = async (req: GetTasksRequest, res: GetTasksResponse, next: NextFunction): Promise<void> => {
    const tasks = await TasksService.findAll(req);
    res.status(200).json(tasks as GetTasksCommon);
  };

  static getStatistics = async (req: GetStatisticsRequest, res: GetStatisticsResponse, next: NextFunction): Promise<void> => {
    const statistics = await TasksService.calculateStatistics(req);
    res.status(200).json({ statistics: statistics as GetStatisticsCommon });
  };

  static createTask = async (req: CreateTaskRequest, res: CreateTaskResponse, next: NextFunction): Promise<void> => {
    const task = await TasksService.create(req);
    res.status(200).json(task as CreateTaskCommon);
  };

  static addAnswerToTask = async (req: AddAnswerToTaskRequest, res: AddAnswerToTaskResponse, next: NextFunction): Promise<void> => {
    const task = await TasksService.addAnswer(req);
    res.status(200).json(task);
  };
}
