import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useFiatCurrencySelector } from '../store/settings/settings-selectors';
import { bigIntClamp } from '../utils/big-number.utils';
import { FIAT_CURRENCIES } from '../utils/exchange-rate.util';
import { formatAssetAmount } from '../utils/number.util';

interface Props {
  amount: BigNumber;
  isDollarValue?: boolean;
  showMinusSign?: boolean;
  showPlusSign?: boolean;
  symbol?: string;
  style?: StyleProp<TextStyle>;
}

const MIN_POSITIVE_AMOUNT_VALUE = new BigNumber(0.01);
const MAX_NEGATIVE_AMOUNT_VALUE = new BigNumber(-0.01);

export const FormattedAmount: FC<Props> = ({
  amount,
  isDollarValue = false,
  showMinusSign = false,
  showPlusSign = false,
  symbol,
  style
}) => {
  const fiatCurrency = useFiatCurrencySelector();
  const dollarAmount = amount.isZero()
    ? amount
    : amount.isPositive()
    ? bigIntClamp(amount, MIN_POSITIVE_AMOUNT_VALUE, new BigNumber(Infinity))
    : bigIntClamp(amount, new BigNumber(-Infinity), MAX_NEGATIVE_AMOUNT_VALUE).abs();

  const formattedAmount = isDollarValue ? formatAssetAmount(dollarAmount, 2) : formatAssetAmount(amount);
  const currencySymbol = useMemo(
    () => ' ' + FIAT_CURRENCIES.find(x => x.name === fiatCurrency)?.symbol,
    [fiatCurrency]
  );

  const isLessThan = formattedAmount.includes('<');
  const formattedSymbol = symbol !== undefined ? ` ${symbol}` : '';

  return (
    <Text style={style}>
      {isDollarValue && !isLessThan && '≈ '}
      {showMinusSign && '- '}
      {showPlusSign && '+ '}
      {formattedAmount}
      {isDollarValue ? currencySymbol : formattedSymbol}
    </Text>
  );
};
