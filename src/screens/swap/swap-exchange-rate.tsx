import React, { FC, useMemo } from 'react';
import { Alert, Text, View } from 'react-native';
import { getTradeInputAmount, getTradeOutputAmount, Trade } from 'swap-router-sdk';

import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { formatSize } from '../../styles/format-size';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { formatAssetAmount } from '../../utils/number.util';
import { atomsToTokens, ROUTING_FEE_PERCENT } from './swap-form';
import { useSwapStyles } from './swap.styles';

interface Props {
  trade: Trade;
  inputAssetMetadata: TokenInterface;
  outputAssetMetadata: TokenInterface;
  tradeWithSlippageTolerance: Trade | [];
}

export const SwapExchangeRate: FC<Props> = ({
  trade,
  inputAssetMetadata,
  outputAssetMetadata,
  tradeWithSlippageTolerance
}) => {
  const styles = useSwapStyles();

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
            <Text style={styles.infoText}>
              Routing Fee
              <TouchableIcon onPress={routingFeeAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
            </Text>
            <Text>{ROUTING_FEE_PERCENT}%</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Exchange rate</Text>
            <Text>
              1 {outputAssetMetadata.symbol} = {formatAssetAmount(exchangeRate)} {inputAssetMetadata.symbol}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Minimum received</Text>
            <Text>
              {minimumReceivedAmount && formatAssetAmount(minimumReceivedAmount)} {inputAssetMetadata.symbol}
            </Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Routing Fee
              <TouchableIcon onPress={routingFeeAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
            </Text>
            <Text>---</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Exchange rate</Text>
            <Text>---</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Minimum received</Text>
            <Text>---</Text>
          </View>
        </>
      )}
    </>
  );
};
