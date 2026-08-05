import { TzktOperation } from 'src/apis/tzkt/types';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

export enum ActivityOperKindEnum {
  interaction,
  transfer,
  approve
}

export enum ActivityStatus {
  applied,
  pending,
  failed
}

export enum ActivityOperTransferType {
  send,
  receive,
  sendToAccount,
  receiveFromAccount
}

export interface OperationMember {
  address: string;
  alias?: string;
}

interface ChainActivityBase {
  chain: TempleChainKind;
  hash: string;
  /** Number of operations left after filtering */
  operationsCount: number;
  /** Epoch milliseconds */
  addedAt: number;
  status?: ActivityStatus;
}

interface OperationBase {
  kind: ActivityOperKindEnum;
}

export interface TezosActivity extends ChainActivityBase {
  chain: TempleChainKind.Tezos;
  chainId: string;
  oldestTzktOperation: Pick<TzktOperation, 'timestamp' | 'level' | 'id' | 'hash'>;
  operations: TezosOperation[];
  status: ActivityStatus;
}

interface TezosOperationBase extends OperationBase {
  assetSlug?: string;
  /** `null` for 'unlimited' amount */
  amountSigned?: string | null;
}

interface TezosApproveOperation extends TezosOperationBase {
  kind: ActivityOperKindEnum.approve;
  spenderAddress: string;
}

interface TezosTransferOperation extends TezosOperationBase {
  kind: ActivityOperKindEnum.transfer;
  type: ActivityOperTransferType;
  fromAddress: string;
  toAddress: string;
}

interface TezosInteractionOperation extends TezosOperationBase {
  kind: ActivityOperKindEnum.interaction;
  withAddress?: string;
  /** Interaction with the mainnet sapling contract - rendered as a shielded transfer */
  isShielded?: boolean;
}

export type TezosOperation = TezosApproveOperation | TezosTransferOperation | TezosInteractionOperation;

export interface EvmActivityAsset {
  contract: string;
  tokenId?: string;
  /** `null` for 'unlimited' amount */
  amountSigned?: string | null;
  decimals?: number;
  nft?: boolean;
  symbol?: string;
  iconURL?: string;
}

interface EvmOperationBase extends OperationBase {
  asset?: EvmActivityAsset;
  logIndex: number;
}

interface EvmApproveOperation extends EvmOperationBase {
  kind: ActivityOperKindEnum.approve;
  spenderAddress: string;
}

interface EvmTransferOperation extends EvmOperationBase {
  kind: ActivityOperKindEnum.transfer;
  type: ActivityOperTransferType;
  fromAddress: string;
  toAddress: string;
}

interface EvmInteractionOperation extends EvmOperationBase {
  kind: ActivityOperKindEnum.interaction;
  withAddress?: string;
}

export type EvmOperation = EvmApproveOperation | EvmTransferOperation | EvmInteractionOperation;

export interface EvmActivity extends ChainActivityBase {
  chain: TempleChainKind.EVM;
  chainId: number;
  operations: EvmOperation[];
  blockHeight: `${number}`;
  index: number | null;
  fee: string | null;
  value: string | null;
}

export type Activity = TezosActivity | EvmActivity;
