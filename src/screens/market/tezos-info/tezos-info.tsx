import React from 'react';
import { View, Text } from 'react-native';

import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { TokenIcon } from '../../../components/token-icon/token-icon';
import { useTezosMarketTokenSelector } from '../../../store/market/market-selectors';
import { useTokenMetadataSelector } from '../../../store/tokens-metadata/tokens-metadata-selectors';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { TEZ_TOKEN_SLUG } from '../../../token/data/tokens-metadata';
import { formatPriceChange, getPriceChangeColor, formatPrice, formatRegularValue } from '../../../utils/market.util';
import { getTruncatedProps } from '../../../utils/style.util';
import { circulatingSupplyAlert, marketCupAlert, volumeAlert } from './alerts';
import { useTezosInfoStyles } from './tezos-info.styles';

export const TezosInfo = () => {
  const styles = useTezosInfoStyles();
  const tezosMetadata = useTokenMetadataSelector(TEZ_TOKEN_SLUG);
  const marketTezos = useTezosMarketTokenSelector();
  const colors = useColors();

  const priceChange24hColor = getPriceChangeColor(marketTezos?.priceChange24h, colors);
  const priceChange7dColor = getPriceChangeColor(marketTezos?.priceChange7d, colors);

  const { value: price } = formatRegularValue(marketTezos?.price);
  const { value: supply } = formatPrice(marketTezos?.supply);
  const { value: marketCup } = formatPrice(marketTezos?.marketCup);
  const { value: volume24h } = formatPrice(marketTezos?.volume24h);
  const priceChange7d = formatPriceChange(marketTezos?.priceChange7d);
  const priceChange24h = formatPriceChange(marketTezos?.priceChange24h);

  return (
    <View>
      <View style={[styles.topContainer, styles.mb8]}>
        <View style={[styles.flex1, styles.commonView, styles.mr8]}>
          <View style={[styles.displayFlex, styles.tezMain, styles.mb8]}>
            <View style={styles.imageAndPrice}>
              <TokenIcon iconName={tezosMetadata.iconName} />

              <View style={styles.nameAndSymbolContainer}>
                <Text style={styles.regularText}>{tezosMetadata.symbol}</Text>
                <Text style={styles.subtitle11}>{marketTezos?.name}</Text>
              </View>
            </View>

            <Text style={styles.tezosPrice}>{price} $</Text>
          </View>

          <View style={styles.displayFlex}>
            <View style={styles.tooltipContainer}>
              <Text style={styles.subtitle13}>Market Cup</Text>
              <TouchableIcon onPress={marketCupAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
            </View>
            <Text style={styles.regularText}>{marketCup} $</Text>
          </View>
        </View>

        <View style={[styles.commonView, styles.displayCenter]}>
          <View style={styles.percentage}>
            <Text style={styles.subtitle11}>24H</Text>
            <Text {...getTruncatedProps({ color: priceChange24hColor })}>{priceChange24h}</Text>
          </View>

          <View>
            <Text style={styles.subtitle11}>7D</Text>
            <Text {...getTruncatedProps({ color: priceChange7dColor })}>{priceChange7d}</Text>
          </View>
        </View>
      </View>

      <View style={styles.displayFlex}>
        <View style={[styles.commonView, styles.flex1, styles.mr8]}>
          <View style={[styles.tooltipContainer, styles.mb8]}>
            <Text style={styles.subtitle13}>Volume (24H)</Text>
            <TouchableIcon onPress={volumeAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
          </View>
          <Text style={styles.regularText}>{volume24h} $</Text>
        </View>

        <View style={[styles.commonView, styles.flex1]}>
          <View style={[styles.tooltipContainer, styles.mb8]}>
            <Text style={styles.subtitle13}>Circulating Supply</Text>
            <TouchableIcon onPress={circulatingSupplyAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
          </View>
          <Text style={styles.regularText}>{supply} TEZ</Text>
        </View>
      </View>
    </View>
  );
};
