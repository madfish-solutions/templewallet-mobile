import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { Trade } from 'swap-router-sdk';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { tokenEqualityFn } from '../../components/token-dropdown/token-equality-fn';
import { SwapFormValues } from '../../interfaces/swap-asset.interface';
import { formatSize } from '../../styles/format-size';
import { emptyToken } from '../../token/interfaces/token.interface';
import { SwapRouterItem } from './swap-router-item';
import { useSwapStyles } from './swap.styles';

interface Props extends Pick<SwapFormValues, 'inputAssets' | 'outputAssets'> {
  trade: Trade;
  loadingHasFailed: boolean;
}

export const SwapRoute: FC<Props> = ({ trade, inputAssets, outputAssets, loadingHasFailed }) => {
  const styles = useSwapStyles();

  const isNotSelectedAsset =
    tokenEqualityFn(outputAssets.asset, emptyToken) || tokenEqualityFn(inputAssets.asset, emptyToken);
  const isNoAmount = inputAssets.amount === undefined;

  const textToRender = loadingHasFailed
    ? 'No quotes available'
    : isNotSelectedAsset
    ? 'Please, select tokens to swap'
    : isNoAmount
    ? 'Please, enter swap amount'
    : 'Please, select tokens to swap';

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
          <Text style={styles.smartRouteTextDescription}>{textToRender}</Text>
        </View>
      )}
    </>
  );
};
