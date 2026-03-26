import { useMemo } from 'react';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { SAPLING_CONTRACT_ADDRESS } from 'src/config/sapling';
import { ActivityTypeEnum } from 'src/enums/activity-type.enum';
import { ActivityGroup, emptyActivity } from 'src/interfaces/activity.interface';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { useColors } from 'src/styles/use-colors';
import { isString } from 'src/utils/is-string';

const SHIELDED_TRANSFER_LABEL = 'Shielded transfer';

const isSaplingOperation = (group: ActivityGroup): boolean =>
  group.some(
    activity =>
      activity.destination?.address === SAPLING_CONTRACT_ADDRESS ||
      activity.source?.address === SAPLING_CONTRACT_ADDRESS
  );

export const useActivityGroupInfo = (group: ActivityGroup) => {
  const colors = useColors();
  const publicKeyHash = useCurrentAccountPkhSelector();

  return useMemo<[IconNameEnum, string, string]>(() => {
    if (isSaplingOperation(group)) {
      const label = SHIELDED_TRANSFER_LABEL;

      const isShielding = group.some(
        activity =>
          activity.amount.startsWith('-') &&
          activity.amount !== '-0' &&
          activity.destination?.address === SAPLING_CONTRACT_ADDRESS
      );

      if (isShielding) {
        return [IconNameEnum.ArrowUp, colors.destructive, label];
      }

      return [IconNameEnum.ArrowDown, colors.adding, label];
    }

    if (group.length > 1) {
      return [IconNameEnum.Clipboard, colors.gray1, 'Interaction'];
    }

    const firstActivity = group[0] ?? emptyActivity;

    switch (firstActivity.type) {
      case ActivityTypeEnum.Transaction:
        if (firstActivity.source.address !== publicKeyHash) {
          return [IconNameEnum.ArrowDown, colors.adding, firstActivity.source.alias ?? 'Received'];
        }

        return [
          IconNameEnum.ArrowUp,
          colors.destructive,
          isString(firstActivity.entrypoint)
            ? `Called ${firstActivity.entrypoint}`
            : firstActivity.destination.alias ?? 'Sent'
        ];
      case ActivityTypeEnum.Delegation:
        const alias = firstActivity.destination.alias;
        const postfix = isString(alias) ? ` to ${alias}` : '';

        return [
          IconNameEnum.Deal,
          colors.gray1,
          isString(firstActivity.destination.address) ? 'Delegated' + postfix : 'Undelegated'
        ];
      default:
        return [IconNameEnum.Clipboard, colors.gray1, 'Undelegated'];
    }
  }, [group, publicKeyHash, colors]);
};
