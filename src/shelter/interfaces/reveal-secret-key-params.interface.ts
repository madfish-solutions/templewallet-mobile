import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

export interface RevealSecretKeyParams {
  address?: string;
  chain?: TempleChainKind;
  /** @deprecated Use address. */
  publicKeyHash?: string;
  successCallback: SyncFn<string>;
}
