import React from 'react';
import { View, Text } from 'react-native';

import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { TokenIcon } from '../../../components/token-icon/token-icon';
import { formatSize } from '../../../styles/format-size';
import { useTezosInfoService } from './tezos-info.service';
import { useTezosInfoStyles } from './tezos-info.styles';

export const TezosInfo = () => {
  const styles = useTezosInfoStyles();
  const {
    imageUrl,
    symbol,
    name,
    price,
    marketCup,
    priceChange24h,
    priceChange7d,
    volume24h,
    supply,
    priceChange24hColor,
    priceChange7dColor,
    marketCupAlert,
    volumeAlert,
    circulatingSupplyAlert
  } = useTezosInfoService();

  return (
    <View>
      <View style={[styles.topContainer, styles.mb8]}>
        <View style={[styles.flex1, styles.commonView, styles.mr8]}>
          <View style={[styles.displayFlex, styles.tezMain, styles.mb8]}>
            <View style={styles.imageAndPrice}>
              <TokenIcon thumbnailUri={imageUrl} />

              <View style={styles.nameAndSymbolContainer}>
                <Text style={styles.regularText}>{symbol}</Text>
                <Text style={styles.subtitle11}>{name}</Text>
              </View>
            </View>

            <Text style={styles.tezosPrice}>{price}$</Text>
          </View>

          <View style={styles.displayFlex}>
            <View style={styles.tooltipContainer}>
              <Text style={styles.subtitle13}>Market Cup</Text>
              <TouchableIcon onPress={marketCupAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
            </View>
            <Text style={styles.regularText}>{marketCup}$</Text>
          </View>
        </View>

        <View style={[styles.commonView, styles.displayCenter]}>
          <View style={styles.percentage}>
            <Text style={styles.subtitle11}>24H</Text>
            <Text style={{ color: priceChange24hColor }}>{priceChange24h}</Text>
          </View>

          <View>
            <Text style={styles.subtitle11}>7D</Text>
            <Text style={{ color: priceChange7dColor }}>{priceChange7d}</Text>
          </View>
        </View>
      </View>

      <View style={styles.displayFlex}>
        <View style={[styles.commonView, styles.flex1, styles.mr8]}>
          <View style={[styles.tooltipContainer, styles.mb8]}>
            <Text style={styles.subtitle13}>Volume (24H)</Text>
            <TouchableIcon onPress={volumeAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
          </View>
          <Text style={styles.regularText}>{volume24h}$</Text>
        </View>

        <View style={[styles.commonView, styles.flex1]}>
          <View style={[styles.tooltipContainer, styles.mb8]}>
            <Text style={styles.subtitle13}>Carculating Supply</Text>
            <TouchableIcon onPress={circulatingSupplyAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
          </View>
          <Text style={styles.regularText}>{supply} TEZ</Text>
        </View>
      </View>
    </View>
  );
};
