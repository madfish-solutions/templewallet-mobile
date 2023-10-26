import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { View, Text, StyleProp, TextStyle } from 'react-native';

import { conditionalStyle } from 'src/utils/conditional-style';
import { formatAssetAmount } from 'src/utils/number.util';
import { shortizeSymbol } from 'src/utils/token-metadata.utils';

import { useActivityGroupDollarAmountChangeStyles } from './item-amount-change.styles';

interface Props {
  amount: BigNumber | undefined;
  isPositive: boolean;
  symbol: string;
  textStyle?: StyleProp<TextStyle>;
}

export const ItemAmountChange: FC<Props> = ({ symbol, amount, isPositive, textStyle }) => {
  const styles = useActivityGroupDollarAmountChangeStyles();

  if (amount === undefined) {
    return (
      <View style={styles.container}>
        <Text style={textStyle}>---</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[conditionalStyle(isPositive, styles.positiveAmountText, styles.negativeAmountText), textStyle]}>
        {isPositive && '+'}
        {formatAssetAmount(amount)} {shortizeSymbol(symbol)}
      </Text>
    </View>
  );
};
