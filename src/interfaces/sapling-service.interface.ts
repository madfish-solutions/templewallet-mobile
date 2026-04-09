import { ParamsWithKind } from '@taquito/taquito';

export interface SaplingCredentials {
  saplingAddress: string;
  viewingKey: string;
}

export interface SaplingTransactionHistoryItem {
  value: string;
  memo: string;
  paymentAddress: string;
  isSpent?: boolean;
  type: 'incoming' | 'outgoing';
  position: number;
}

export interface SaplingTransactionHistory {
  incoming: SaplingTransactionHistoryItem[];
  outgoing: SaplingTransactionHistoryItem[];
}

export interface ShieldParams {
  spendingKey: string;
  saplingAddress: string;
  amount: BigNumber;
  rpcUrl: string;
  memo?: string;
}

export interface UnshieldParams {
  spendingKey: string;
  recipientPublicKeyHash: string;
  amount: BigNumber;
  rpcUrl: string;
}

export interface SaplingTransferParams {
  spendingKey: string;
  recipientSaplingAddress: string;
  amount: BigNumber;
  memo?: string;
  rpcUrl: string;
}

export interface SaplingOpParams {
  opParams: ParamsWithKind[];
}

export interface SaplingServiceInterface {
  /** Derive sapling credentials (viewing key and address) from a spending key */
  deriveCredentials(spendingKey: string): Promise<SaplingCredentials>;

  /** Get the shielded balance in mutez for a given viewing key */
  getShieldedBalance(viewingKey: string, rpcUrl: string): Promise<string>;

  /** Get incoming and outgoing shielded transaction history */
  getTransactionHistory(viewingKey: string, rpcUrl: string): Promise<SaplingTransactionHistory>;

  /** Prepare a shield transaction (public TEZ - shielded) */
  prepareShieldTransaction(params: ShieldParams): Promise<SaplingOpParams>;

  /** Prepare an unshield transaction (shielded - public TEZ) */
  prepareUnshieldTransaction(params: UnshieldParams): Promise<SaplingOpParams>;

  /** Prepare a sapling transfer (shielded - shielded) */
  prepareSaplingTransfer(params: SaplingTransferParams): Promise<SaplingOpParams>;
}
