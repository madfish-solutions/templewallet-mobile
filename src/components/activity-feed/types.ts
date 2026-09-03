import { ActivityOperKindEnum } from 'src/activity/types';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

export const BUNDLE_FACE_KIND = 'bundle';

export type ActivityFaceKind = ActivityOperKindEnum | typeof BUNDLE_FACE_KIND;

export enum ActivityRowKind {
  send,
  receive,
  transfer,
  interaction,
  approve,
  bundle
}

export enum ActivityAssetImageKind {
  tokenIcon,
  cryptoLogo,
  evmTokenIcon,
  evmCollectibleImage
}

export type ActivityAssetImageSource =
  | { kind: ActivityAssetImageKind.tokenIcon; thumbnailUri?: string }
  | { kind: ActivityAssetImageKind.cryptoLogo; name: CryptoLogoNameEnum }
  | { kind: ActivityAssetImageKind.evmTokenIcon; chainId: number; contract: string; iconURL?: string }
  | { kind: ActivityAssetImageKind.evmCollectibleImage; imageUri?: string };

export interface ActivityAssetView {
  asset?: ActivityRowAsset;
  fiatRate?: number;
}

export interface ActivityRowAsset {
  contract: string;
  /** `null` for the 'unlimited' allowance */
  amountSigned?: string | null;
  decimals?: number;
  symbol?: string;
  /** The row title fallback for NFTs without a symbol */
  name?: string;
  isNft: boolean;
  image?: ActivityAssetImageSource;
}

export type ActivityChainRef =
  | { chain: TempleChainKind.Tezos; chainId: string }
  | { chain: TempleChainKind.EVM; chainId: number };
