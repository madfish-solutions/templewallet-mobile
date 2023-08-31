import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { TokenIcon } from '../../../../components/token-icon/token-icon';
import { useUsdToTokenRates } from '../../../../store/currency/currency-selectors';
import { MarketToken } from '../../../../store/market/market.interfaces';
import { useColors } from '../../../../styles/use-colors';
import {
  formatPriceChange,
  getPriceChangeColor,
  formatPrice,
  formatRegularValue
} from '../../../../utils/market.utils';
import { getTruncatedProps } from '../../../../utils/style.util';
import { useRowStyles } from './row.styles';

export const Row: FC<MarketToken> = ({ priceChange24h, price, imageUrl, symbol, volume24h }) => {
  const colors = useColors();
  const styles = useRowStyles();
  const { tez: tezosExchangeRate } = useUsdToTokenRates();

  const priceChangeColor = getPriceChangeColor(priceChange24h, colors);
  const { value: priceFormatted, valueEstimatedInTezos: priceEstimatedInTezos } = formatPrice(price, tezosExchangeRate);
  const { value: volume24hFormatted, valueEstimatedInTezos: volumeEstimatedInTezos } = formatRegularValue(
    volume24h,
    tezosExchangeRate
  );
  const priceChange24hFormatted = formatPriceChange(priceChange24h);

  return (
    <View style={styles.container}>
      <View style={[styles.coinContainer, styles.basis25]}>
        <TokenIcon thumbnailUri={imageUrl} />
        <Text {...getTruncatedProps(styles.regularText)}>{symbol}</Text>
      </View>
      <View style={[styles.digits, styles.basis25]}>
        <Text style={styles.regularText}>{priceFormatted} $</Text>
        <Text style={styles.tezValue}>{priceEstimatedInTezos} TEZ</Text>
      </View>

      <Text style={[styles.priceChange, styles.regularText, styles.basis25, { color: priceChangeColor }]}>
        {priceChange24hFormatted}
      </Text>

      <View style={[styles.digits, styles.basis25]}>
        <Text style={styles.regularText}>{volume24hFormatted} $</Text>
        <Text style={styles.tezValue}>{volumeEstimatedInTezos} TEZ</Text>
      </View>
    </View>
  );
};
