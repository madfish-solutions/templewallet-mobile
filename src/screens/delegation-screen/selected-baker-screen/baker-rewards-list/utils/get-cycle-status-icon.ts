import { IconNameEnum } from '../../../../../components/icon/icon-name.enum';

export enum CycleStatus {
  UNLOCKED = 'UNLOCKED',
  LOCKED = 'LOCKED',
  FUTURE = 'FUTURE',
  IN_PROGRESS = 'IN_PROGRESS'
}

export const getCycleStatusIcon = (status: CycleStatus) => {
  let icon = IconNameEnum.CycleStatusInProgress;

  switch (status) {
    case CycleStatus.UNLOCKED:
      icon = IconNameEnum.CycleStatusUnlocked;
      break;
    case CycleStatus.LOCKED:
      icon = IconNameEnum.CycleStatusLocked;
      break;
    case CycleStatus.FUTURE:
      icon = IconNameEnum.CycleStatusFuture;
      break;
  }

  return icon;
};
