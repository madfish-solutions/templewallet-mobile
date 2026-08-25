import { firstValueFrom } from 'rxjs';
import {
  Hash,
  isAddressEqual,
  SendTransactionRequest,
  TransactionReceipt,
  WaitForTransactionReceiptParameters
} from 'viem';
import { LocalAccount } from 'viem/accounts';

import { Shelter } from 'src/shelter/shelter';
import { EvmNetworkEssentials } from 'src/types/networks';
import { EvmTransactionSubmissionError } from 'src/utils/evm/evm-transaction-submission-error';
import { getViemPublicClient, getViemWalletClient } from 'src/utils/rpc/evm-client.utils';

type EvmTransactionData = SendTransactionRequest;

type ReceiptOptions = Omit<WaitForTransactionReceiptParameters, 'hash'>;

type EvmTransactionSubmissionResult =
  | { success: true; receipt: TransactionReceipt }
  | { success: false; error: unknown };

type EvmTransactionBroadcastResult = { success: true; transactionHash: Hash } | { success: false; error: unknown };

interface SubmitEvmTransactionParams {
  network: EvmNetworkEssentials;
  sourceAddress: HexString;
  transaction: EvmTransactionData;
  receiptOptions?: ReceiptOptions;
  onBroadcast?: (transactionHash: Hash) => void;
}

interface EvmTransactionSubmissionDependencies {
  getAccount: (address: HexString) => Promise<LocalAccount>;
  sendTransaction: (
    network: EvmNetworkEssentials,
    account: LocalAccount,
    transaction: EvmTransactionData
  ) => Promise<Hash>;
  waitForReceipt: (network: EvmNetworkEssentials, hash: Hash, options?: ReceiptOptions) => Promise<TransactionReceipt>;
}

const defaultDependencies: EvmTransactionSubmissionDependencies = {
  getAccount: address => firstValueFrom(Shelter.getEvmAccount$(address)),
  sendTransaction: (network, account, transaction) =>
    getViemWalletClient(network, account).sendTransaction({ ...transaction, account }),
  waitForReceipt: (network, hash, options) =>
    getViemPublicClient(network).waitForTransactionReceipt({ ...options, hash })
};

/**
 * Owns the complete chain-agnostic EVM submission lifecycle: account access,
 * local signing, broadcasting, replacement-aware receipt polling and receipt validation.
 */
class EvmTransactionSubmissionService {
  private readonly dependencies: EvmTransactionSubmissionDependencies;

  constructor(dependencies: Partial<EvmTransactionSubmissionDependencies> = {}) {
    this.dependencies = { ...defaultDependencies, ...dependencies };
  }

  async submit({
    network,
    sourceAddress,
    transaction,
    receiptOptions,
    onBroadcast
  }: SubmitEvmTransactionParams): Promise<EvmTransactionSubmissionResult> {
    const broadcastResult = await this.broadcast({ network, sourceAddress, transaction });

    if (!broadcastResult.success) {
      return broadcastResult;
    }

    const { transactionHash } = broadcastResult;

    onBroadcast?.(transactionHash);

    return this.waitForConfirmation(network, transactionHash, receiptOptions);
  }

  /**
   * Sign and broadcast only. Used when the caller must return the hash before
   * waiting for confirmation (e.g. WalletConnect `eth_sendTransaction`).
   */
  async broadcast({
    network,
    sourceAddress,
    transaction
  }: Omit<SubmitEvmTransactionParams, 'receiptOptions' | 'onBroadcast'>): Promise<EvmTransactionBroadcastResult> {
    return this.signAndBroadcast(network, sourceAddress, transaction);
  }

  /**
   * Wait for a previously broadcast transaction and validate the receipt
   * (replacements, reverts). Used when broadcast already happened elsewhere
   * (e.g. WalletConnect must return the hash to the dApp first).
   */
  async waitForConfirmation(
    network: EvmNetworkEssentials,
    transactionHash: Hash,
    receiptOptions?: ReceiptOptions
  ): Promise<EvmTransactionSubmissionResult> {
    let replacementReason: 'cancelled' | 'replaced' | 'repriced' | undefined;
    let receipt: TransactionReceipt;

    try {
      receipt = await this.dependencies.waitForReceipt(network, transactionHash, {
        ...receiptOptions,
        onReplaced: replacement => {
          replacementReason = replacement.reason;
          receiptOptions?.onReplaced?.(replacement);
        }
      });
    } catch (cause) {
      return {
        success: false,
        error: new EvmTransactionSubmissionError('receipt-unavailable', 'Unable to obtain the transaction receipt', {
          cause,
          transactionHash
        })
      };
    }

    if (replacementReason === 'cancelled' || replacementReason === 'replaced') {
      return {
        success: false,
        error: new EvmTransactionSubmissionError(
          'transaction-replaced',
          replacementReason === 'cancelled'
            ? 'The submitted transaction was cancelled'
            : 'The submitted transaction was replaced by a different transaction',
          { transactionHash: receipt.transactionHash, receipt }
        )
      };
    }

    if (receipt.status === 'reverted') {
      return {
        success: false,
        error: new EvmTransactionSubmissionError('transaction-reverted', 'The submitted transaction reverted', {
          transactionHash: receipt.transactionHash,
          receipt
        })
      };
    }

    return { success: true, receipt };
  }

  private async signAndBroadcast(
    network: EvmNetworkEssentials,
    sourceAddress: HexString,
    transaction: EvmTransactionData
  ): Promise<EvmTransactionBroadcastResult> {
    let account: LocalAccount;

    try {
      account = await this.dependencies.getAccount(sourceAddress);
    } catch (cause) {
      return {
        success: false,
        error: new EvmTransactionSubmissionError('account-unavailable', 'Unable to access the selected account', {
          cause
        })
      };
    }

    let isMatchingAccount = false;

    try {
      isMatchingAccount = isAddressEqual(account.address, sourceAddress);
    } catch (cause) {
      return {
        success: false,
        error: new EvmTransactionSubmissionError(
          'signer-address-mismatch',
          'The revealed signer or selected account address is invalid',
          { cause }
        )
      };
    }

    if (!isMatchingAccount) {
      return {
        success: false,
        error: new EvmTransactionSubmissionError(
          'signer-address-mismatch',
          'The revealed signer does not match the selected account'
        )
      };
    }

    try {
      const transactionHash = await this.dependencies.sendTransaction(network, account, transaction);

      return { success: true, transactionHash };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export const evmTransactionSubmissionService = new EvmTransactionSubmissionService();
