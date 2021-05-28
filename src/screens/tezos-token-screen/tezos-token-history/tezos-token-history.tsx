import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreensEnum } from '../../../navigator/screens.enum';
import { useNavigation } from '../../../navigator/use-navigation.hook';
import { useSelectedBakerSelector } from '../../../store/baking/baking-selectors';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { useTezosTokenHistoryStyles } from './tezos-token-history.styles';

export const TezosTokenHistory = () => {
  const colors = useColors();
  const styles = useTezosTokenHistoryStyles();
  const { navigate } = useNavigation();
  const [, isBakerSelected] = useSelectedBakerSelector();

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

      <DataPlaceholder text="Operations will be available soon" />
    </>
  );
};
