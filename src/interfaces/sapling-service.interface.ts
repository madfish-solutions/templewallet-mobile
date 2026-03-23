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
  mnemonic: string;
  hdIndex?: number;
  saplingAddress: string;
  amount: BigNumber;
  rpcUrl: string;
}

export interface UnshieldParams {
  mnemonic: string;
  hdIndex?: number;
  recipientPublicKeyHash: string;
  amount: BigNumber;
  rpcUrl: string;
}

export interface SaplingTransferParams {
  mnemonic: string;
  hdIndex?: number;
  recipientSaplingAddress: string;
  amount: BigNumber;
  memo?: string;
  rpcUrl: string;
}

export interface SaplingOpParams {
  opParams: ParamsWithKind[];
}

export interface SaplingServiceInterface {
  /** Derive sapling credentials (viewing key and address) from a mnemonic */
  deriveCredentials(mnemonic: string, hdIndex?: number): Promise<SaplingCredentials>;

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
