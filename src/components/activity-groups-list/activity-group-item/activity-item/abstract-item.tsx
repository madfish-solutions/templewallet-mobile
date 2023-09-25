import { TzktOperationStatus } from '@temple-wallet/transactions-parser';
import React, { FC, ReactNode, useCallback, useState } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { formatSize } from 'src/styles/format-size';

import { useActivityCommonStyles, useActivityGroupItemStyles } from '../activity-group-item.styles';
import { ActivityStatusBadge } from '../activity-status-badge/activity-status-badge';
import { ActivityTime } from '../activity-time/activity-time';
import { ActivityGroupItemSelectors } from '../selectors';

export const AbstractItem: FC<{
  status: TzktOperationStatus;
  timestamp: string;
  face: ReactNode;
  details: ReactNode;
}> = ({ status, timestamp, face, details }) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();

  const [areDetailsVisible, setAreDetailsVisible] = useState(false);
  const handleOpenActivityDetailsPress = useCallback(() => setAreDetailsVisible(prevState => !prevState), []);

  return (
    <View>
      <View style={[commonStyles.row, commonStyles.itemsCenter]}>{face}</View>
      <Divider size={formatSize(12)} />
      <View>
        <View style={[commonStyles.row, commonStyles.justifyBetween]}>
          <View style={[commonStyles.row, commonStyles.itemsCenter]}>
            <ActivityStatusBadge status={status} />
            <Divider size={formatSize(4)} />
            <ActivityTime timestamp={timestamp} />
          </View>
          <TouchableWithAnalytics
            style={styles.chevron}
            testID={ActivityGroupItemSelectors.details}
            onPress={handleOpenActivityDetailsPress}
          >
            <Icon name={areDetailsVisible ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown} />
          </TouchableWithAnalytics>
        </View>
        {areDetailsVisible && <View style={styles.card}>{details}</View>}
      </View>
    </View>
  );
};
