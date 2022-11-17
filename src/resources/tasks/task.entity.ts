import { TASK_STATUS, TASK_TYPE } from './tasks.constants';

let tasksCounter = 1;

export class Task {
  id: number;

  constructor(
    public readonly userId: number,
    public readonly hiddenWordId: number,
    public readonly type: TASK_TYPE,
    public readonly status: TASK_STATUS,
    public readonly correctAnswers: string[] | null,
    public readonly receivedAnswer: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.id = tasksCounter;
    tasksCounter += 1;
  }
}
