import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { TokenIcon } from '../../../components/token-icon/token-icon';
import { useUsdToTokenRates } from '../../../store/currency/currency-selectors';
import { MarketCoin } from '../../../store/market/market.interfaces';
import { useRowStyles } from './row.styles';

interface Props {
  item: MarketCoin;
}

export const Row: FC<Props> = ({ item }) => {
  const { tez: tezosExchangeRate } = useUsdToTokenRates();
  const styles = useRowStyles();

  return (
    <View style={styles.container}>
      <View style={styles.coinContainer}>
        <TokenIcon thumbnailUri={item.imageUrl} />
        <Text style={styles.regularText}>{item.symbol}</Text>
      </View>
      <View style={styles.digits}>
        <Text style={styles.regularText}>{item.price}$</Text>
        <Text style={styles.tezValue}>{(item.price / tezosExchangeRate).toFixed(2)} TEZ</Text>
      </View>

      <Text style={{ ...styles.priceChange, ...styles.regularText }}>{item.priceChange24h}%</Text>

      <View style={styles.digits}>
        <Text style={styles.regularText}>{item.volume24h}$</Text>
        <Text style={styles.tezValue}>{(item.volume24h / tezosExchangeRate).toFixed(2)} TEZ</Text>
      </View>
    </View>
  );
};
