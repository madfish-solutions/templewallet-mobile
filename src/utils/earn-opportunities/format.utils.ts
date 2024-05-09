import { BigNumber } from 'bignumber.js';

import { PERCENTAGE_DECIMALS } from 'src/config/earn-opportunities';

export const formatOptionalPercentage = (percentage: BigNumber.Value | undefined) =>
  percentage === undefined ? '---' : `${new BigNumber(percentage).toFixed(PERCENTAGE_DECIMALS)}%`;
