import { act, renderHook } from '@testing-library/react-native';
import { BigNumber } from 'bignumber.js';

import { useNumericInput } from './use-numeric-input.hook';

const UINT256_TOKEN_ID = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
const ABOVE_MAX_SAFE_INTEGER = '9007199254740993';

describe('useNumericInput', () => {
  it('caps at Number.MAX_SAFE_INTEGER when no max is given', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useNumericInput(undefined, 0, undefined, undefined, onChange));

    act(() => result.current.handleChange(ABOVE_MAX_SAFE_INTEGER));

    expect(result.current.stringValue).toBe('');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('accepts integers beyond Number.MAX_SAFE_INTEGER when an explicit larger max is given', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useNumericInput(undefined, 0, undefined, UINT256_TOKEN_ID, onChange));

    act(() => result.current.handleChange(UINT256_TOKEN_ID));

    expect(result.current.stringValue).toBe(UINT256_TOKEN_ID);
    expect(onChange).toHaveBeenCalledWith(new BigNumber(UINT256_TOKEN_ID));
  });

  it('still rejects values above an explicit max', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useNumericInput(undefined, 0, 0, 30, onChange));

    act(() => result.current.handleChange('31'));

    expect(result.current.stringValue).toBe('');
    expect(onChange).not.toHaveBeenCalled();
  });
});
