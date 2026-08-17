import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

import CollectiblePlaceholderLogo from './assets/collectible-placeholder.svg';
import EtherlinkLogo from './assets/etherlink.svg';
import ShieldedTezosLogo from './assets/shielded-tezos.svg';
import TezosLogo from './assets/tezos.svg';
import TokenPlaceholderLogo from './assets/token-placeholder.svg';
import TzBtcLogo from './assets/tzBtc.svg';
import { CryptoLogoNameEnum } from './logo-name.enum';

export const CryptoLogoNameMap: Record<CryptoLogoNameEnum, FC<SvgProps>> = {
  [CryptoLogoNameEnum.Etherlink]: EtherlinkLogo,
  [CryptoLogoNameEnum.Tezos]: TezosLogo,
  [CryptoLogoNameEnum.ShieldedTezos]: ShieldedTezosLogo,
  [CryptoLogoNameEnum.TzBtc]: TzBtcLogo,
  [CryptoLogoNameEnum.TokenPlaceholder]: TokenPlaceholderLogo,
  [CryptoLogoNameEnum.CollectiblePlaceholder]: CollectiblePlaceholderLogo
};
