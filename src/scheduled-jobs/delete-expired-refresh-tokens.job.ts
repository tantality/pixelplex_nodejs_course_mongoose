import { CronJob } from 'cron';
import { TokensRepository } from '../modules/auth/tokens.repository';

const LAUNCH_DATE_IS_ON_SUNDAYS_AT_MIDNIGHT = '0 0 * * 0';

export const createExpiredRefreshTokensDeletionJob = (): CronJob =>
  new CronJob(LAUNCH_DATE_IS_ON_SUNDAYS_AT_MIDNIGHT, TokensRepository.deleteExpiredRefreshTokens);
