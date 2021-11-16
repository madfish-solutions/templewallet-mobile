import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useExchangeRatesSelector } from '../../store/currency/currency-selectors';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../token/utils/token.utils';
import { formatAssetAmount } from '../../utils/number.util';
import { useAssetEquityTextStyles } from './asset-equity-text.styles';

interface Props {
  asset: TokenMetadataInterface;
  style?: StyleProp<TextStyle>;
  showSymbol?: boolean;
}

export const AssetEquityText: FC<Props> = ({ asset, style }) => {
  const exchangeRates = useExchangeRatesSelector();
  const styles = useAssetEquityTextStyles();

  const exchangeRate: number | undefined = exchangeRates[getTokenSlug(asset)];

  const visibleAmount = formatAssetAmount(new BigNumber(exchangeRate), 2);
  const visibleSymbol = asset.symbol;

  return (
    <Text style={style}>
      <Text style={[style, styles.numberText]}>1</Text> <Text style={style}>{visibleSymbol}</Text>
      <Text style={style}> ≈ $ </Text>
      <Text style={[style, styles.numberText]}>{visibleAmount}</Text>
    </Text>
  );
};
