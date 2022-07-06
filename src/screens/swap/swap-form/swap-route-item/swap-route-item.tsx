import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { DexTypeEnum, TradeOperation } from 'swap-router-sdk';

import { Divider } from '../../../../components/divider/divider';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { formatSize } from '../../../../styles/format-size';
import { SwapRouteItemIcon } from './swap-route-item-icon/swap-route-item-icon';
import { useSwapRouteItem } from './swap-route-item.styles';

interface Props {
  tradeOperation?: TradeOperation;
  isShowNextArrow?: boolean;
}

export const SwapRouteItem: FC<Props> = ({ tradeOperation, isShowNextArrow = false }) => {
  const styles = useSwapRouteItem();

  const dexIcon: IconNameEnum = useMemo(() => {
    switch (tradeOperation?.dexType) {
      case DexTypeEnum.LiquidityBaking:
        return IconNameEnum.LiquidityBaking;
      case DexTypeEnum.Plenty:
      case DexTypeEnum.PlentyStableSwap:
      case DexTypeEnum.PlentyBridge:
      case DexTypeEnum.PlentyVolatileSwap:
      case DexTypeEnum.PlentyCtez:
        return IconNameEnum.Plenty;
      case DexTypeEnum.QuipuSwap:
      case DexTypeEnum.QuipuSwapCurveLike:
      case DexTypeEnum.QuipuSwapTokenToTokenDex:
        return IconNameEnum.QuipuSwapDark;
      case DexTypeEnum.Youves:
        return IconNameEnum.Youves;
      case DexTypeEnum.Vortex:
        return IconNameEnum.Vortex;
      case DexTypeEnum.Spicy:
      case DexTypeEnum.SpicyWrap:
        return IconNameEnum.Spicy;
      default:
        return IconNameEnum.SwapTokenPlaceholderIcon;
    }
  }, [tradeOperation?.dexType]);

  return (
    <>
      <View style={styles.container}>
        <Icon name={dexIcon} size={formatSize(24)} />
        <Divider size={formatSize(18)} />
        <SwapRouteItemIcon tokenSlug={tradeOperation?.aTokenSlug} />
        <View style={styles.lastTokenContainer}>
          <SwapRouteItemIcon tokenSlug={tradeOperation?.bTokenSlug} />
        </View>
      </View>
      {isShowNextArrow && <Icon name={IconNameEnum.ArrowRight} size={formatSize(12)} />}
    </>
  );
};
