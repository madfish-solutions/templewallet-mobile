import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { TokenIcon } from '../../../../components/token-icon/token-icon';
import { useUsdToTokenRates } from '../../../../store/currency/currency-selectors';
import { MarketToken } from '../../../../store/market/market.interfaces';
import { useColors } from '../../../../styles/use-colors';
import { getPriceChange, getPriceChangeColor, getValueToShow } from '../../../../utils/market.util';
import { useRowStyles } from './row.styles';

interface Props {
  item: MarketToken;
}

export const Row: FC<Props> = ({ item }) => {
  const colors = useColors();
  const styles = useRowStyles();
  const { tez: tezosExchangeRate } = useUsdToTokenRates();

  const priceChangeColor = getPriceChangeColor(item.priceChange24h, colors);
  const { value: price, valueEstimatedInTezos: priceEstimatedInTezos } = getValueToShow(item.price, tezosExchangeRate);
  const { value: volume, valueEstimatedInTezos: volumeEstimatedInTezos } = getValueToShow(
    item.volume24h,
    tezosExchangeRate
  );
  const priceChange24h = getPriceChange(item.priceChange24h);

  return (
    <View style={styles.container}>
      <View style={styles.coinContainer}>
        <TokenIcon thumbnailUri={item.imageUrl} />
        <Text style={styles.regularText}>{item.symbol}</Text>
      </View>
      <View style={styles.digits}>
        <Text style={styles.regularText}>{price}$</Text>
        <Text style={styles.tezValue}>{priceEstimatedInTezos} TEZ</Text>
      </View>

      <Text style={[styles.priceChange, styles.regularText, { color: priceChangeColor }]}>{priceChange24h}</Text>

      <View style={styles.digits}>
        <Text style={styles.regularText}>{volume}$</Text>
        <Text style={styles.tezValue}>{volumeEstimatedInTezos} TEZ</Text>
      </View>
    </View>
  );
};
