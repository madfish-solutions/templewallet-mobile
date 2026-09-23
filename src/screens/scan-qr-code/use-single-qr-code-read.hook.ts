import { useCallback, useRef, useState } from 'react';

export const useSingleQrCodeRead = (onQrCodeRead: (data: string) => void) => {
  const scanHandledRef = useRef(false);
  const [isScanEnabled, setIsScanEnabled] = useState(true);

  const handleQrCodeRead = useCallback(
    (data: string) => {
      if (scanHandledRef.current) {
        return;
      }

      scanHandledRef.current = true;
      setIsScanEnabled(false);
      onQrCodeRead(data);
    },
    [onQrCodeRead]
  );

  return { handleQrCodeRead, isScanEnabled };
};
