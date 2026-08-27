import { act, renderHook } from '@testing-library/react-hooks';

import { useSingleQrCodeRead } from './use-single-qr-code-read.hook';

it('should accept only the first QR code', () => {
  const onQrCodeRead = jest.fn();
  const { result } = renderHook(() => useSingleQrCodeRead(onQrCodeRead));

  act(() => {
    result.current.handleQrCodeRead('first');
    result.current.handleQrCodeRead('second');
  });

  expect(onQrCodeRead).toHaveBeenCalledTimes(1);
  expect(onQrCodeRead).toHaveBeenCalledWith('first');
  expect(result.current.isScanEnabled).toEqual(false);
});
