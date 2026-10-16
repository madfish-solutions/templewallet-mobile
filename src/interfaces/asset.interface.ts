import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AssetMediaURIs } from 'src/utils/assets/types';

/** Common fields required to display and value an asset, independent of its chain identity. */
export interface AssetInterface extends AssetMediaURIs {
  name: string;
  symbol: string;
  decimals: number;
  iconName?: CryptoLogoNameEnum;
  balance: string;
  exchangeRate?: number;
  assetKey?: string;
  assetSlug?: string;
  chainKind?: TempleChainKind;
  networkName?: string;
}
