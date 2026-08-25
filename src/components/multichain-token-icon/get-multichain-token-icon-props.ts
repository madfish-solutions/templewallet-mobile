import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { MultichainDisplayedToken } from 'src/hooks/evm/use-multichain-displayed-tokens.hook';
import { formatSize } from 'src/styles/format-size';
import { EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';

import { MultichainTokenIconProps } from './index';

const DEFAULT_ICON_SIZE = formatSize(40);

export const getMultichainTokenIconProps = (
  token: MultichainDisplayedToken,
  size = DEFAULT_ICON_SIZE
): MultichainTokenIconProps =>
  token.chainKind === TempleChainKind.Tezos
    ? {
        chainKind: TempleChainKind.Tezos,
        iconName: token.original?.iconName,
        thumbnailUri: token.original?.iconName ? undefined : token.iconUri,
        size,
        showNetworkBadge: true
      }
    : {
        chainKind: TempleChainKind.EVM,
        chainId: Number(token.chainId),
        address: token.slug,
        // Native XTZ carries no iconURL, so it MUST fall back to the crypto logo
        iconName: token.slug === EVM_TOKEN_SLUG ? CryptoLogoNameEnum.Etherlink : undefined,
        iconURL: token.iconUri,
        size,
        showNetworkBadge: true
      };
