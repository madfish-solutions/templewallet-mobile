import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Route3Chain } from 'src/interfaces/route3.interface';
import { useRoute3SwapParamsSelector } from 'src/store/route3/route3-selectors';
import { formatSize } from 'src/styles/format-size';

import { HopItem } from '../hop-item/hop-item';
import { useSwapRouteItem } from './swap-route-item.styles';

interface Props {
  chain: Route3Chain;
}
const DECIMALS_COUNT = 2;

const calculatePercentage = (base: number, part: number) => ((100 * part) / base).toFixed(1);

export const SwapRouteItem: FC<Props> = ({ chain }) => {
  const styles = useSwapRouteItem();
  const { data: swapParams } = useRoute3SwapParamsSelector();

  return (
    <View style={styles.container}>
      <Icon
        width={formatSize(265)}
        name={IconNameEnum.SwapRouteItemBackground}
        style={{ position: 'absolute', right: formatSize(40) }}
      />
      <View>
        <Text style={styles.amount}>{chain.input.toFixed(DECIMALS_COUNT)}</Text>
        <Text style={styles.percantage}>{calculatePercentage(swapParams.input ?? 1, chain.input)}%</Text>
      </View>
      {chain.hops.map(({ dex }, index) => (
        <HopItem key={index} dexId={dex} />
      ))}
      <View>
        <Text style={styles.amount}>{chain.output.toFixed(DECIMALS_COUNT)}</Text>
        <Text style={styles.percantage}>{calculatePercentage(swapParams.output ?? 1, chain.output)}%</Text>
      </View>
    </View>
  );
};
