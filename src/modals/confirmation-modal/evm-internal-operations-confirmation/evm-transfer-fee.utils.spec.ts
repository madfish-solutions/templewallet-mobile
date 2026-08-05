import { parseEther } from 'viem';

import { Eip1559Estimation, LegacyEstimation } from 'src/utils/evm/estimate-evm-transaction';

import {
  formatNetworkFee,
  getEip1559FeeOptions,
  getEip1559FeesForMaxFee,
  getEvmFeeOptions,
  getEvmFeesForGasPrice,
  getGasPriceForNetworkFee,
  getNetworkFeeSliderValues
} from './evm-transfer-fee.utils';

const estimation: Eip1559Estimation = {
  type: 'eip1559',
  gas: 21_000n,
  maxFeePerGas: 100n,
  maxPriorityFeePerGas: 20n,
  estimatedFee: 2_100_000n
};

const legacyEstimation: LegacyEstimation = {
  type: 'legacy',
  gas: 21_000n,
  gasPrice: 100n,
  estimatedFee: 2_100_000n
};

describe('EVM transfer fee utils', () => {
  it('formats a network fee with six decimal places', () => {
    expect(formatNetworkFee(parseEther('0.0001234'))).toBe('0.000123');
  });

  it('calculates a gas price that covers the selected network fee', () => {
    const gasLimit = 21_000n;
    const selectedFee = 0.000001;
    const gasPrice = getGasPriceForNetworkFee(selectedFee, gasLimit);

    expect(gasLimit * gasPrice).toBeGreaterThanOrEqual(parseEther(selectedFee.toFixed(6)));
  });

  it('centers the slider range around the estimated fee', () => {
    const values = getNetworkFeeSliderValues(parseEther('0.00018'), parseEther('0.00022'), parseEther('0.0002'));

    expect(values.minimumValue).toBeCloseTo(0.00018);
    expect(values.maximumValue).toBeCloseTo(0.00022);
    expect(values.step).toBeCloseTo(0.000001);
    expect(values.value).toBeCloseTo(0.0002);
  });

  it('expands the slider range to include a custom fee', () => {
    expect(getNetworkFeeSliderValues(parseEther('0.00018'), parseEther('0.00022'), parseEther('0.0004'))).toEqual({
      minimumValue: 0.00018,
      maximumValue: 0.0004,
      step: 0.000001,
      value: 0.0004
    });
  });

  it('uses a smaller slider step for sub-micro fees', () => {
    expect(getNetworkFeeSliderValues(1n, 21n, 11n).step).toBeLessThan(0.000001);
  });

  it('builds network-relative EIP-1559 fee options', () => {
    expect(getEip1559FeeOptions(estimation)).toEqual({
      slow: { type: 'eip1559', maxFeePerGas: 90n, maxPriorityFeePerGas: 18n, fee: 1_890_000n },
      mid: { type: 'eip1559', maxFeePerGas: 100n, maxPriorityFeePerGas: 20n, fee: 2_100_000n },
      fast: { type: 'eip1559', maxFeePerGas: 110n, maxPriorityFeePerGas: 22n, fee: 2_310_000n }
    });
  });

  it('builds network-relative legacy fee options', () => {
    expect(getEvmFeeOptions(legacyEstimation)).toEqual({
      slow: { type: 'legacy', gasPrice: 90n, fee: 1_890_000n },
      mid: { type: 'legacy', gasPrice: 100n, fee: 2_100_000n },
      fast: { type: 'legacy', gasPrice: 110n, fee: 2_310_000n }
    });
  });

  it('scales priority fee while keeping it at or below the max fee', () => {
    expect(getEip1559FeesForMaxFee(50n, estimation)).toEqual({
      type: 'eip1559',
      maxFeePerGas: 50n,
      maxPriorityFeePerGas: 10n
    });

    expect(getEip1559FeesForMaxFee(1n, { ...estimation, maxFeePerGas: 10n, maxPriorityFeePerGas: 20n })).toEqual({
      type: 'eip1559',
      maxFeePerGas: 1n,
      maxPriorityFeePerGas: 1n
    });
  });

  it('maps the single gas-price input to the estimated transaction type', () => {
    expect(getEvmFeesForGasPrice(120n, legacyEstimation)).toEqual({ type: 'legacy', gasPrice: 120n });
    expect(getEvmFeesForGasPrice(120n, estimation)).toEqual({
      type: 'eip1559',
      maxFeePerGas: 120n,
      maxPriorityFeePerGas: 24n
    });
  });

  it('does not display a positive sub-micro fee as zero', () => {
    expect(formatNetworkFee(1n)).toBe('<0.000001');
  });
});
