import React, { FC, useCallback } from 'react';
import { Text, View } from 'react-native';

import { FormattedAmount } from 'src/components/formatted-amount';
import { FormattedAmountWithLoader } from 'src/components/formatted-amount-with-loader';
import { useCurrentFiatCurrencyMetadataSelector } from 'src/store/settings/settings-selectors';

import { AssetAmounts } from '../use-amounts';

import { useStatsItemStyles } from './styles';

interface Props {
  title: string;
  amounts: AssetAmounts;
  isLoading: boolean;
  fiatEquivalentIsMain: boolean;
  tokenSymbol: string;
}

export const StatsItem: FC<Props> = ({ title, amounts, isLoading, fiatEquivalentIsMain, tokenSymbol }) => {
  const { symbol: fiatSymbol } = useCurrentFiatCurrencyMetadataSelector();
  const styles = useStatsItemStyles();

  const renderStatsLoader = useCallback(() => <Text style={styles.value}>---</Text>, [styles]);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      <FormattedAmountWithLoader
        isLoading={isLoading}
        isDollarValue={fiatEquivalentIsMain}
        symbol={fiatEquivalentIsMain ? undefined : tokenSymbol}
        amount={fiatEquivalentIsMain ? amounts.fiatEquivalent : amounts.amount}
        style={styles.value}
        renderLoader={renderStatsLoader}
      />
      {!fiatEquivalentIsMain && (
        <FormattedAmount
          style={styles.fiatEquity}
          isDollarValue
          showAllDecimalPlaces
          symbol={fiatSymbol}
          amount={amounts.fiatEquivalent}
        />
      )}
    </View>
  );
};
