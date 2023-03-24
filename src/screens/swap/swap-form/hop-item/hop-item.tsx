import React, { FC } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { Route3Hop } from 'src/interfaces/route3.interface';
import { useSwapDexesSelector, useSwapTokensSelector } from 'src/store/swap/swap-selectors';
import { formatSize } from 'src/styles/format-size';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { DexIcon } from '../dex-icon/dex-icon';
import { useHopItemStyles } from './hop-item.styles';

interface Props {
  hop: Route3Hop;
}

export const HopItem: FC<Props> = ({ hop }) => {
  const styles = useHopItemStyles();
  const { data: swapDexes } = useSwapDexesSelector();
  const { data: swapTokens } = useSwapTokensSelector();
  const dex = swapDexes.find(dex => dex.id === hop.dex);

  const aDexToken = hop.forward ? dex?.token1 : dex?.token2;
  const bDexToken = hop.forward ? dex?.token2 : dex?.token1;

  const aDexTokenSlug = toTokenSlug(aDexToken?.contract, aDexToken?.tokenId);
  const bDexTokenSlug = toTokenSlug(bDexToken?.contract, bDexToken?.tokenId ?? 0);

  const aToken = swapTokens.find(token => toTokenSlug(token.address, token.id) === aDexTokenSlug);
  const bToken = swapTokens.find(token => toTokenSlug(token.address, token.id) === bDexTokenSlug);

  return (
    <View style={styles.container}>
      <DexIcon dexType={dex?.type} />
      <Divider size={formatSize(4)} />
      <TokenIcon iconName={aToken?.iconName} thumbnailUri={aToken?.thumbnailUri} size={formatSize(24)} />
      <View style={styles.lastTokenContainer}>
        <TokenIcon iconName={bToken?.iconName} thumbnailUri={bToken?.thumbnailUri} size={formatSize(24)} />
      </View>
    </View>
  );
};
