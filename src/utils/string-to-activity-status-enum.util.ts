import { ActivityStatusEnum } from '../enums/activity-status.enum';

export const stringToActivityStatusEnum = (status: string): ActivityStatusEnum => {
  switch (status) {
    case 'applied':
      return ActivityStatusEnum.Applied;
    case 'backtracked':
      return ActivityStatusEnum.Backtracked;
    case 'skipped':
      return ActivityStatusEnum.Skipped;
    case 'failed':
      return ActivityStatusEnum.Failed;
    case 'pending':
      return ActivityStatusEnum.Pending;
    default:
      return ActivityStatusEnum.Pending;
  }
};
