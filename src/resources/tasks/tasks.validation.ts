import { Schema } from 'express-validator';

export class TasksValidation {
  static getTasksSchema: Schema = {};

  static getStatisticsSchema: Schema = {};

  static createTaskSchema: Schema = {};

  static addAnswerToTaskSchema: Schema = {};
}
