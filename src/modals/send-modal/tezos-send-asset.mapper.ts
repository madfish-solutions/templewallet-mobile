import { ChainIds } from '@taquito/taquito';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { TEZ_SHIELDED_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { TezosSendAsset } from 'src/types/send-asset';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';

const TEZOS_NETWORK_NAME = 'Tezos';

export const toTezosSendAsset = (token: TokenInterface): TezosSendAsset => {
  const assetSlug = getTokenSlug(token);

  return {
    ...token,
    assetKey: toChainAssetSlug({ chainKind: TempleChainKind.Tezos, chainId: ChainIds.MAINNET }, assetSlug),
    assetSlug,
    chainKind: TempleChainKind.Tezos,
    chainId: ChainIds.MAINNET,
    networkName: TEZOS_NETWORK_NAME,
    sendStandard: assetSlug === TEZ_SHIELDED_TOKEN_SLUG ? 'shielded-tez' : 'tezos'
  };
};
