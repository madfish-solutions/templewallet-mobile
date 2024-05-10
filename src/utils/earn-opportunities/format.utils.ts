import { BigNumber } from 'bignumber.js';

import { PERCENTAGE_DECIMALS } from 'src/config/earn-opportunities';

export const formatOptionalPercentage = (percentage: BigNumber.Value | undefined, emptyValueStr = '---') =>
  percentage === undefined || new BigNumber(percentage).isNaN()
    ? emptyValueStr
    : `${new BigNumber(percentage).toFixed(PERCENTAGE_DECIMALS)}%`;
