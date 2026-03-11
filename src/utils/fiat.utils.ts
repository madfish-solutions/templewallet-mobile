import BigNumber from 'bignumber.js';

import { mutezToTz } from './tezos.util';

const DEFAULT_EXCHANGE_RATE = 1;

export const atomicTokenAmountToFiat = (
  atomicAmount: BigNumber,
  decimals: number,
  tokenToUsdRate?: BigNumber.Value | null,
  fiatToUsdRate?: BigNumber.Value | null
) =>
  mutezToTz(atomicAmount, decimals)
    .times(tokenToUsdRate ?? DEFAULT_EXCHANGE_RATE)
    .times(fiatToUsdRate ?? DEFAULT_EXCHANGE_RATE);
