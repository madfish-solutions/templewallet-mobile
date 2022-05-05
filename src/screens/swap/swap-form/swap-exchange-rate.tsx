import { useFormikContext } from 'formik';
import React, { FC, useMemo } from 'react';
import { Alert, Text, View } from 'react-native';
import { getTradeInputAmount, getTradeOutputAmount } from 'swap-router-sdk';

import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { SwapFormValues } from '../../../interfaces/swap-asset.interface';
import { formatSize } from '../../../styles/format-size';
import { formatAssetAmount } from '../../../utils/number.util';
import { ROUTING_FEE_PERCENT } from '../config';
import { useSwapStyles } from '../swap.styles';
import { atomsToTokens } from './swap-form';

export const SwapExchangeRate: FC = () => {
  const styles = useSwapStyles();

  const { values } = useFormikContext<SwapFormValues>();

  const {
    inputAssets,
    outputAssets,
    bestTrade: trade,
    bestTradeWithSlippageTolerance: tradeWithSlippageTolerance
  } = values;
  const { asset: inputAssetMetadata } = inputAssets;
  const { asset: outputAssetMetadata } = outputAssets;

  const exchangeRate = useMemo(() => {
    const tradeMutezInput = getTradeInputAmount(trade);
    const tradeMutezOutput = getTradeOutputAmount(trade);

    if (tradeMutezInput && tradeMutezOutput && !tradeMutezInput.isEqualTo(0) && !tradeMutezOutput.isEqualTo(0)) {
      const tradeTzInput = atomsToTokens(tradeMutezInput, inputAssetMetadata.decimals);
      const tradeTzOutput = atomsToTokens(tradeMutezOutput, outputAssetMetadata.decimals);

      return tradeTzInput.dividedBy(tradeTzOutput);
    }

    return undefined;
  }, [trade, inputAssetMetadata.decimals, outputAssetMetadata.decimals]);

  const minimumReceivedAmount = useMemo(() => {
    if (tradeWithSlippageTolerance.length > 0) {
      const lastTradeOperation = tradeWithSlippageTolerance[tradeWithSlippageTolerance.length - 1];

      return atomsToTokens(lastTradeOperation.bTokenAmount, outputAssetMetadata.decimals);
    }

    return undefined;
  }, [tradeWithSlippageTolerance, outputAssetMetadata.decimals]);

  const routingFeeAlert = () =>
    Alert.alert(
      'Routing Fee',
      'For choosing the most profitable exchange route among Tezos DEXes. DEXes commissions are not included.',
      [
        {
          text: 'Ok',
          style: 'default'
        }
      ]
    );

  return (
    <>
      {exchangeRate ? (
        <>
          <View style={styles.infoContainer}>
            <View>
              <Text style={styles.infoText}>Routing Fee</Text>
              <TouchableIcon onPress={routingFeeAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
            </View>
            <Text style={styles.infoValue}>{ROUTING_FEE_PERCENT}%</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Exchange rate</Text>
            <Text style={styles.infoValue}>
              1 {outputAssetMetadata.symbol} = {formatAssetAmount(exchangeRate)} {inputAssetMetadata.symbol}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Minimum received</Text>
            <Text style={styles.infoValue}>
              {minimumReceivedAmount && formatAssetAmount(minimumReceivedAmount)} {inputAssetMetadata.symbol}
            </Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.infoContainer}>
            <View>
              <Text style={styles.infoText}>Routing Fee</Text>
              <TouchableIcon onPress={routingFeeAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
            </View>
            <Text style={styles.infoValue}>{ROUTING_FEE_PERCENT}%</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Exchange rate</Text>
            <Text style={styles.infoValue}>---</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Minimum received</Text>
            <Text style={styles.infoValue}>---</Text>
          </View>
        </>
      )}
    </>
  );
};
