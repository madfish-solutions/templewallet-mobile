import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Route3DexTypeEnum } from 'src/enums/route3.enum';
import { useSwapDexesSelector } from 'src/store/swap/swap-selectors';
import { formatSize } from 'src/styles/format-size';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { SwapRouteItemIcon } from '../swap-route-item/swap-route-item-icon/swap-route-item-icon';
import { useHopItemStyles } from './hop-item.styles';

interface Props {
  dexId: number;
}

export const HopItem: FC<Props> = ({ dexId }) => {
  const styles = useHopItemStyles();
  const { data: route3Dexes } = useSwapDexesSelector();
  const dex = route3Dexes.find(dex => dex.id === dexId);

  const dexIcon: IconNameEnum = useMemo(() => {
    switch (dex?.type) {
      case Route3DexTypeEnum.PlentyCtezStable:
      case Route3DexTypeEnum.PlentyTokenToToken:
      case Route3DexTypeEnum.PlentyTokenToTokenStable:
      case Route3DexTypeEnum.PlentyTokenToTokenVolatile:
      case Route3DexTypeEnum.PlentyWrappedTokenBridgeSwap:
        return IconNameEnum.Plenty;
      case Route3DexTypeEnum.QuipuSwapDex2:
      case Route3DexTypeEnum.QuipuSwapTezToTokenFa12:
      case Route3DexTypeEnum.QuipuSwapTezToTokenFa2:
      case Route3DexTypeEnum.QuipuSwapTokenToToken:
      case Route3DexTypeEnum.QuipuSwapTokenToTokenStable:
        return IconNameEnum.QuipuSwapDark;
      case Route3DexTypeEnum.FlatYouvesStable:
        return IconNameEnum.Youves;
      case Route3DexTypeEnum.VortexTokenToTokenFa12:
      case Route3DexTypeEnum.VortexTokenToTokenFa2:
        return IconNameEnum.Vortex;
      case Route3DexTypeEnum.SpicyTokenToToken:
        return IconNameEnum.Spicy;
      default:
        return IconNameEnum.SwapTokenPlaceholderIcon;
    }
  }, [dex?.type]);

  const aTokenSlug = toTokenSlug(dex?.token1.contract ?? '', dex?.token1.tokenId ?? 0);
  const bTokenSlug = toTokenSlug(dex?.token2.contract ?? '', dex?.token2.tokenId ?? 0);

  return (
    <View style={styles.container}>
      <Icon name={dexIcon} size={formatSize(24)} />
      <Divider size={formatSize(4)} />
      <SwapRouteItemIcon tokenSlug={aTokenSlug} />
      <View style={styles.lastTokenContainer}>
        <SwapRouteItemIcon tokenSlug={bTokenSlug} />
      </View>
    </View>
  );
};
