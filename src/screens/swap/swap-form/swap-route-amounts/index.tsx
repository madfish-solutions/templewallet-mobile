import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Text, TextStyle, View } from 'react-native';

import { kFormatter } from 'src/utils/number.util';

import { useSwapRouteAmountsStyles } from './styles';

interface Props {
  alignment: TextStyle['alignSelf'];
  amount: string;
  baseAmount: string | undefined;
}

const BASE = new BigNumber(100);
const PERCENTAGE_DECIMALS = 1;
const AMOUNT_DECIMALS = 2;

const calculatePercentage = (base: string | undefined, part: string) => {
  if (base === undefined) {
    return;
  }

  const amountToFormat = BASE.multipliedBy(part).dividedBy(base);

  if (amountToFormat.isGreaterThanOrEqualTo(BASE)) {
    return BASE.toFixed();
  }

  return amountToFormat.toFixed(PERCENTAGE_DECIMALS);
};

export const SwapRouteAmounts: FC<Props> = ({ alignment, amount, baseAmount }) => {
  const styles = useSwapRouteAmountsStyles();

  const textStylesFromProps = useMemo(() => ({ alignSelf: alignment }), [alignment]);

  return (
    <View style={styles.amountsContainer}>
      <Text style={[styles.amount, textStylesFromProps]}>
        {kFormatter(Number(new BigNumber(amount).toFixed(AMOUNT_DECIMALS)))}
      </Text>
      <Text style={[styles.percentage, textStylesFromProps]}>{calculatePercentage(baseAmount, amount)}%</Text>
    </View>
  );
};
