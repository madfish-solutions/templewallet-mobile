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

interface SubmitEvmTransactionParams {
  network: EvmNetworkEssentials;
  sourceAddress: HexString;
  transaction: EvmTransactionData;
  /**
   * Reuses a transaction that was already broadcast when its receipt could not be obtained.
   * This prevents a retry from accidentally sending the transfer twice.
   */
  submittedHash?: Hash;
  receiptOptions?: ReceiptOptions;
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
    submittedHash,
    receiptOptions
  }: SubmitEvmTransactionParams): Promise<TransactionReceipt> {
    const transactionHash = submittedHash ?? (await this.signAndBroadcast(network, sourceAddress, transaction));
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
      throw new EvmTransactionSubmissionError('receipt-unavailable', 'Unable to obtain the transaction receipt', {
        cause,
        transactionHash
      });
    }

    if (replacementReason === 'cancelled' || replacementReason === 'replaced') {
      throw new EvmTransactionSubmissionError(
        'transaction-replaced',
        replacementReason === 'cancelled'
          ? 'The submitted transaction was cancelled'
          : 'The submitted transaction was replaced by a different transaction',
        { transactionHash: receipt.transactionHash, receipt }
      );
    }

    if (receipt.status === 'reverted') {
      throw new EvmTransactionSubmissionError('transaction-reverted', 'The submitted transaction reverted', {
        transactionHash: receipt.transactionHash,
        receipt
      });
    }

    return receipt;
  }

  private async signAndBroadcast(
    network: EvmNetworkEssentials,
    sourceAddress: HexString,
    transaction: EvmTransactionData
  ): Promise<Hash> {
    let account: LocalAccount;

    try {
      account = await this.dependencies.getAccount(sourceAddress);
    } catch (cause) {
      throw new EvmTransactionSubmissionError('account-unavailable', 'Unable to access the selected account', {
        cause
      });
    }

    let isMatchingAccount = false;

    try {
      isMatchingAccount = isAddressEqual(account.address, sourceAddress);
    } catch (cause) {
      throw new EvmTransactionSubmissionError(
        'signer-address-mismatch',
        'The revealed signer or selected account address is invalid',
        { cause }
      );
    }

    if (!isMatchingAccount) {
      throw new EvmTransactionSubmissionError(
        'signer-address-mismatch',
        'The revealed signer does not match the selected account'
      );
    }

    return this.dependencies.sendTransaction(network, account, transaction);
  }
}

export const evmTransactionSubmissionService = new EvmTransactionSubmissionService();
