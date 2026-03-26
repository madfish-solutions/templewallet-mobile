import { OpKind, RpcClient } from '@taquito/rpc';
import { ParamsWithKind, RpcReadAdapter } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { mnemonicToEntropy } from 'bip39';

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

function getSpendingKeyCacheKey(mnemonic: string, hdIndex?: number): string {
  const seed = mnemonicToEntropy(mnemonic);

  return `${seed}:${hdIndex ?? 'default'}`;
}

function getDerivationPath(hdIndex?: number): string | undefined {
  return hdIndex !== undefined ? `m/44'/1729'/${hdIndex}'/0'` : undefined;
}

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

async function getOrCreateSpendingKey(mnemonic: string, hdIndex?: number): Promise<InMemorySpendingKey> {
  const cacheKey = getSpendingKeyCacheKey(mnemonic, hdIndex);
  const cached = spendingKeyCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const spendingKey = await InMemorySpendingKey.fromMnemonic(mnemonic, getDerivationPath(hdIndex));
  spendingKeyCache.set(cacheKey, spendingKey);

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
  async deriveCredentials(mnemonic: string, hdIndex?: number): Promise<SaplingCredentials> {
    const spendingKey = await getOrCreateSpendingKey(mnemonic, hdIndex);
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
    const spendingKey = await getOrCreateSpendingKey(params.mnemonic, params.hdIndex);
    const toolkit = createSaplingToolkit(spendingKey, params.rpcUrl);

    const txData = await toolkit.prepareShieldedTransaction([
      { to: params.saplingAddress, amount: params.amount.toNumber(), mutez: true, memo: params.memo }
    ]);

    return {
      opParams: buildOpParams(SAPLING_CONTRACT_ADDRESS, params.amount, txData)
    };
  }

  async prepareUnshieldTransaction(params: UnshieldParams): Promise<SaplingOpParams> {
    const spendingKey = await getOrCreateSpendingKey(params.mnemonic, params.hdIndex);
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
    const spendingKey = await getOrCreateSpendingKey(params.mnemonic, params.hdIndex);
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
