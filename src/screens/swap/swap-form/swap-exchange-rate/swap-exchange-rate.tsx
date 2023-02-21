import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo } from 'react';
import { Alert, Text, View } from 'react-native';

import { useSwapParamsSelector } from 'src/store/swap/swap-selectors';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../../components/icon/touchable-icon/touchable-icon';
import { formatSize } from '../../../../styles/format-size';
import { formatAssetAmount } from '../../../../utils/number.util';
import { ROUTING_FEE_PERCENT } from '../../config';
import { useSwapExchangeRateStyles } from './swap-exchange-rate.styles';

interface Props {
  slippageRatio: number;
  inputAsset: TokenInterface;
  outputAsset: TokenInterface;
}

export const SwapExchangeRate: FC<Props> = ({ inputAsset, outputAsset, slippageRatio }) => {
  const styles = useSwapExchangeRateStyles();
  const { data: swapParams } = useSwapParamsSelector();

  const exchangeRate = useMemo(() => {
    if (swapParams.input !== undefined && swapParams.output !== undefined) {
      const tradeInput = new BigNumber(swapParams.input);
      const tradeOutput = new BigNumber(swapParams.output);
      const rate = tradeInput.dividedBy(tradeOutput);

      return `1 ${outputAsset.symbol} = ${formatAssetAmount(rate)} ${inputAsset.symbol}`;
    }

    return '---';
  }, [swapParams]);

  const minimumReceivedAmount = useMemo(() => {
    if (swapParams.output !== undefined) {
      return `${(swapParams.output * slippageRatio).toFixed(outputAsset.decimals)} ${outputAsset.symbol}`;
    }

    return '---';
  }, [slippageRatio, swapParams.output, outputAsset.decimals]);

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
        <Text style={styles.infoValue}>{exchangeRate}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Minimum received</Text>
        <Text style={styles.infoValue}>{minimumReceivedAmount}</Text>
      </View>
    </>
  );
};
