import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { ActivityTypeEnum } from '../../../../enums/activity-type.enum';
import { ActivityGroup, emptyActivity } from '../../../../interfaces/activity.interface';
import { useSelectedAccountSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { isString } from '../../../../utils/is-string';
import { useActivityGroupTypeStyles } from './activity-group-type.styles';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupType: FC<Props> = ({ group }) => {
  const colors = useColors();
  const styles = useActivityGroupTypeStyles();

  const publicKeyHash = useSelectedAccountSelector().publicKeyHash;

  const [iconName, iconColor, typeText] = useMemo<[IconNameEnum, string, string]>(() => {
    if (group.length > 1) {
      return [IconNameEnum.Clipboard, colors.gray1, 'Interaction'];
    }

    const firstActivity = group[0] ?? emptyActivity;

    if (firstActivity.type === ActivityTypeEnum.Transaction) {
      if (firstActivity.source.address === publicKeyHash) {
        return [
          IconNameEnum.ArrowUp,
          colors.destructive,
          isString(firstActivity.entrypoint) ? `Called ${firstActivity.entrypoint}` : 'Sent'
        ];
      } else {
        return [IconNameEnum.ArrowDown, colors.adding, 'Received'];
      }
    } else {
      if (firstActivity.type === ActivityTypeEnum.Delegation) {
        return [
          IconNameEnum.Deal,
          colors.gray1,
          isString(firstActivity.destination.address) ? 'Delegated' : 'Undelegated'
        ];
      } else {
        return [IconNameEnum.Clipboard, colors.gray1, 'Undelegated'];
      }
    }
  }, [group, publicKeyHash, colors]);

  return (
    <View style={styles.container}>
      <Icon name={iconName} color={iconColor} />
      <Divider size={formatSize(4)} />
      <Text style={styles.text}>{typeText}</Text>
    </View>
  );
};
