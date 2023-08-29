import { TzktOperationStatus } from '@temple-wallet/transactions-parser';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { ActivityStatusEnum } from '../../../../enums/activity-status.enum';
import { useColors } from '../../../../styles/use-colors';
import { useActivityStatusBadgeStyles } from './activity-status-badge.styles';

interface Props {
  status: ActivityStatusEnum | TzktOperationStatus;
}

export const ActivityStatusBadge: FC<Props> = ({ status }) => {
  const colors = useColors();
  const styles = useActivityStatusBadgeStyles();

  const backgroundColor = useMemo(() => {
    let result = colors.destructive;

    (status === ActivityStatusEnum.Pending || status === TzktOperationStatus.Pending) && (result = colors.gray2);
    (status === ActivityStatusEnum.Applied || status === TzktOperationStatus.Applied) && (result = colors.adding);

    return result;
  }, [status, colors]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
};
