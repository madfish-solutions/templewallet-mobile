import { useMemo } from 'react';

import { ActivityTypeEnum } from '../../../../enums/activity-type.enum';
import { ActivityGroup, emptyActivity } from '../../../../interfaces/activity.interface';
import { useSelectedAccountSelector } from '../../../../store/wallet/wallet-selectors';
import { useColors } from '../../../../styles/use-colors';
import { isString } from '../../../../utils/is-string';
import { IconNameEnum } from '../../../icon/icon-name.enum';

export type IconGroupType = [IconNameEnum, string, string];

export const useActivityGroupInfo = (group: ActivityGroup): IconGroupType => {
  const colors = useColors();
  const publicKeyHash = useSelectedAccountSelector().publicKeyHash;
  const [iconName, iconColor, typeText] = useMemo<IconGroupType>(() => {
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

  return [iconName, iconColor, typeText];
};
