import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { DexTypeEnum, TradeOperation } from 'swap-router-sdk';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TokenIcon } from '../../components/token-icon/token-icon';
import { useTokenMetadataGetter } from '../../hooks/use-token-metadata-getter.hook';
import { formatSize } from '../../styles/format-size';
import { useSwapStyles } from './swap.styles';
interface Props {
  tradeOperation: TradeOperation;
}

export const SwapRouterItem: FC<Props> = ({ tradeOperation }) => {
  const styles = useSwapStyles();
  const getTokenMetadata = useTokenMetadataGetter();

  const aTokenMetadata = getTokenMetadata(tradeOperation.aTokenSlug);
  const bTokenMetadata = getTokenMetadata(tradeOperation.bTokenSlug);

  const dexIcon: IconNameEnum = useMemo(() => {
    switch (tradeOperation.dexType) {
      case DexTypeEnum.Plenty:
        return IconNameEnum.Plenty;
      case DexTypeEnum.QuipuSwap:
        return IconNameEnum.QuipuSwapDark;
      case DexTypeEnum.Youves:
        return IconNameEnum.Youves;
      default:
        return IconNameEnum.SwapTokenPlaceholderIcon;
    }
  }, [tradeOperation.dexType]);

  return (
    <View style={styles.smartRouteStyle}>
      <Icon name={dexIcon} size={formatSize(24)} />
      <Divider size={formatSize(18)} />
      <TokenIcon token={aTokenMetadata} size={formatSize(24)} />
      <View style={styles.smartRouteLastTokenStyle}>
        <TokenIcon token={bTokenMetadata} size={formatSize(24)} />
      </View>
    </View>
  );
};
