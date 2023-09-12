import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { TokenIcon } from 'src/components/token-icon/token-icon';
import { TruncatedText } from 'src/components/truncated-text';
import { useUsdToTokenRates } from 'src/store/currency/currency-selectors';
import { MarketToken } from 'src/store/market/market.interfaces';
import { useColors } from 'src/styles/use-colors';
import { formatPriceChange, getPriceChangeColor, formatPrice, formatRegularValue } from 'src/utils/market.util';

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
        <TruncatedText style={styles.regularText}>{symbol}</TruncatedText>
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
