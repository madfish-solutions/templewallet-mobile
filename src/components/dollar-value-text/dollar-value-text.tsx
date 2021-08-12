import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useExchangeRatesSelector } from '../../store/currency/currency-selectors';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';
import { mutezToTz } from '../../utils/tezos.util';

interface Props {
  token: TokenInterface;
  style?: StyleProp<TextStyle>;
}

export const DollarValueText: FC<Props> = ({ token, style }) => {
  const exchangeRates = useExchangeRatesSelector();

  const exchangeRate: number | undefined = exchangeRates[getTokenSlug(token)];
  const parsedAmount = mutezToTz(new BigNumber(token.balance), token.decimals).multipliedBy(exchangeRate);

  return isDefined(exchangeRate) ? (
    <Text style={style}>{formatAssetAmount(parsedAmount, BigNumber.ROUND_DOWN, 2)} $</Text>
  ) : null;
};
