import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { Trade } from 'swap-router-sdk';

import { AssetAmountInterface } from '../../../components/asset-amount-input/asset-amount-input';
import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { tokenEqualityFn } from '../../../components/token-dropdown/token-equality-fn';
import { formatSize } from '../../../styles/format-size';
import { emptyToken } from '../../../token/interfaces/token.interface';
import { useSwapStyles } from '../swap.styles';
import { SwapRouterItem } from './swap-router-item';

interface Props {
  inputAssets: AssetAmountInterface;
  outputAssets: AssetAmountInterface;
  bestTrade: Trade;
  loadingHasFailed: boolean;
}

export const SwapRoute: FC<Props> = ({ inputAssets, outputAssets, bestTrade, loadingHasFailed }) => {
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
    : 'Loading...';

  return (
    <>
      <View style={styles.swapInfoContainer}>
        {bestTrade.map((item, index) => {
          return (
            <SwapRouterItem
              key={`${index}_${item.dexType}_${item.aTokenSlug}_${item.bTokenSlug}`}
              tradeOperation={item}
              isShowNextArrow={index !== bestTrade.length - 1}
            />
          );
        })}
      </View>

      {!bestTrade.length && (
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
