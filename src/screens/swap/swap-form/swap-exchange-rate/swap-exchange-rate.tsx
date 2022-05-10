import React, { FC, useMemo } from 'react';
import { Alert, Text, View } from 'react-native';
import { getTradeInputAmount, getTradeOutputAmount, Trade } from 'swap-router-sdk';

import { AssetAmountInterface } from '../../../../components/asset-amount-input/asset-amount-input';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../../components/icon/touchable-icon/touchable-icon';
import { formatSize } from '../../../../styles/format-size';
import { formatAssetAmount } from '../../../../utils/number.util';
import { mutezToTz } from '../../../../utils/tezos.util';
import { ROUTING_FEE_PERCENT } from '../../config';
import { useSwapExchangeRateStyles } from './swap-exchange-rate.styles';

interface Props {
  inputAssets: AssetAmountInterface;
  outputAssets: AssetAmountInterface;
  bestTrade: Trade;
  bestTradeWithSlippageTolerance: Trade;
}

export const SwapExchangeRate: FC<Props> = ({
  inputAssets,
  outputAssets,
  bestTrade,
  bestTradeWithSlippageTolerance
}) => {
  const styles = useSwapExchangeRateStyles();

  const exchangeRate = useMemo(() => {
    const tradeMutezInput = getTradeInputAmount(bestTrade);
    const tradeMutezOutput = getTradeOutputAmount(bestTrade);

    if (tradeMutezInput && tradeMutezOutput && !tradeMutezInput.isEqualTo(0) && !tradeMutezOutput.isEqualTo(0)) {
      const tradeTzInput = mutezToTz(tradeMutezInput, inputAssets.asset.decimals);
      const tradeTzOutput = mutezToTz(tradeMutezOutput, outputAssets.asset.decimals);

      return tradeTzInput.dividedBy(tradeTzOutput);
    }

    return undefined;
  }, [bestTrade, inputAssets.asset.decimals, outputAssets.asset.decimals]);

  const minimumReceivedAmount = useMemo(() => {
    if (bestTradeWithSlippageTolerance.length > 0) {
      const lastTradeOperation = bestTradeWithSlippageTolerance[bestTradeWithSlippageTolerance.length - 1];

      return mutezToTz(lastTradeOperation.bTokenAmount, outputAssets.asset.decimals);
    }

    return undefined;
  }, [bestTradeWithSlippageTolerance, outputAssets.asset.decimals]);

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
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Routing Fee</Text>
          <TouchableIcon onPress={routingFeeAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
        </View>
        <Text style={styles.infoValue}>{ROUTING_FEE_PERCENT}%</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Exchange rate</Text>
        <Text style={styles.infoValue}>
          {exchangeRate
            ? `1 ${outputAssets.asset.symbol} = ${formatAssetAmount(exchangeRate)} ${inputAssets.asset.symbol}`
            : '---'}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Minimum received</Text>
        <Text style={styles.infoValue}>
          {minimumReceivedAmount ? `${formatAssetAmount(minimumReceivedAmount)} ${inputAssets.asset.symbol}` : '---'}
        </Text>
      </View>
    </>
  );
};
