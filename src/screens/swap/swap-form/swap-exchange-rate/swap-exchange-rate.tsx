import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Alert, Text, View } from 'react-native';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { CASHBACK_RATIO, ROUTING_FEE_RATIO } from 'src/config/swap';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';
import { formatAssetAmount } from 'src/utils/number.util';

import { SwapExchangeRateSelectors } from './selectors';
import { useSwapExchangeRateStyles } from './swap-exchange-rate.styles';

interface Props {
  slippageRatio: number;
  inputAsset: TokenInterface;
  outputAsset: TokenInterface;
  inputAmount: BigNumber | undefined;
  outputAmount: BigNumber | undefined;
  routingFeeIsTakenFromOutput: boolean;
}

export const SwapExchangeRate: FC<Props> = ({
  inputAsset,
  outputAsset,
  slippageRatio,
  inputAmount,
  outputAmount,
  routingFeeIsTakenFromOutput
}) => {
  const styles = useSwapExchangeRateStyles();

  const exchangeRate = useMemo(() => {
    if (isDefined(inputAmount) && isDefined(outputAmount)) {
      const rate = inputAmount.dividedBy(outputAmount);

      if (rate.isFinite()) {
        return `1 ${outputAsset.symbol} = ${formatAssetAmount(rate)} ${inputAsset.symbol}`;
      }
    }

    return '---';
  }, [inputAmount, outputAmount, inputAsset, outputAsset]);

  const minimumReceivedAmount = useMemo(() => {
    if (isDefined(outputAmount) && outputAmount.isGreaterThan(0)) {
      return `${outputAmount
        .multipliedBy(slippageRatio)
        .multipliedBy(routingFeeIsTakenFromOutput ? 1 - ROUTING_FEE_RATIO : 1)
        .toFixed(Math.min(8, outputAsset.decimals), BigNumber.ROUND_DOWN)} ${outputAsset.symbol}`;
    }

    return '---';
  }, [outputAmount, slippageRatio, routingFeeIsTakenFromOutput, outputAsset.decimals, outputAsset.symbol]);

  const routingFeeAlert = () =>
    Alert.alert(
      'Routing Fee',
      'For choosing the most profitable exchange route among Tezos DEXes. DEXes commissions are not included',
      [
        {
          text: 'Ok',
          style: 'default'
        }
      ]
    );

  const cashbackAlert = () =>
    Alert.alert(
      'Cashback',
      `Swap more than 10$ and receive ${CASHBACK_RATIO * 100}% from the swapped amount in the TKEY token as a cashback`,
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
          <TouchableIcon
            name={IconNameEnum.InfoFilled}
            size={formatSize(24)}
            testID={SwapExchangeRateSelectors.routingFeeAlert}
            onPress={routingFeeAlert}
          />
        </View>
        <Text style={styles.infoValue}>{ROUTING_FEE_RATIO * 100}%</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Exchange rate</Text>
        <Text style={styles.infoValue}>{exchangeRate}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Minimum received</Text>
        <Text style={styles.infoValue}>{minimumReceivedAmount}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Cashback</Text>
          <TouchableIcon onPress={cashbackAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
        </View>
        <Text style={styles.infoValue}>{CASHBACK_RATIO * 100}%</Text>
      </View>
    </>
  );
};
