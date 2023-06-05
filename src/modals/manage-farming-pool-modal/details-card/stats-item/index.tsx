import { BigNumber } from 'bignumber.js';
import React, { FC, ReactChild, useMemo } from 'react';
import { Text, View } from 'react-native';

import { FormattedAmount } from 'src/components/formatted-amount';
import {
  useCurrentFiatCurrencyMetadataSelector,
  useFiatToUsdRateSelector
} from 'src/store/settings/settings-selectors';
import { isDefined } from 'src/utils/is-defined';

import { useStatsItemStyles } from './styles';

interface StatsItemProps {
  title: string;
  loading: boolean;
  value: ReactChild | ReactChild[];
  usdEquivalent?: BigNumber;
}

export const StatsItem: FC<StatsItemProps> = ({ loading, title, value, usdEquivalent }) => {
  const { symbol: fiatSymbol } = useCurrentFiatCurrencyMetadataSelector();
  const fiatToUsdRate = useFiatToUsdRateSelector();
  const styles = useStatsItemStyles();
  const fiatEquity = useMemo(
    () => (isDefined(fiatToUsdRate) ? usdEquivalent?.times(fiatToUsdRate) : undefined),
    [usdEquivalent, fiatToUsdRate]
  );

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      {loading ? <Text style={styles.loader}>---</Text> : value}
      {isDefined(fiatEquity) && (
        <FormattedAmount
          style={styles.fiatEquity}
          isDollarValue
          showAllDecimalPlaces
          symbol={fiatSymbol}
          amount={fiatEquity}
        />
      )}
    </View>
  );
};
