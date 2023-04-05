import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Route3Chain } from 'src/interfaces/route3.interface';
import { useSwapDexesSelector, useSwapTokensMetadataSelector } from 'src/store/swap/swap-selectors';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { kFormatter } from 'src/utils/number.util';

import { HopItem } from '../hop-item/hop-item';
import { useSwapRouteItem } from './swap-route-item.styles';

interface Props {
  chain: Route3Chain;
  baseInput: string | undefined;
  baseOutput: string | undefined;
}

const BASE = new BigNumber(100);
const PERCENTAGE_DECIMALS = 1;
const AMOUNT_DECIMALS = 2;

const calculatePercentage = (base: string | undefined, part: string) => {
  if (base === undefined) {
    return;
  }

  const amountToFormat = BASE.multipliedBy(part).dividedBy(base);

  if (amountToFormat.isGreaterThanOrEqualTo(BASE)) {
    return BASE.toFixed();
  }

  return amountToFormat.toFixed(PERCENTAGE_DECIMALS);
};

export const SwapRouteItem: FC<Props> = ({ chain, baseInput, baseOutput }) => {
  const styles = useSwapRouteItem();
  const { data: swapDexes } = useSwapDexesSelector();
  const { data: swapTokensMetadata } = useSwapTokensMetadataSelector();

  return (
    <View style={[styles.flex, styles.container]}>
      <View style={styles.amountsContainer}>
        <Text style={[styles.amount, styles.alignStart]}>
          {kFormatter(Number(new BigNumber(chain.input).toFixed(AMOUNT_DECIMALS)))}
        </Text>
        <Text style={[styles.percantage, styles.alignStart]}>{calculatePercentage(baseInput, chain.input)}%</Text>
      </View>
      <View style={[styles.flex, styles.hopsContainer]}>
        <Icon width="100%" name={IconNameEnum.SwapRouteItemBackground} style={styles.icon} />
        {chain.hops.map((hop, index) => {
          const dex = swapDexes.find(dex => hop.dex === dex.id);

          const aDexToken = hop.forward ? dex?.token1 : dex?.token2;
          const bDexToken = hop.forward ? dex?.token2 : dex?.token1;

          const aDexTokenSlug = toTokenSlug(aDexToken?.contract ?? '', aDexToken?.tokenId ?? 0);
          const bDexTokenSlug = toTokenSlug(bDexToken?.contract ?? '', bDexToken?.tokenId ?? 0);

          const aToken = swapTokensMetadata.find(({ address, id }) => toTokenSlug(address, id) === aDexTokenSlug);
          const bToken = swapTokensMetadata.find(({ address, id }) => toTokenSlug(address, id) === bDexTokenSlug);

          return <HopItem key={index} dexType={dex?.type} aToken={aToken} bToken={bToken} />;
        })}
      </View>
      <View style={styles.amountsContainer}>
        <Text style={[styles.amount, styles.alignEnd]}>
          {kFormatter(Number(new BigNumber(chain.output).toFixed(AMOUNT_DECIMALS)))}
        </Text>
        <Text style={[styles.percantage, styles.alignEnd]}>{calculatePercentage(baseOutput, chain.output)}%</Text>
      </View>
    </View>
  );
};
