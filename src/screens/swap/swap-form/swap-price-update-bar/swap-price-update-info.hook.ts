import { useEffect, useMemo, useState } from 'react';
import { BlockInterface } from 'swap-router-sdk';

import { BLOCK_DURATION } from './swap-price-update-bar';

export const useSwapPriceUpdateInfo = (block: BlockInterface) => {
  const blockTimestamp = block.header.timestamp.toString();
  const blockEndTimestamp = useMemo(() => new Date(blockTimestamp).getTime() + BLOCK_DURATION, [blockTimestamp]);
  const [nowTimestamp, setNowTimestamp] = useState(new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => setNowTimestamp(new Date().getTime()), 1000);

    return () => clearInterval(interval);
  }, []);

  return { nowTimestamp, blockEndTimestamp };
};
