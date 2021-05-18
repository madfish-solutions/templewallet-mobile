import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text } from 'react-native';

import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TokenHistoryPlaceholder } from '../../../components/token-history-placeholder/token-history-placeholder';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { useTezosTokenHistoryStyles } from './tezos-token-history.styles';

export const TezosTokenHistory = () => {
  const styles = useTezosTokenHistoryStyles();
  const colors = useColors();

  return (
    <>
      <TouchableOpacity style={styles.delegateContainer}>
        <Text style={styles.delegateText}>
          Delegate your XTZ and earn up to <Text style={styles.apyText}>8% APY</Text>
        </Text>
        <Icon name={IconNameEnum.ChevronRight} color={colors.white} size={formatSize(24)} />
      </TouchableOpacity>

      <TokenHistoryPlaceholder />
    </>
  );
};
