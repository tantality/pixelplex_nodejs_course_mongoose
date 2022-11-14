import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { validatePayload } from '../../middleware';
import { TasksController } from './tasks.controller';
import { TasksValidation } from './tasks.validation';

const router = Router();

router.get('/', checkSchema(TasksValidation.getTasksSchema), validatePayload, TasksController.getTasks);
router.get(
  '/statistics',
  checkSchema(TasksValidation.getStatisticsSchema),
  validatePayload,
  TasksController.getStatistics,
);
router.post('/', checkSchema(TasksValidation.createTaskSchema), validatePayload, TasksController.createTask);
router.post(
  '/:taskId/answer',
  checkSchema(TasksValidation.addAnswerToTaskSchema),
  validatePayload,
  TasksController.addAnswerToTask,
);

export function mountTasksRouter(app: Application): void {
  app.use('/tasks', router);
}
