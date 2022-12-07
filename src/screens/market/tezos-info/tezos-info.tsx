import React from 'react';
import { View, Text } from 'react-native';

import { TokenIcon } from '../../../components/token-icon/token-icon';
import { useTezosMarketCoin } from '../../../store/market/market-selectors';
import { useTezosInfoStyles } from './tezos-info.styles';

export const TezosInfo = () => {
  const styles = useTezosInfoStyles();
  const marketTezos = useTezosMarketCoin();

  return (
    <View>
      <View style={[styles.topContainer, styles.mb8]}>
        <View style={[styles.flex1, styles.commonView, styles.mr8]}>
          <View style={[styles.displayFlex, styles.tezMain, styles.mb8]}>
            <View style={styles.imageAndPrice}>
              <TokenIcon thumbnailUri={marketTezos?.imageUrl} />

              <View style={styles.nameAndSymbolContainer}>
                <Text style={styles.regularText}>{marketTezos?.symbol}</Text>
                <Text style={styles.subtitle11}>{marketTezos?.name}</Text>
              </View>
            </View>

            <Text style={styles.tezosPrice}>{marketTezos?.price}$</Text>
          </View>

          <View style={styles.displayFlex}>
            <Text style={styles.subtitle13}>Market Cup</Text>
            <Text style={styles.regularText}>{marketTezos?.marketCup}$</Text>
          </View>
        </View>

        <View style={[styles.commonView, styles.displayCenter]}>
          <View style={styles.percentage}>
            <Text style={styles.subtitle11}>24H</Text>
            <Text style={styles.changeColor}>{marketTezos?.priceChange24h}</Text>
          </View>

          <View>
            <Text style={styles.subtitle11}>7D</Text>
            <Text style={styles.changeColor}>{marketTezos?.priceChange7d}</Text>
          </View>
        </View>
      </View>

      <View style={styles.displayFlex}>
        <View style={[styles.commonView, styles.flex1, styles.mr8]}>
          <Text style={[styles.subtitle13, styles.mb8]}>Volume (24H)</Text>
          <Text style={styles.regularText}>{marketTezos?.volume24h}$</Text>
        </View>

        <View style={[styles.commonView, styles.flex1]}>
          <Text style={[styles.subtitle13, styles.mb8]}>Carculating Supply</Text>
          <Text style={styles.regularText}>{marketTezos?.supply} TEZ</Text>
        </View>
      </View>
    </View>
  );
};
