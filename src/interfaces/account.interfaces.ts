import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

interface BaseAccount {
  id: string;
  name: string;
}

interface MultichainAccount extends BaseAccount {
  tezosAddress: string;
  tezosPublicKey: string;
  evmAddress: HexString;
  evmPublicKey: string;
}

export interface HDAccount extends MultichainAccount {
  type: AccountTypeEnum.HD;
  hdIndex: number;
}

export interface ImportedMultichainAccount extends MultichainAccount {
  type: AccountTypeEnum.IMPORTED_MULTICHAIN;
}

interface ChainAccount extends BaseAccount {
  chain: TempleChainKind;
  address: string;
  publicKey: string;
}

export interface ImportedChainAccount extends ChainAccount {
  type: AccountTypeEnum.IMPORTED_CHAIN;
}

export interface WatchOnlyDebugAccount extends ChainAccount {
  type: AccountTypeEnum.WATCH_ONLY_DEBUG;
}

export type Account = HDAccount | ImportedMultichainAccount | ImportedChainAccount | WatchOnlyDebugAccount;
