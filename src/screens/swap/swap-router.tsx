import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { Trade } from 'swap-router-sdk';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { formatSize } from '../../styles/format-size';
import { SwapRouterItem } from './swap-router-item';
import { useSwapStyles } from './swap.styles';

interface Props {
  trade: Trade;
}

export const SwapRoute: FC<Props> = ({ trade }) => {
  const styles = useSwapStyles();

  return (
    <>
      <View style={styles.swapInfoContainer}>
        {trade.map((item, index) => {
          return (
            <SwapRouterItem
              key={`${index}_${item.dexType}_${item.aTokenSlug}_${item.bTokenSlug}`}
              tradeOperation={item}
              isShowNextArrow={index !== trade.length - 1}
            />
          );
        })}
      </View>

      {!trade.length && (
        <View style={styles.swapInfoContainer}>
          <View style={styles.smartRouteStyle}>
            <Icon name={IconNameEnum.SwapTokenPlaceholderIcon} size={formatSize(24)} />
            <Divider size={formatSize(18)} />
            <Icon name={IconNameEnum.NoNameToken} size={formatSize(24)} />
            <View style={styles.smartRouteLastTokenPlaceholderStyle}>
              <Icon name={IconNameEnum.NoNameToken} size={formatSize(24)} />
            </View>
          </View>
          <Text style={styles.smartRouteTextDescription}>Please, select tokens to swap</Text>
        </View>
      )}
    </>
  );
};
