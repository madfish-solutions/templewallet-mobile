import React, { FC } from 'react';
import { View } from 'react-native';
import { TradeOperation } from 'swap-router-sdk';

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

  return (
    <View style={styles.smartRouteStyle}>
      <Icon name={IconNameEnum.SwapTokenPlaceholderIcon} size={formatSize(24)} />
      <Divider size={formatSize(18)} />
      <TokenIcon token={aTokenMetadata} size={formatSize(24)} />
      <View style={styles.smartRouteLastTokenStyle}>
        <TokenIcon token={bTokenMetadata} size={formatSize(24)} />
      </View>
    </View>
  );
};
