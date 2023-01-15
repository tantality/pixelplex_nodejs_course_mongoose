import { LanguageDTO } from '../../languages/language.dto';
import { TaskDTO } from '../task.dto';

export type GetTasksCommon = { count: number; tasks: TaskDTO[] };
export type GetStatisticsCommon = { language: LanguageDTO; answers: { correct: number; incorrect: number } }[];
