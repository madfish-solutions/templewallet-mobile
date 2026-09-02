import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { getChainLogoName } from 'src/components/crypto-logo/utils';
import { RadioCircle } from 'src/components/styled-radio-group/radio-group/radio-circle';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { setTestID } from 'src/utils/test-id.utils';

import { useNetworkSelectStyles } from './styles';

interface Props extends TestIdProps {
  selected: TempleChainKind;
  disabled?: boolean;
  onSelect: SyncFn<TempleChainKind>;
}

const NETWORKS: Array<{ chainKind: TempleChainKind; label: string }> = [
  { chainKind: TempleChainKind.Tezos, label: 'Tezos' },
  { chainKind: TempleChainKind.EVM, label: 'Etherlink' }
];

export const NetworkSelect = memo<Props>(({ selected, disabled = false, onSelect, testID }) => {
  const styles = useNetworkSelectStyles();
  const colors = useColors();
  const { trackEvent } = useAnalytics();

  const handlePress = (chainKind: TempleChainKind) => {
    if (chainKind !== selected) {
      onSelect(chainKind);
      trackEvent(testID, AnalyticsEventCategory.FormChange, { network: chainKind });
    }
  };

  return (
    <View style={styles.root}>
      {NETWORKS.map(({ chainKind, label }) => (
        <TouchableOpacity
          key={chainKind}
          style={styles.row}
          disabled={disabled}
          onPress={() => handlePress(chainKind)}
          {...setTestID(isDefined(testID) ? `${testID}/${chainKind}` : undefined)}
        >
          <CryptoLogo name={getChainLogoName(chainKind)} size={formatSize(36)} style={styles.logo} />
          <Text style={styles.name}>{label}</Text>
          <RadioCircle selected={selected === chainKind} color={colors.orange} size={formatSize(16)} />
        </TouchableOpacity>
      ))}
    </View>
  );
});
