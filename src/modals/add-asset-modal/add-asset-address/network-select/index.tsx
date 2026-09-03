import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { getChainLogoName } from 'src/components/crypto-logo/utils';
import { RadioCircle } from 'src/components/styled-radio-group/radio-group';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { ETHERLINK_MAINNET_CHAIN_SPECS } from 'src/types/networks';

import { useNetworkSelectStyles } from './styles';

interface Props extends TestIdProps {
  selected: TempleChainKind;
  disabled: boolean;
  onSelect: SyncFn<TempleChainKind>;
}

const NETWORKS = [
  { chainKind: TempleChainKind.Tezos, label: 'Tezos' },
  { chainKind: TempleChainKind.EVM, label: ETHERLINK_MAINNET_CHAIN_SPECS.name }
];

export const NetworkSelect = memo<Props>(({ selected, disabled, onSelect, testID }) => {
  const styles = useNetworkSelectStyles();
  const colors = useColors();

  const handlePress = (chainKind: TempleChainKind) => {
    if (chainKind !== selected) {
      onSelect(chainKind);
    }
  };

  return (
    <View style={styles.root}>
      {NETWORKS.map(({ chainKind, label }) => (
        <TouchableWithAnalytics
          key={chainKind}
          style={styles.row}
          disabled={disabled}
          onPress={() => handlePress(chainKind)}
          shouldTrackShortPress={chainKind !== selected}
          testID={testID}
          testIDProperties={{ network: chainKind }}
        >
          <CryptoLogo name={getChainLogoName(chainKind)} size={formatSize(36)} style={styles.logo} />
          <Text style={styles.name}>{label}</Text>
          <RadioCircle selected={selected === chainKind} color={colors.orange} size={formatSize(16)} />
        </TouchableWithAnalytics>
      ))}
    </View>
  );
});
