import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Route3Chain } from 'src/interfaces/route3.interface';
import { kFormatter } from 'src/utils/number.util';

import { HopItem } from '../hop-item/hop-item';
import { useSwapRouteItem } from './swap-route-item.styles';

interface Props {
  chain: Route3Chain;
  input: number;
  output: number;
}

const BASE = 100;
const PERCENTAGE_DECIMALS = 1;
const AMOUNT_DECIMALS = 1;

const calculatePercentage = (base: number, part: number) => ((BASE * part) / base).toFixed(PERCENTAGE_DECIMALS);

export const SwapRouteItem: FC<Props> = ({ chain, input, output }) => {
  const styles = useSwapRouteItem();

  return (
    <View style={[styles.flex, styles.container]}>
      <View style={styles.amountsContainer}>
        <Text style={styles.amount}>{kFormatter(Number(chain.input.toFixed(AMOUNT_DECIMALS)))}</Text>
        <Text style={styles.percantage}>{calculatePercentage(input, chain.input)}%</Text>
      </View>
      <View style={[styles.flex, styles.hopsContainer]}>
        <Icon width="100%" name={IconNameEnum.SwapRouteItemBackground} style={styles.icon} />
        {chain.hops.map((hop, index) => (
          <HopItem key={index} hop={hop} />
        ))}
      </View>
      <View style={styles.amountsContainer}>
        <Text style={styles.amount}>{kFormatter(Number(chain.output.toFixed(AMOUNT_DECIMALS)))}</Text>
        <Text style={styles.percantage}>{calculatePercentage(output, chain.output)}%</Text>
      </View>
    </View>
  );
};
