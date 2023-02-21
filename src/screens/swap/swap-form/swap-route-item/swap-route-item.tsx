import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Route3Chain } from 'src/interfaces/route3.interface';
import { useSwapParamsSelector } from 'src/store/swap/swap-selectors';
import { kFormatter } from 'src/utils/number.util';

import { HopItem } from '../hop-item/hop-item';
import { useSwapRouteItem } from './swap-route-item.styles';

interface Props {
  chain: Route3Chain;
}

const BASE = 100;
const PERCENTAGE_DECIMALS = 1;
const AMOUNT_DECIMALS = 1;

const calculatePercentage = (base: number, part: number) => ((BASE * part) / base).toFixed(PERCENTAGE_DECIMALS);

export const SwapRouteItem: FC<Props> = ({ chain }) => {
  const styles = useSwapRouteItem();
  const { data: swapParams } = useSwapParamsSelector();

  return (
    <View style={[styles.flex, styles.container]}>
      <View style={styles.amountsContainer}>
        <Text style={styles.amount}>{kFormatter(Number(chain.input.toFixed(AMOUNT_DECIMALS)))}</Text>
        <Text style={styles.percantage}>{calculatePercentage(swapParams.input ?? 1, chain.input)}%</Text>
      </View>
      <View style={[styles.flex, styles.hopsContainer]}>
        <Icon width="100%" name={IconNameEnum.SwapRouteItemBackground} style={styles.icon} />
        {chain.hops.map(({ dex }, index) => (
          <HopItem key={index} dexId={dex} />
        ))}
      </View>
      <View style={styles.amountsContainer}>
        <Text style={styles.amount}>{kFormatter(Number(chain.output.toFixed(AMOUNT_DECIMALS)))}</Text>
        <Text style={styles.percantage}>{calculatePercentage(swapParams.output ?? 1, chain.output)}%</Text>
      </View>
    </View>
  );
};
