import { useEffect, useMemo, useState } from 'react';

import { templeWalletApi } from '../api.service';

export const useAliceBobPairInfo = () => {
  const [minAliceBobExchangeAmount, setMinAliceBobExchangeAmount] = useState(0);
  const [maxAliceBobExchangeAmount, setMaxAliceBobExchangeAmount] = useState(0);

  const isAliceBobError = useMemo(() => minAliceBobExchangeAmount === -1, [minAliceBobExchangeAmount]);
  const isAliceBobDisabled = useMemo(
    () => minAliceBobExchangeAmount === 0 || isAliceBobError,
    [minAliceBobExchangeAmount]
  );

  useEffect(() => {
    (async () => {
      try {
        const result = await templeWalletApi.get<{ minAmount: number; maxAmount: number }>('/alice-bob-pair-info');
        setMinAliceBobExchangeAmount(result.data.minAmount);
        setMaxAliceBobExchangeAmount(result.data.maxAmount);
      } catch {
        setMinAliceBobExchangeAmount(-1);
      }
    })();
  }, []);

  return { minAliceBobExchangeAmount, maxAliceBobExchangeAmount, isAliceBobError, isAliceBobDisabled };
};
