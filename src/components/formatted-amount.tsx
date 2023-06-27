import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useCurrentFiatCurrencyMetadataSelector } from '../store/settings/settings-selectors';
import { bigIntClamp } from '../utils/big-number.utils';
import { formatAssetAmount } from '../utils/number.util';

interface Props {
  amount: BigNumber;
  hideApproximateSign?: boolean;
  isDollarValue?: boolean;
  showAllDecimalPlaces?: boolean;
  showMinusSign?: boolean;
  showPlusSign?: boolean;
  symbol?: string;
  style?: StyleProp<TextStyle>;
}

const MIN_POSITIVE_AMOUNT_VALUE = new BigNumber(0.01);
const MAX_NEGATIVE_AMOUNT_VALUE = new BigNumber(-0.01);

export const FormattedAmount: FC<Props> = ({
  amount,
  hideApproximateSign = false,
  isDollarValue = false,
  showMinusSign = false,
  showPlusSign = false,
  showAllDecimalPlaces = false,
  symbol,
  style
}) => {
  const { symbol: fiatSymbol } = useCurrentFiatCurrencyMetadataSelector();
  const dollarAmount = amount.isZero()
    ? amount
    : amount.isPositive()
    ? bigIntClamp(amount, MIN_POSITIVE_AMOUNT_VALUE, new BigNumber(Infinity))
    : bigIntClamp(amount, new BigNumber(-Infinity), MAX_NEGATIVE_AMOUNT_VALUE).abs();

  const formattedAmount = useMemo(
    () =>
      isDollarValue
        ? formatAssetAmount(dollarAmount, 2, showAllDecimalPlaces)
        : formatAssetAmount(amount, undefined, showAllDecimalPlaces),
    [isDollarValue, dollarAmount, amount, showAllDecimalPlaces]
  );

  const amountSignStr = useMemo(() => {
    if (showMinusSign) {
      return '-';
    }

    if (showPlusSign) {
      return '+';
    }

    return undefined;
  }, [showMinusSign, showPlusSign, isDollarValue]);

  const isLessThan = formattedAmount.includes('<');
  const formattedSymbol = symbol !== undefined ? ` ${symbol}` : '';

  return (
    <Text style={style}>
      {isDollarValue && !isLessThan && !hideApproximateSign && '≈ '}
      {amountSignStr && `${amountSignStr} `}
      {formattedAmount}
      {isDollarValue ? fiatSymbol : formattedSymbol}
    </Text>
  );
};
