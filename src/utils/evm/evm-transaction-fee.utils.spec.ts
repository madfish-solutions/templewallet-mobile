import { resolveEvmGasLimit, resolveEvmSubmissionFees } from './evm-transaction-fee.utils';

const EIP1559_ESTIMATION = {
  type: 'eip1559' as const,
  gas: 21_000n,
  maxFeePerGas: 10_000_000_000n,
  maxPriorityFeePerGas: 1_000_000_000n,
  estimatedFee: 210_000_000_000_000n
};

describe('resolveEvmGasLimit', () => {
  it('uses the provided gas limit even when it is below the estimate', () => {
    expect(resolveEvmGasLimit(30_000n, 21_000n)).toBe(21_000n);
  });

  it('uses the estimate when no gas limit is provided', () => {
    expect(resolveEvmGasLimit(30_000n)).toBe(30_000n);
    expect(resolveEvmGasLimit(30_000n, 0n)).toBe(30_000n);
  });
});

describe('resolveEvmSubmissionFees', () => {
  it('keeps a provided priority fee when the user selects a different max fee', () => {
    expect(
      resolveEvmSubmissionFees(8_000_000_000n, EIP1559_ESTIMATION, {
        value: 0n,
        maxFeePerGas: 10_000_000_000n,
        maxPriorityFeePerGas: 1_500_000_000n
      })
    ).toEqual({
      type: 'eip1559',
      maxFeePerGas: 8_000_000_000n,
      maxPriorityFeePerGas: 1_500_000_000n
    });
  });

  it('clamps a provided priority fee to the selected max fee', () => {
    expect(
      resolveEvmSubmissionFees(1_000_000_000n, EIP1559_ESTIMATION, {
        value: 0n,
        maxPriorityFeePerGas: 2_000_000_000n
      })
    ).toEqual({
      type: 'eip1559',
      maxFeePerGas: 1_000_000_000n,
      maxPriorityFeePerGas: 1_000_000_000n
    });
  });

  it('scales priority fee from the estimate when the request does not provide one', () => {
    expect(resolveEvmSubmissionFees(20_000_000_000n, EIP1559_ESTIMATION)).toEqual({
      type: 'eip1559',
      maxFeePerGas: 20_000_000_000n,
      maxPriorityFeePerGas: 2_000_000_000n
    });
  });
});
