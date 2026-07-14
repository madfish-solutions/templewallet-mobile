import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

import EtherlinkLogo from './assets/etherlink.svg';
import PlaceholderLogo from './assets/placeholder.svg';
import ShieldedTezosLogo from './assets/shielded-tezos.svg';
import TezosLogo from './assets/tezos.svg';
import { CryptoLogoNameEnum } from './logo-name.enum';

export const CryptoLogoNameMap: Record<CryptoLogoNameEnum, FC<SvgProps>> = {
  [CryptoLogoNameEnum.Etherlink]: EtherlinkLogo,
  [CryptoLogoNameEnum.Placeholder]: PlaceholderLogo,
  [CryptoLogoNameEnum.Tezos]: TezosLogo,
  [CryptoLogoNameEnum.ShieldedTezos]: ShieldedTezosLogo
};
