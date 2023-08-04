import { Activity } from '@temple-wallet/transactions-parser';
import React, { FC, useState, useCallback } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { NonZeroAmounts } from 'src/interfaces/non-zero-amounts.interface';
import { formatSize } from 'src/styles/format-size';

import { ActivityDetailsCard } from './activity-details-card/activity-details-card';
import { useActivityCommonStyles, useActivityDetailsStyles } from './activity-group-item.styles';
import { ActivityStatusBadge } from './activity-status-badge/activity-status-badge';
import { ActivityTime } from './activity-time/activity-time';
import { ActivityGroupItemSelectors } from './selectors';

interface Props {
  activity: Activity;
  nonZeroAmounts: NonZeroAmounts;
}

export const ActivityDetails: FC<Props> = ({ activity, nonZeroAmounts }) => {
  const detailsStyles = useActivityDetailsStyles();
  const commonStyles = useActivityCommonStyles();

  const [areDetailsVisible, setAreDetailsVisible] = useState(false);
  const handleOpenActivityDetailsPress = useCallback(() => setAreDetailsVisible(prevState => !prevState), []);

  return (
    <View>
      <View style={[commonStyles.row, commonStyles.justifyBetween]}>
        <View style={[commonStyles.row, commonStyles.itemsCenter]}>
          <ActivityStatusBadge status={activity.status} />
          <Divider size={formatSize(4)} />
          <ActivityTime timestamp={activity.timestamp} />
        </View>
        <TouchableWithAnalytics
          style={detailsStyles.chevron}
          testID={ActivityGroupItemSelectors.details}
          onPress={handleOpenActivityDetailsPress}
        >
          <Icon name={areDetailsVisible ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown} />
        </TouchableWithAnalytics>
      </View>
      {areDetailsVisible && (
        <View style={detailsStyles.card}>
          <ActivityDetailsCard nonZeroAmounts={nonZeroAmounts} activity={activity} />
        </View>
      )}
    </View>
  );
};
