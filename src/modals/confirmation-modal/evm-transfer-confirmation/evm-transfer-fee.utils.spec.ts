import { parseEther } from 'viem';

import { formatNetworkFee, getGasPriceForNetworkFee, getNetworkFeeSliderValues } from './evm-transfer-fee.utils';

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
    const values = getNetworkFeeSliderValues(parseEther('0.0002'), parseEther('0.0002'));

    expect(values.minimumValue).toBeCloseTo(0.0001);
    expect(values.maximumValue).toBeCloseTo(0.0003);
    expect(values.value).toBeCloseTo(0.0002);
  });

  it('expands the slider range to include a custom fee', () => {
    expect(getNetworkFeeSliderValues(parseEther('0.0002'), parseEther('0.0004'))).toEqual({
      minimumValue: 0.0001,
      maximumValue: 0.0004,
      value: 0.0004
    });
  });
});
