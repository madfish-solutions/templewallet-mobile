import { useFormikContext } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { tokenEqualityFn } from '../../../components/token-dropdown/token-equality-fn';
import { SwapFormValues } from '../../../interfaces/swap-asset.interface';
import { formatSize } from '../../../styles/format-size';
import { emptyToken } from '../../../token/interfaces/token.interface';
import { useSwapStyles } from '../swap.styles';
import { SwapRouterItem } from './swap-router-item';

export const SwapRoute: FC<{ loadingHasFailed?: boolean }> = ({ loadingHasFailed = false }) => {
  const styles = useSwapStyles();

  const { values } = useFormikContext<SwapFormValues>();

  const { inputAssets, outputAssets, bestTrade: trade } = values;

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
