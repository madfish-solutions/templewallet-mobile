import { IconNameEnum } from 'src/components/icon/icon-name.enum';

export enum CycleStatus {
  UNLOCKED = 'UNLOCKED',
  FUTURE = 'FUTURE',
  IN_PROGRESS = 'IN_PROGRESS'
}

export const getCycleStatusIcon = (status: CycleStatus) => {
  let icon = IconNameEnum.CycleStatusInProgress;

  switch (status) {
    case CycleStatus.UNLOCKED:
      icon = IconNameEnum.CycleStatusUnlocked;
      break;
    case CycleStatus.FUTURE:
      icon = IconNameEnum.CycleStatusFuture;
      break;
  }

  return icon;
};
