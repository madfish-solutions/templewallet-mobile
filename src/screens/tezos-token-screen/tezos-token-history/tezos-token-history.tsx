import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

import { ActivityGroupsList } from '../../../components/activity-groups-list/activity-groups-list';
import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { delegationApy } from '../../../config/general';
import { ActivityGroup } from '../../../interfaces/activity.interface';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useSelectedBakerSelector } from '../../../store/baking/baking-selectors';
import { useActivityGroupsSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { TEZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';
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
      <Divider size={formatSize(8)} />
      <TouchableOpacity style={styles.delegateContainer} onPress={() => navigate(ScreensEnum.Delegation)}>
        {isBakerSelected ? (
          <Text style={styles.delegateText}>Rewards & Redelegate</Text>
        ) : (
          <Text style={styles.delegateText}>
            Delegate your {TEZ_TOKEN_METADATA.symbol} and earn up to{' '}
            <Text style={styles.apyText}>{delegationApy}% APY</Text>
          </Text>
        )}
        <Icon name={IconNameEnum.ChevronRight} color={colors.white} size={formatSize(24)} />
      </TouchableOpacity>
      <Divider size={formatSize(8)} />

      <ActivityGroupsList activityGroups={filteredActivityGroups} />
    </>
  );
};
