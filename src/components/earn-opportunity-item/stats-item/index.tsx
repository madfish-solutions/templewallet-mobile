import { BigNumber } from 'bignumber.js';
import React, { FC, ReactChild } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';

import { FormattedAmount } from 'src/components/formatted-amount';
import { useCurrentFiatCurrencyMetadataSelector } from 'src/store/settings/settings-selectors';
import { isDefined } from 'src/utils/is-defined';

import { useStatsItemStyles } from './styles';

interface Props {
  title: string;
  loading: boolean;
  value: ReactChild | ReactChild[];
  fiatEquivalent?: BigNumber;
  titleStyle?: StyleProp<TextStyle>;
}

export const StatsItem: FC<Props> = ({ loading, title, value, fiatEquivalent, titleStyle }) => {
  const { symbol: fiatSymbol } = useCurrentFiatCurrencyMetadataSelector();
  const styles = useStatsItemStyles();

  return (
    <View style={styles.root}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {loading ? <Text style={styles.loader}>---</Text> : value}
      {isDefined(fiatEquivalent) && (
        <FormattedAmount
          style={styles.fiatEquity}
          isDollarValue
          showAllDecimalPlaces
          symbol={fiatSymbol}
          amount={fiatEquivalent}
        />
      )}
    </View>
  );
};
