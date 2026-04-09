import { OpKind, RpcClient } from '@taquito/rpc';
import { ParamsWithKind, RpcReadAdapter } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { SAPLING_CONTRACT_ADDRESS, SAPLING_MEMO_SIZE } from 'src/config/sapling';
import {
  SaplingCredentials,
  SaplingOpParams,
  SaplingServiceInterface,
  SaplingTransactionHistory,
  SaplingTransactionHistoryItem,
  SaplingTransferParams,
  ShieldParams,
  UnshieldParams
} from 'src/interfaces/sapling-service.interface';
import { InMemorySpendingKey, InMemoryViewingKey } from 'src/utils/sapling/sapling-keys';
import { SaplingTransactionViewer } from 'src/utils/sapling/sapling-tx-viewer';
import { SaplingToolkit } from 'src/utils/sapling/taquito-sapling';

const spendingKeyCache = new Map<string, InMemorySpendingKey>();

function buildOpParams(saplingContractAddress: string, amountMutez: BigNumber, txData: string): ParamsWithKind[] {
  const opParam: ParamsWithKind = {
    kind: OpKind.TRANSACTION,
    to: saplingContractAddress,
    amount: amountMutez.toNumber(),
    mutez: true,
    parameter: { entrypoint: 'default', value: [{ bytes: txData }] }
  };

  return [opParam];
}

function getOrCreateSpendingKey(sask: string): InMemorySpendingKey {
  const cached = spendingKeyCache.get(sask);

  if (cached) {
    return cached;
  }

  const spendingKey = new InMemorySpendingKey(sask);
  spendingKeyCache.set(sask, spendingKey);

  return spendingKey;
}

function createSaplingToolkit(spendingKey: InMemorySpendingKey, rpcUrl: string): SaplingToolkit {
  const contractAddress = SAPLING_CONTRACT_ADDRESS;

  return new SaplingToolkit(
    { saplingSigner: spendingKey },
    { contractAddress, memoSize: SAPLING_MEMO_SIZE },
    new RpcReadAdapter(new RpcClient(rpcUrl))
  );
}

function createTxViewer(viewingKey: string, rpcUrl: string): SaplingTransactionViewer {
  const contractAddress = SAPLING_CONTRACT_ADDRESS;

  return new SaplingTransactionViewer(
    new InMemoryViewingKey(viewingKey),
    { contractAddress },
    new RpcReadAdapter(new RpcClient(rpcUrl))
  );
}

class SaplingService implements SaplingServiceInterface {
  async deriveCredentials(sask: string): Promise<SaplingCredentials> {
    const spendingKey = getOrCreateSpendingKey(sask);
    const viewingKeyProvider = await spendingKey.getSaplingViewingKeyProvider();

    return {
      viewingKey: viewingKeyProvider.getFullViewingKey().toString('hex'),
      saplingAddress: (await viewingKeyProvider.getAddress()).address
    };
  }

  async getShieldedBalance(viewingKey: string, rpcUrl: string): Promise<string> {
    const viewer = createTxViewer(viewingKey, rpcUrl);
    const transactions = await viewer.getIncomingAndOutgoingTransactions();

    let balance = new BigNumber(0);
    for (const tx of transactions.incoming) {
      if (!tx.isSpent) {
        balance = balance.plus(tx.value);
      }
    }

    return balance.toFixed();
  }

  async getTransactionHistory(viewingKey: string, rpcUrl: string): Promise<SaplingTransactionHistory> {
    const viewer = createTxViewer(viewingKey, rpcUrl);
    const transactions = await viewer.getTransactionsWithoutChangeRaw();

    return {
      incoming: transactions
        .filter(tx => tx.type === 'incoming')
        .map(
          (tx): SaplingTransactionHistoryItem => ({
            value: tx.value.toFixed(),
            memo: tx.memo,
            paymentAddress: tx.paymentAddress,
            type: 'incoming',
            position: tx.position
          })
        ),
      outgoing: transactions
        .filter(tx => tx.type === 'outgoing')
        .map(
          (tx): SaplingTransactionHistoryItem => ({
            value: tx.value.toFixed(),
            memo: tx.memo,
            paymentAddress: tx.paymentAddress,
            type: 'outgoing',
            position: tx.position
          })
        )
    };
  }

  async prepareShieldTransaction(params: ShieldParams): Promise<SaplingOpParams> {
    const spendingKey = getOrCreateSpendingKey(params.spendingKey);
    const toolkit = createSaplingToolkit(spendingKey, params.rpcUrl);

    const txData = await toolkit.prepareShieldedTransaction([
      { to: params.saplingAddress, amount: params.amount.toNumber(), mutez: true, memo: params.memo }
    ]);

    return {
      opParams: buildOpParams(SAPLING_CONTRACT_ADDRESS, params.amount, txData)
    };
  }

  async prepareUnshieldTransaction(params: UnshieldParams): Promise<SaplingOpParams> {
    const spendingKey = getOrCreateSpendingKey(params.spendingKey);
    const toolkit = createSaplingToolkit(spendingKey, params.rpcUrl);

    const txData = await toolkit.prepareUnshieldedTransaction({
      to: params.recipientPublicKeyHash,
      amount: params.amount.toNumber(),
      mutez: true
    });

    return {
      opParams: buildOpParams(SAPLING_CONTRACT_ADDRESS, new BigNumber(0), txData)
    };
  }

  async prepareSaplingTransfer(params: SaplingTransferParams): Promise<SaplingOpParams> {
    const spendingKey = getOrCreateSpendingKey(params.spendingKey);
    const toolkit = createSaplingToolkit(spendingKey, params.rpcUrl);

    const txData = await toolkit.prepareSaplingTransaction([
      {
        to: params.recipientSaplingAddress,
        amount: params.amount.toNumber(),
        mutez: true,
        memo: params.memo
      }
    ]);

    return {
      opParams: buildOpParams(SAPLING_CONTRACT_ADDRESS, new BigNumber(0), txData)
    };
  }
}

export const saplingService = new SaplingService();

/** Clear cached spending keys (call on lock/account switch) */
export const clearSaplingServiceCache = (): void => {
  spendingKeyCache.clear();
};
