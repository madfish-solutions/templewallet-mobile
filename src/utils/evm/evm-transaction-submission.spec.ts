import { Hash, TransactionReceipt } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import {
  EvmTransactionSubmissionDependencies,
  EvmTransactionSubmissionService,
  SubmitEvmTransactionParams
} from './evm-transaction-submission';
import { EvmTransactionSubmissionError } from './evm-transaction-submission-error';

const SOURCE_ADDRESS = '0x19E7E376E7C213B7E7e7e46cc70A5dD086DAff2A';
const OTHER_ADDRESS = '0x1563915e194D8CfBA1943570603F7606A3115508';
const TRANSACTION_HASH = `0x${'1'.repeat(64)}` as Hash;
const REPLACEMENT_HASH = `0x${'2'.repeat(64)}` as Hash;
const NETWORK = { chainId: 1, rpcBaseURL: 'https://rpc.example.com' };
const TRANSACTION = {
  type: 'eip1559',
  to: OTHER_ADDRESS,
  value: 1n,
  gas: 21_000n,
  maxFeePerGas: 2n,
  maxPriorityFeePerGas: 1n
} as const;
const ACCOUNT = privateKeyToAccount(`0x${'1'.repeat(64)}`);

const makeReceipt = (status: TransactionReceipt['status'], transactionHash = TRANSACTION_HASH) =>
  ({ status, transactionHash } as TransactionReceipt);

const makeDependencies = (): jest.Mocked<EvmTransactionSubmissionDependencies> => ({
  getAccount: jest.fn().mockResolvedValue(ACCOUNT),
  sendTransaction: jest.fn().mockResolvedValue(TRANSACTION_HASH),
  waitForReceipt: jest.fn().mockResolvedValue(makeReceipt('success'))
});

const makeParams = (overrides: Partial<SubmitEvmTransactionParams> = {}): SubmitEvmTransactionParams => ({
  network: NETWORK,
  sourceAddress: SOURCE_ADDRESS,
  transaction: TRANSACTION,
  ...overrides
});

describe('EvmTransactionSubmissionService', () => {
  it('reveals the matching account, broadcasts the transaction and returns its receipt', async () => {
    const dependencies = makeDependencies();
    const service = new EvmTransactionSubmissionService(dependencies);

    const receipt = await service.submit(makeParams());

    expect(receipt).toEqual(makeReceipt('success'));
    expect(dependencies.getAccount).toHaveBeenCalledWith(SOURCE_ADDRESS);
    expect(dependencies.sendTransaction).toHaveBeenCalledWith(NETWORK, ACCOUNT, TRANSACTION);
    expect(dependencies.waitForReceipt).toHaveBeenCalledWith(
      NETWORK,
      TRANSACTION_HASH,
      expect.objectContaining({ onReplaced: expect.any(Function) })
    );
  });

  it('resumes receipt polling without signing or broadcasting again', async () => {
    const dependencies = makeDependencies();
    dependencies.waitForReceipt.mockResolvedValue(makeReceipt('success', REPLACEMENT_HASH));
    const service = new EvmTransactionSubmissionService(dependencies);

    const receipt = await service.submit(makeParams({ submittedHash: TRANSACTION_HASH }));

    expect(receipt.transactionHash).toBe(REPLACEMENT_HASH);
    expect(dependencies.getAccount).not.toHaveBeenCalled();
    expect(dependencies.sendTransaction).not.toHaveBeenCalled();
    expect(dependencies.waitForReceipt).toHaveBeenCalledWith(
      NETWORK,
      TRANSACTION_HASH,
      expect.objectContaining({ onReplaced: expect.any(Function) })
    );
  });

  it('does not broadcast when Shelter cannot reveal the account', async () => {
    const dependencies = makeDependencies();
    const shelterError = new Error('Failed to reveal private key');
    dependencies.getAccount.mockRejectedValue(shelterError);
    const service = new EvmTransactionSubmissionService(dependencies);

    await expect(service.submit(makeParams())).rejects.toMatchObject({
      code: 'account-unavailable',
      cause: shelterError
    });
    expect(dependencies.sendTransaction).not.toHaveBeenCalled();
  });

  it('does not broadcast when the revealed account does not match the selected source', async () => {
    const dependencies = makeDependencies();
    dependencies.getAccount.mockResolvedValue(privateKeyToAccount(`0x${'2'.repeat(64)}`));
    const service = new EvmTransactionSubmissionService(dependencies);

    await expect(service.submit(makeParams())).rejects.toMatchObject({ code: 'signer-address-mismatch' });
    expect(dependencies.sendTransaction).not.toHaveBeenCalled();
  });

  it('does not broadcast when the selected source address is invalid', async () => {
    const dependencies = makeDependencies();
    const service = new EvmTransactionSubmissionService(dependencies);

    await expect(service.submit(makeParams({ sourceAddress: '0xinvalid' }))).rejects.toMatchObject({
      code: 'signer-address-mismatch'
    });
    expect(dependencies.sendTransaction).not.toHaveBeenCalled();
  });

  it('attaches a broadcast hash to receipt errors so retries cannot duplicate the transfer', async () => {
    const dependencies = makeDependencies();
    const receiptError = new Error('RPC timed out');
    dependencies.waitForReceipt.mockRejectedValue(receiptError);
    const service = new EvmTransactionSubmissionService(dependencies);

    await expect(service.submit(makeParams())).rejects.toMatchObject({
      code: 'receipt-unavailable',
      cause: receiptError,
      transactionHash: TRANSACTION_HASH
    });
  });

  it.each(['cancelled', 'replaced'] as const)(
    'rejects a transaction that was %s by another transaction',
    async reason => {
      const dependencies = makeDependencies();
      dependencies.waitForReceipt.mockImplementation(async (_network, _hash, options) => {
        options?.onReplaced?.({ reason } as never);

        return makeReceipt('success', REPLACEMENT_HASH);
      });
      const service = new EvmTransactionSubmissionService(dependencies);

      await expect(service.submit(makeParams())).rejects.toMatchObject({
        code: 'transaction-replaced',
        transactionHash: REPLACEMENT_HASH
      });
    }
  );

  it('supports legacy transaction data without changing it', async () => {
    const dependencies = makeDependencies();
    const service = new EvmTransactionSubmissionService(dependencies);
    const transaction = {
      type: 'legacy',
      to: OTHER_ADDRESS,
      value: 1n,
      gas: 21_000n,
      gasPrice: 2n
    } as const;

    await service.submit(makeParams({ transaction }));

    expect(dependencies.sendTransaction).toHaveBeenCalledWith(NETWORK, ACCOUNT, transaction);
  });

  it('rejects a mined transaction whose execution reverted', async () => {
    const dependencies = makeDependencies();
    const receipt = makeReceipt('reverted');
    dependencies.waitForReceipt.mockResolvedValue(receipt);
    const service = new EvmTransactionSubmissionService(dependencies);

    const error = await service.submit(makeParams()).catch(cause => cause);

    expect(error).toBeInstanceOf(EvmTransactionSubmissionError);
    expect(error).toMatchObject({
      code: 'transaction-reverted',
      transactionHash: TRANSACTION_HASH,
      receipt
    });
  });
});
