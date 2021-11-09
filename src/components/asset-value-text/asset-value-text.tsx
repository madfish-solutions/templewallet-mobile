import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useExchangeRatesSelector } from '../../store/currency/currency-selectors';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';
import { mutezToTz } from '../../utils/tezos.util';

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
  const formattedAmount = convertToDollar
    ? formatAssetAmount(parsedAmount?.multipliedBy(exchangeRate), BigNumber.ROUND_DOWN, 2)
    : formatAssetAmount(parsedAmount);
  const symbol = convertToDollar ? '$' : asset.symbol;

  return (
    <Text style={style}>
      {hideText ? (
        ''
      ) : (
        <>
          {convertToDollar && '≈ '}
          {showMinusSign && '- '}
          {formattedAmount}
          {showSymbol ? ` ${symbol}` : null}
        </>
      )}
    </Text>
  );
};
