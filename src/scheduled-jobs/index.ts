import { createExpiredRefreshTokensDeletionJob } from './delete-expired-refresh-tokens.job';

export const startScheduledJobs = (): void => {
  createExpiredRefreshTokensDeletionJob().start();
};
