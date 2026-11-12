import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Alert, Text, View } from 'react-native';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { CASHBACK_RATIO, ROUTING_FEE_RATIO } from 'src/config/swap';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { formatSize } from 'src/styles/format-size';
import { safeToFixed } from 'src/utils/big-number.utils';
import { isDefined } from 'src/utils/is-defined';
import { formatAssetAmount } from 'src/utils/number.util';

import { SwapExchangeRateSelectors } from './selectors';
import { useSwapExchangeRateStyles } from './swap-exchange-rate.styles';

interface Props {
  slippageRatio: number;
  inputAsset: AssetInterface;
  outputAsset: AssetInterface;
  inputAmount: BigNumber | undefined;
  outputAmount: BigNumber | undefined;
  routingFeeIsTakenFromOutput: boolean;
  minimumReceivedAmount?: BigNumber;
  chainKind?: TempleChainKind;
}

export const SwapExchangeRate: FC<Props> = ({
  inputAsset,
  outputAsset,
  slippageRatio,
  inputAmount,
  outputAmount,
  routingFeeIsTakenFromOutput,
  minimumReceivedAmount: minimumReceived,
  chainKind = TempleChainKind.Tezos
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
    if (isDefined(minimumReceived)) {
      return `${safeToFixed(minimumReceived, Math.min(8, outputAsset.decimals), BigNumber.ROUND_DOWN)} ${
        outputAsset.symbol
      }`;
    }
    if (isDefined(outputAmount) && outputAmount.isGreaterThan(0)) {
      return `${safeToFixed(
        outputAmount.multipliedBy(slippageRatio).multipliedBy(routingFeeIsTakenFromOutput ? 1 - ROUTING_FEE_RATIO : 1),
        Math.min(8, outputAsset.decimals),
        BigNumber.ROUND_DOWN
      )} ${outputAsset.symbol}`;
    }

    return '---';
  }, [
    minimumReceived,
    outputAmount,
    slippageRatio,
    routingFeeIsTakenFromOutput,
    outputAsset.decimals,
    outputAsset.symbol
  ]);

  const routingFeeAlert = () =>
    Alert.alert(
      'Routing Fee',
      `The fee covers the exchange route selection across ${
        chainKind === TempleChainKind.EVM ? 'Etherlink' : 'Tezos'
      } DEXes. DEX fees are separate.`,
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
      {chainKind === TempleChainKind.Tezos && (
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Cashback</Text>
            <TouchableIcon onPress={cashbackAlert} name={IconNameEnum.InfoFilled} size={formatSize(24)} />
          </View>
          <Text style={styles.infoValue}>{CASHBACK_RATIO * 100}%</Text>
        </View>
      )}
    </>
  );
};
