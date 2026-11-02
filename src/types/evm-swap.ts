import { Route3EvmRoute } from 'src/apis/temple-wallet/evm-swap';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';

interface EvmSwapAssetBase extends AssetInterface {
  chainKind: TempleChainKind.EVM;
  chainId: number;
  assetSlug: string;
  assetKey: string;
  networkName: string;
}

export type EvmSwapAsset = EvmSwapAssetBase &
  (
    | { standard: EvmAssetStandardEnum.NATIVE; assetSlug: typeof EVM_TOKEN_SLUG }
    | { standard: EvmAssetStandardEnum.ERC20; contractAddress: HexString }
  );

export interface EvmSwapAssetDescriptor {
  chainKind: TempleChainKind.EVM;
  chainId: number;
  slug: string;
}

export interface EvmSwapQuoteIdentity {
  chainId: number;
  fromAddress: HexString;
  src: HexString;
  dst: HexString;
  amount: string;
  slippage: string;
  referrer: HexString;
  fee: string;
}

export interface EvmSwapQuote {
  identity: EvmSwapQuoteIdentity;
  route: Route3EvmRoute;
  receivedAt: number;
}
