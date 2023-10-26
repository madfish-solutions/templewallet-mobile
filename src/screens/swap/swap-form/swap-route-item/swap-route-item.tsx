import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Route3Chain } from 'src/interfaces/route3.interface';
import { useSwapDexesSelector, useSwapTokensMetadataSelector } from 'src/store/swap/swap-selectors';
import { useSelectedAccountTezosTokenSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { HopItem } from '../hop-item/hop-item';
import { SwapRouteAmounts } from '../swap-route-amounts';

import { useSwapRouteItem } from './swap-route-item.styles';

interface Props {
  chain: Route3Chain;
  baseInput: string | undefined;
  baseOutput: string | undefined;
  shouldShowInput: boolean;
  shouldShowOutput: boolean;
}

export const SwapRouteItem: FC<Props> = ({ chain, baseInput, baseOutput, shouldShowInput, shouldShowOutput }) => {
  const styles = useSwapRouteItem();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const { data: swapDexes } = useSwapDexesSelector();
  const { data } = useSwapTokensMetadataSelector();
  const swapTokensMetadata = useMemo<Array<TokenInterface>>(() => [tezosToken, ...data], [tezosToken, data]);

  return (
    <View style={[styles.flex, styles.container]}>
      {shouldShowInput && <SwapRouteAmounts alignment="flex-start" amount={chain.input} baseAmount={baseInput} />}
      <View style={[styles.flex, styles.hopsContainer]}>
        <View style={styles.iconWrapper}>
          <Icon width={formatSize(263)} height={formatSize(16)} name={IconNameEnum.SwapRouteItemBackground} />
        </View>
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
      {shouldShowOutput && <SwapRouteAmounts alignment="flex-end" amount={chain.output} baseAmount={baseOutput} />}
    </View>
  );
};
