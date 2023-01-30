import { AnswerStatistics, TASK_STATUS } from './types';

export const DEFAULT_ANSWER_STATISTICS: AnswerStatistics[] = [
  { count: 0, status: TASK_STATUS.UNANSWERED },
  { count: 0, status: TASK_STATUS.CORRECT },
  { count: 0, status: TASK_STATUS.INCORRECT },
];
