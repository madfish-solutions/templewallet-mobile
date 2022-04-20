import BigNumber from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';
import { getTradeInputAmount, getTradeOutputAmount, Trade } from 'swap-router-sdk';

import { findExchangeRate } from '../../utils/dex.utils';
import { formatAssetAmount } from '../../utils/number.util';
import { atomsToTokens } from './swap-form';
import { useSwapStyles } from './swap.styles';

interface Props {
  trade: Trade;
  // inputAssetMetadata: AssetMetadata;
  // outputAssetMetadata: AssetMetadata;
}

const DEFAULT_CRYPTO_DECIMALS = 6;
const ENOUGH_INT_LENGTH = 4;

export const SwapExchangeRate: FC<Props> = ({ trade, inputAssetMetadata, outputAssetMetadata }) => {
  const styles = useSwapStyles();

  const exchangeRate = useMemo(() => {
    const tradeMutezInput = getTradeInputAmount(trade);
    const tradeMutezOutput = getTradeOutputAmount(trade);

    // console.log('tradeMutezInput', tradeMutezInput);
    // console.log('tradeMutezOutput', tradeMutezOutput);
    if (tradeMutezInput && tradeMutezOutput && !tradeMutezInput.isEqualTo(0) && !tradeMutezOutput.isEqualTo(0)) {
      const tradeTzInput = atomsToTokens(tradeMutezInput, inputAssetMetadata.decimals);
      const tradeTzOutput = atomsToTokens(tradeMutezOutput, outputAssetMetadata.decimals);

      return tradeTzInput.dividedBy(tradeTzOutput);
    }

    return undefined;
  }, [trade, inputAssetMetadata.decimals, outputAssetMetadata.decimals]);

  console.log('exchangeRate', exchangeRate);

  // console.log(formatAssetAmount(exchangeRate));

  return (
    <>
      {exchangeRate ? (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Exchange rate</Text>
            <Text>
              1 {outputAssetMetadata.symbol} = {formatAssetAmount(exchangeRate)} {inputAssetMetadata.symbol}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Minimum received</Text>
            <Text>
              {} {inputAssetMetadata.symbol}
            </Text>
          </View>
        </>
      ) : (
        <Text>-</Text>
      )}
    </>
  );
};
