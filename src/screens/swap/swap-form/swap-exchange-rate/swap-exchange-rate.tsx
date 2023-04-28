import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Alert, Text, View } from 'react-native';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';
import { formatAssetAmount } from 'src/utils/number.util';

import { CASHBACK_PERCENT, ROUTING_FEE_PERCENT, ROUTING_FEE_RATIO } from '../../config';
import { SwapExchangeRateSelectors } from './selectors';
import { useSwapExchangeRateStyles } from './swap-exchange-rate.styles';

interface Props {
  slippageRatio: number;
  inputAsset: TokenInterface;
  outputAsset: TokenInterface;
  inputAmount: BigNumber | undefined;
  outputAmount: BigNumber | undefined;
}

export const SwapExchangeRate: FC<Props> = ({ inputAsset, outputAsset, slippageRatio, inputAmount, outputAmount }) => {
  const styles = useSwapExchangeRateStyles();

  const exchangeRate = useMemo(() => {
    if (isDefined(inputAmount) && isDefined(outputAmount)) {
      const rate = inputAmount.dividedBy(outputAmount);

      if (rate.isFinite()) {
        return `1 ${outputAsset.symbol} = ${formatAssetAmount(rate)} ${inputAsset.symbol}`;
      }
    }

    return '---';
  }, [inputAmount, outputAmount]);

  const minimumReceivedAmount = useMemo(() => {
    if (isDefined(outputAmount) && outputAmount.isGreaterThan(0)) {
      return `${outputAmount.multipliedBy(slippageRatio).multipliedBy(ROUTING_FEE_RATIO).toFixed(8)} ${
        outputAsset.symbol
      }`;
    }

    return '---';
  }, [slippageRatio, outputAmount, outputAsset.decimals]);

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
      'Swap more than 10$ and receive 0.175% from the swapped amount in the TKEY token as a cashback',
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
        <Text style={styles.infoValue}>{ROUTING_FEE_PERCENT}%</Text>
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
        <Text style={styles.infoValue}>{CASHBACK_PERCENT}%</Text>
      </View>
    </>
  );
};
