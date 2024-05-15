import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { OptionalFormattedAmount } from 'src/components/optional-formatted-amount';
import { useCurrentFiatCurrencyMetadataSelector } from 'src/store/settings/settings-selectors';

import { AssetAmounts } from '../use-amounts';

import { useStatsItemStyles } from './styles';

interface Props {
  title: string;
  amounts: AssetAmounts;
  wasLoading: boolean;
  fiatEquivalentIsMain: boolean;
  tokenSymbol: string;
}

export const StatsItem = memo<Props>(({ title, amounts, wasLoading, fiatEquivalentIsMain, tokenSymbol }) => {
  const { symbol: fiatSymbol } = useCurrentFiatCurrencyMetadataSelector();
  const styles = useStatsItemStyles();

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      <OptionalFormattedAmount
        isDollarValue={fiatEquivalentIsMain}
        symbol={fiatEquivalentIsMain ? undefined : tokenSymbol}
        amount={wasLoading ? (fiatEquivalentIsMain ? amounts.fiatEquivalent : amounts.amount) : undefined}
        style={styles.value}
      />
      {!fiatEquivalentIsMain && (
        <OptionalFormattedAmount
          style={styles.fiatEquity}
          isDollarValue
          showAllDecimalPlaces
          symbol={fiatSymbol}
          amount={amounts.fiatEquivalent}
        />
      )}
    </View>
  );
});
