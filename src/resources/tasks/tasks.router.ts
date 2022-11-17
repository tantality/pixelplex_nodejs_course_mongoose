import { Router, Application } from 'express';
import { checkSchema } from 'express-validator';
import { validatePayload } from '../../middleware';
import { TasksController } from './tasks.controller';
import { TasksValidation } from './tasks.validation';

const router = Router();

router.get('/', checkSchema(TasksValidation.getTasks), validatePayload, TasksController.getTasks);
router.get('/statistics', checkSchema(TasksValidation.getStatistics), validatePayload, TasksController.getStatistics);
router.post('/', checkSchema(TasksValidation.createTask), validatePayload, TasksController.createTask);
router.post(
  '/:taskId/answer',
  checkSchema(TasksValidation.addAnswerToTask),
  validatePayload,
  TasksController.addAnswerToTask,
);

export function mountTasksRouter(app: Application): void {
  app.use('/api/v1/tasks', router);
}
