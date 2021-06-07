import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

import { ActivityGroupsList } from '../../../components/activity-groups-list/activity-groups-list';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ActivityGroup } from '../../../interfaces/activity.interface';
import { ScreensEnum } from '../../../navigator/screens.enum';
import { useNavigation } from '../../../navigator/use-navigation.hook';
import { useActivityGroupsSelector } from '../../../store/activity/activity-selectors';
import { useSelectedBakerSelector } from '../../../store/baking/baking-selectors';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { isDefined } from '../../../utils/is-defined';
import { useTezosTokenHistoryStyles } from './tezos-token-history.styles';

export const TezosTokenHistory = () => {
  const colors = useColors();
  const styles = useTezosTokenHistoryStyles();
  const { navigate } = useNavigation();
  const [, isBakerSelected] = useSelectedBakerSelector();
  const activityGroups = useActivityGroupsSelector();

  const [filteredActivityGroups, setFilteredActivityGroupsList] = useState<ActivityGroup[]>([]);

  useEffect(() => {
    const result: ActivityGroup[] = [];

    for (const activityGroup of activityGroups) {
      for (const activity of activityGroup) {
        if (!isDefined(activity.tokenSlug)) {
          result.push(activityGroup);
          break;
        }
      }
    }

    setFilteredActivityGroupsList(result);
  }, [activityGroups]);

  return (
    <>
      <TouchableOpacity style={styles.delegateContainer} onPress={() => navigate(ScreensEnum.Delegation)}>
        {isBakerSelected ? (
          <Text style={styles.delegateText}>Rewards & Redelegate</Text>
        ) : (
          <Text style={styles.delegateText}>
            Delegate your XTZ and earn up to <Text style={styles.apyText}>8% APY</Text>
          </Text>
        )}
        <Icon name={IconNameEnum.ChevronRight} color={colors.white} size={formatSize(24)} />
      </TouchableOpacity>

      <ActivityGroupsList activityGroups={filteredActivityGroups} />
    </>
  );
};
