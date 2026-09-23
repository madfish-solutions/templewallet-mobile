import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import { CryptoLogoNameEnum } from './logo-name.enum';

export const getChainLogoName = (chain: TempleChainKind) =>
  chain === TempleChainKind.Tezos ? CryptoLogoNameEnum.Tezos : CryptoLogoNameEnum.Etherlink;
