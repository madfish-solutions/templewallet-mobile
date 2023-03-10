import React, { FC } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Route3Hop } from 'src/interfaces/route3.interface';
import { useSwapDexesSelector } from 'src/store/swap/swap-selectors';
import { formatSize } from 'src/styles/format-size';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { DexIcon } from '../dex-icon/dex-icon';
import { SwapRouteItemIcon } from '../swap-route-item/swap-route-item-icon/swap-route-item-icon';
import { useHopItemStyles } from './hop-item.styles';

interface Props {
  hop: Route3Hop;
}

export const HopItem: FC<Props> = ({ hop }) => {
  const styles = useHopItemStyles();
  const { data: route3Dexes } = useSwapDexesSelector();
  const dex = route3Dexes.find(dex => dex.id === hop.dex);

  const aToken = hop.forward ? dex?.token1 : dex?.token2;
  const bToken = hop.forward ? dex?.token2 : dex?.token1;

  const aTokenSlug = toTokenSlug(aToken?.contract ?? '', aToken?.tokenId ?? 0);
  const bTokenSlug = toTokenSlug(bToken?.contract ?? '', bToken?.tokenId ?? 0);

  return (
    <View style={styles.container}>
      <DexIcon dexType={dex?.type} />
      <Divider size={formatSize(4)} />
      <SwapRouteItemIcon tokenSlug={aTokenSlug} />
      <View style={styles.lastTokenContainer}>
        <SwapRouteItemIcon tokenSlug={bTokenSlug} />
      </View>
    </View>
  );
};
