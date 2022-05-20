import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useExchangeRatesSelector } from '../../store/currency/currency-selectors';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
import { mutezToTz } from '../../utils/tezos.util';
import { FormattedAmount } from '../formatted-amount';

interface Props {
  amount: string;
  asset: TokenMetadataInterface;
  style?: StyleProp<TextStyle>;
  showMinusSign?: boolean;
  showSymbol?: boolean;
  convertToDollar?: boolean;
}

export const AssetValueText: FC<Props> = ({
  amount,
  asset,
  style,
  showMinusSign = false,
  showSymbol = true,
  convertToDollar = false
}) => {
  const exchangeRates = useExchangeRatesSelector();
  const exchangeRate: number | undefined = exchangeRates[getTokenSlug(asset)];

  const hideText = convertToDollar && !isDefined(exchangeRate);

  const parsedAmount = mutezToTz(new BigNumber(amount), asset.decimals);
  const visibleAmount = convertToDollar ? parsedAmount.multipliedBy(exchangeRate) : parsedAmount;
  const visibleSymbol = showSymbol ? asset.symbol : undefined;

  const emptySymbolValue = convertToDollar && asset.symbol === '' ? new BigNumber(0) : visibleAmount;

  return (
    <Text style={style}>
      {hideText ? (
        ''
      ) : (
        <FormattedAmount
          amount={emptySymbolValue}
          isDollarValue={convertToDollar}
          showMinusSign={showMinusSign}
          showPlusSign={false}
          symbol={visibleSymbol}
          style={style}
        />
      )}
    </Text>
  );
};
