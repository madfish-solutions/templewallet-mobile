import React, { memo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams } from 'src/navigator/hooks/use-navigation.hook';

import { EvmCollectibleModalContent } from './evm-content';
import { TezosCollectibleModalContent } from './tezos-content';

export const CollectibleModal = memo(() => {
  const collectible = useModalParams<ModalsEnum.CollectibleModal>();

  return collectible.chainKind === TempleChainKind.EVM ? (
    <EvmCollectibleModalContent chainId={collectible.chainId} slug={collectible.slug} />
  ) : (
    <TezosCollectibleModalContent slug={collectible.slug} />
  );
});
