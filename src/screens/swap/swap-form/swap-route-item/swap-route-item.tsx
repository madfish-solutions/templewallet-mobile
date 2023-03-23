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
  baseInput: number | undefined;
  baseOutput: number | undefined;
}

const BASE = 100;
const PERCENTAGE_DECIMALS = 1;
const AMOUNT_DECIMALS = 1;

const calculatePercentage = (base: number, part: number) => {
  const amountToFormat = (BASE * part) / base;

  if (amountToFormat >= BASE) {
    return BASE;
  }

  return amountToFormat.toFixed(PERCENTAGE_DECIMALS);
};

export const SwapRouteItem: FC<Props> = ({ chain, baseInput, baseOutput }) => {
  const styles = useSwapRouteItem();

  return (
    <View style={[styles.flex, styles.container]}>
      <View style={styles.amountsContainer}>
        <Text style={[styles.amount, styles.alignStart]}>
          {kFormatter(Number(chain.input.toFixed(AMOUNT_DECIMALS)))}
        </Text>
        <Text style={[styles.percantage, styles.alignStart]}>{calculatePercentage(baseInput ?? 1, chain.input)}%</Text>
      </View>
      <View style={[styles.flex, styles.hopsContainer]}>
        <Icon width="100%" name={IconNameEnum.SwapRouteItemBackground} style={styles.icon} />
        {chain.hops.map((hop, index) => (
          <HopItem key={index} hop={hop} />
        ))}
      </View>
      <View style={styles.amountsContainer}>
        <Text style={[styles.amount, styles.alignEnd]}>
          {kFormatter(Number(chain.output.toFixed(AMOUNT_DECIMALS)))}
        </Text>
        <Text style={[styles.percantage, styles.alignEnd]}>{calculatePercentage(baseOutput ?? 1, chain.output)}%</Text>
      </View>
    </View>
  );
};
