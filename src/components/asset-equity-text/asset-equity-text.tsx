import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { useCurrentFiatCurrencyMetadataSelector } from '../../store/settings/settings-selectors';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';

import { useAssetEquityTextStyles } from './asset-equity-text.styles';

interface Props {
  asset: TokenMetadataInterface;
  style?: StyleProp<TextStyle>;
  showSymbol?: boolean;
}

export const AssetEquityText: FC<Props> = ({ asset, style }) => {
  const styles = useAssetEquityTextStyles();
  const { symbol } = useCurrentFiatCurrencyMetadataSelector();

  const formattedExchangeRate = formatAssetAmount(new BigNumber(asset.exchangeRate ?? 0), 2);

  return isDefined(asset.exchangeRate) ? (
    <Text style={style}>
      <Text style={[style, styles.numberText]}>1</Text> <Text style={style}>{asset.symbol}</Text>
      <Text style={style}> ≈ </Text>
      <Text style={[style, styles.numberText]}>{formattedExchangeRate}</Text>
      <Text style={style}>{symbol}</Text>
    </Text>
  ) : null;
};
