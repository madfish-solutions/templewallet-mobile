import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { Divider } from 'src/components/divider/divider';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { NetworkFilter } from 'src/hooks/use-asset-selection';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { useAssetNetworkFilterStyles } from './asset-network-filter.styles';

const NETWORK_FILTERS: Array<{ label: string; value: NetworkFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Tezos', value: TempleChainKind.Tezos },
  { label: 'Etherlink', value: TempleChainKind.EVM }
];

interface Props {
  value: NetworkFilter;
  onChange: (value: NetworkFilter) => void;
}

export const AssetNetworkFilter: FC<Props> = ({ value, onChange }) => {
  const styles = useAssetNetworkFilterStyles();
  const colors = useColors();

  return (
    <View style={styles.filterRow}>
      {NETWORK_FILTERS.map(filter => (
        <TouchableOpacity
          key={filter.value}
          style={[styles.filterChip, value === filter.value && styles.filterChipSelected]}
          onPress={() => onChange(filter.value)}
        >
          <View style={styles.filterIconContainer}>
            {filter.value === 'all' ? (
              <IconV2 name={IconNameV2Enum.Earth} color={colors.blue} />
            ) : (
              <CryptoLogo
                name={filter.value === TempleChainKind.Tezos ? CryptoLogoNameEnum.Tezos : CryptoLogoNameEnum.Etherlink}
                size={formatSize(20)}
              />
            )}
          </View>
          <Divider size={formatSize(4)} />
          <Text style={[styles.filterChipText, value === filter.value && styles.filterChipTextSelected]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
