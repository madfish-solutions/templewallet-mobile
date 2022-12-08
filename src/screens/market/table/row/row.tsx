import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { TokenIcon } from '../../../../components/token-icon/token-icon';
import { MarketCoin } from '../../../../store/market/market.interfaces';
import { useRowService } from './row.service';
import { useRowStyles } from './row.styles';

interface Props {
  item: MarketCoin;
}

export const Row: FC<Props> = ({ item }) => {
  const styles = useRowStyles();
  const { price, priceChangeColor, priceEstimatedInTezos, volume, volumeEstimatedInTezos, priceChange24h } =
    useRowService(item);

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
